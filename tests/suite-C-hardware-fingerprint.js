const fs = require('fs');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const CODE = fs.readFileSync(process.argv[2] || '/home/user/Evaluation-Pro-v1.15-Master-Source.user.js', 'utf8');
const SALT = "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!";
const SU = "LIFETIME_V51_SHAHIN_LGED";
const P = 'epro_shahin_v51_';
const mk = (id) => { const h = crypto.createHash('sha256').update(id + '|' + SALT + '|' + SU).digest('hex'); return `${h.substring(2,6)}-${h.substring(10,14)}-${h.substring(18,22)}-${h.substring(26,30)}`.toUpperCase(); };
const PLAIN = '<!doctype html><html><body><h1>e-GP</h1></body></html>';

let pass = 0, fail = 0;
const check = (n, c, e) => { if (c) { pass++; console.log('  ✅', n); } else { fail++; console.log('  ❌', n, e === undefined ? '' : '→ ' + e); } };
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// hw overrides let us simulate different PCs / reinstall / browser change
function run(html, storage, hw) {
    const dom = new JSDOM(html, { url: 'https://www.eprocure.gov.bd/x', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    if (storage) for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
    w.GM_setValue = (k, v) => w.localStorage.setItem(k, JSON.stringify(v));
    w.GM_getValue = (k, d) => { const v = w.localStorage.getItem(k); return v === null ? d : JSON.parse(v); };
    w.GM_registerMenuCommand = () => {};
    w.GM_xmlhttpRequest = (options) => { if (options && typeof options.onerror === 'function') options.onerror({}); };
    const alerts = []; w.alert = (m) => alerts.push(String(m)); w.confirm = () => true;
    try { w.crypto.subtle = crypto.webcrypto.subtle; } catch (e) {}
    try {
        Object.defineProperty(w.HTMLElement.prototype, 'innerText', { get() { return this.textContent; }, set(v) { this.textContent = v; }, configurable: true });
    } catch (e) {}
    if (hw) {
        try { Object.defineProperty(w.navigator, 'platform', { value: hw.platform, configurable: true }); } catch (e) {}
        try { Object.defineProperty(w.navigator, 'hardwareConcurrency', { value: hw.cpu, configurable: true }); } catch (e) {}
        try { Object.defineProperty(w.navigator, 'deviceMemory', { value: hw.ram, configurable: true }); } catch (e) {}
        try { Object.defineProperty(w.navigator, 'language', { value: hw.lang, configurable: true }); } catch (e) {}
        try { Object.defineProperty(w.screen, 'width', { value: hw.w, configurable: true }); } catch (e) {}
        try { Object.defineProperty(w.screen, 'height', { value: hw.h, configurable: true }); } catch (e) {}
        // fake WebGL renderer string incl. driver version
        try {
            w.HTMLCanvasElement.prototype.getContext = function (type) {
                if (type !== 'webgl' && type !== 'experimental-webgl') return null;
                return {
                    getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 1 }),
                    getParameter: (p) => (p === 1 ? hw.gpu : null)
                };
            };
        } catch (e) {}
    }
    w.eval(CODE);
    return { w, d: w.document, storage: w.localStorage, alerts };
}

const HW_A = { platform: 'Win32', cpu: 8, ram: 8, lang: 'en-US', w: 1920, h: 1080, gpu: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9316)' };
const HW_B = { platform: 'Win32', cpu: 8, ram: 8, lang: 'en-US', w: 1920, h: 1080, gpu: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9651)' }; // reinstalled windows -> new driver
const HW_C = { platform: 'Win32', cpu: 4, ram: 4, lang: 'en-US', w: 1366, h: 768, gpu: 'ANGLE (NVIDIA, NVIDIA GeForce GT 730 Direct3D11 vs_5_0 ps_5_0, D3D11-31.0.15.4601)' }; // different PC

(async () => {
    console.log('\n=== T22: same PC -> same device id (stable) ===');
    let a1 = run(PLAIN, null, HW_A); await wait(2600);
    const id1 = a1.d.getElementById('epro-device-id').textContent.trim();
    let a2 = run(PLAIN, null, HW_A); await wait(2600);
    const id2 = a2.d.getElementById('epro-device-id').textContent.trim();
    check('id format', /^SHAHIN-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(id1), id1);
    check('same PC, two fresh installs -> SAME id (browser/profile change ok)', id1 === id2, id1 + ' vs ' + id2);
    check('no random device_id stored any more', a1.storage.getItem(P + 'device_id') === null, a1.storage.getItem(P + 'device_id'));

    console.log('\n=== T23: different hardware -> different id ===');
    let c = run(PLAIN, null, HW_C); await wait(2600);
    const idC = c.d.getElementById('epro-device-id').textContent.trim();
    check('different PC -> different id', idC !== id1, idC);

    console.log('\n=== T24: RAM difference -> different id ===');
    let ram = run(PLAIN, null, Object.assign({}, HW_A, { ram: 16 })); await wait(2600);
    check('different RAM -> different id', ram.d.getElementById('epro-device-id').textContent.trim() !== id1);

    console.log('\n=== T25: Windows reinstall (new gpu driver) -> different id ===');
    let b = run(PLAIN, null, HW_B); await wait(2600);
    const idB = b.d.getElementById('epro-device-id').textContent.trim();
    check('reinstall -> different id', idB !== id1, idB);

    console.log('\n=== T26: after Windows reinstall (storage wiped) old key must FAIL ===');
    const keyA = mk(id1);
    let bLic = run(PLAIN, null, HW_B);           // fresh storage, reinstalled windows
    await wait(2600);
    check('gate shown (no license in storage)', !!bLic.d.getElementById('epro-license-gate'));
    bLic.d.getElementById('epro-key-input').value = keyA;
    bLic.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('old key REJECTED after reinstall', bLic.storage.getItem(P + 'license_key') === null, bLic.storage.getItem(P + 'license_key'));
    check('error alert shown to client', bLic.alerts.some(a => a.includes('Invalid')), (bLic.alerts.join('|')||'').substring(0,50));
    // but on the SAME pc it still works (fresh storage = new profile)
    let sameFresh = run(PLAIN, null, HW_A);
    await wait(2600);
    sameFresh.d.getElementById('epro-key-input').value = keyA;
    sameFresh.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('same key accepted on same PC with fresh storage (new profile)', sameFresh.storage.getItem(P + 'license_key') === JSON.stringify(keyA.toUpperCase()), sameFresh.storage.getItem(P + 'license_key'));

    console.log('\n=== T27: key works on same PC after "browser change" (fresh storage) ===');
    let same = run(PLAIN, { [P + 'license_key']: JSON.stringify(keyA), [P + 'license_device']: JSON.stringify(id1) }, HW_A);
    await wait(2600);
    check('key A accepted on same PC', !!same.d.getElementById('epro-pro-panel'));

    console.log('\n=== T28: legacy key (issued before v1.15) still activates ===');
    const legacyId = 'SHAHIN-66A9-4C3C-A68C';
    const legacyKey = mk(legacyId);
    let leg = run(PLAIN, { [P + 'device_id']: JSON.stringify(legacyId) }, HW_A);
    await wait(2600);
    leg.d.getElementById('epro-key-input').value = legacyKey;
    leg.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('legacy key activates via fallback', leg.storage.getItem(P + 'license_key') === JSON.stringify(legacyKey.toUpperCase()), leg.storage.getItem(P + 'license_key'));
    check('license_device stored as hardware id', leg.storage.getItem(P + 'license_device') === JSON.stringify(id1), leg.storage.getItem(P + 'license_device'));

    console.log('\n=== T29: wrong key rejected ===');
    let wrong = run(PLAIN, { [P + 'device_id']: JSON.stringify(legacyId) }, HW_A);
    await wait(2600);
    wrong.d.getElementById('epro-key-input').value = 'AAAA-BBBB-CCCC-DDDD';
    wrong.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('wrong key rejected', wrong.storage.getItem(P + 'license_key') === null);

    console.log(`\n================ RESULT: ${pass} passed, ${fail} failed ================`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('TEST ERROR', e); process.exit(1); });
