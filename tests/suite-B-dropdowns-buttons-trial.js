/*
 * Evaluation Pro - Regression Suite B
 * trial limit (5), all settings dropdowns/inputs, all panel buttons,
 * JV control, license gate buttons.
 * Run:  node tests/suite-B-dropdowns-buttons-trial.js <script-to-test>
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const CODE = fs.readFileSync(process.argv[2] || '/home/user/evaluation-pro.user.js', 'utf8');
const SALT = "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!";
const SU = "LIFETIME_V51_SHAHIN_LGED";
const P = 'epro_shahin_v51_';
const mk = (id) => { const h = crypto.createHash('sha256').update(id + '|' + SALT + '|' + SU).digest('hex'); return `${h.substring(2,6)}-${h.substring(10,14)}-${h.substring(18,22)}-${h.substring(26,30)}`.toUpperCase(); };
const PRO_ID = 'SHAHIN-ABCD-1234-EF56';
const PRO_ST = { [P + 'license_key']: JSON.stringify(mk(PRO_ID)), [P + 'license_device']: JSON.stringify(PRO_ID), [P + 'speed_mode']: JSON.stringify('fast') };
const TRIAL_ST = { [P + 'trial_gate_shown']: JSON.stringify(true), [P + 'speed_mode']: JSON.stringify('fast') };

const PLAIN = '<!doctype html><html><body><h1>e-GP</h1></body></html>';
const TENDERERS = `<!doctype html><html><body><div>List of Tenderers</div><table><tbody>${[1,2,3].map(i => `<tr><td>${i}</td><td>T${i}</td><td><a href="#" id="et${i}">Evaluate Tenderer</a></td></tr>`).join('')}</tbody></table></body></html>`;
const JV_PAGE = `<!doctype html><html><body><table>
<tr><td>JVCA Partner</td><td><select id="s1"><option value="1">Yes</option><option value="2">No</option></select></td></tr>
<tr><td>Joint Venture Agreement</td><td><select id="s2"><option value="1">Yes</option><option value="2">No</option></select></td></tr>
<tr><td>Ordinary Row</td><td><select id="s3"><option value="1">Yes</option><option value="2">No</option></select></td></tr>
</table></body></html>`;

let pass = 0, fail = 0;
const check = (n, c, e) => { if (c) { pass++; console.log('  PASS', n); } else { fail++; console.log('  FAIL', n, e === undefined ? '' : '-> ' + e); } };
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function run(html, storage) {
    const dom = new JSDOM(html, { url: 'https://www.eprocure.gov.bd/x', runScripts: 'outside-only', pretendToBeVisual: true });
    const w = dom.window;
    if (storage) for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
    w.GM_setValue = (k, v) => w.localStorage.setItem(k, JSON.stringify(v));
    w.GM_getValue = (k, d) => { const v = w.localStorage.getItem(k); return v === null ? d : JSON.parse(v); };
    w.GM_registerMenuCommand = () => {};
    w.GM_xmlhttpRequest = () => {};
    const alerts = [];
    w.alert = (m) => alerts.push(String(m));
    w.confirm = () => true;
    try { w.navigator.clipboard = { writeText: (t) => { w.__copied = t; return Promise.resolve(); } }; } catch (e) {}
    try { w.crypto.subtle = crypto.webcrypto.subtle; } catch (e) {}
    try {
        Object.defineProperty(w.HTMLElement.prototype, 'innerText', { get() { return this.textContent; }, set(v) { this.textContent = v; }, configurable: true });
    } catch (e) {}
    const clicks = [];
    w.document.addEventListener('click', (e) => clicks.push({ id: e.target.id || '', text: (e.target.textContent || '').trim().substring(0, 25) }));
    w.eval(CODE);
    return { w, d: w.document, clicks, alerts, storage: w.localStorage };
}
const snap = (ls) => { const o = {}; for (let i = 0; i < ls.length; i++) o[ls.key(i)] = ls.getItem(ls.key(i)); return o; };

(async () => {
    console.log('\n=== T15: TRIAL limit = 5 ===');
    let st = Object.assign({}, TRIAL_ST, { [P + 'AUTO_RUN']: JSON.stringify('1') });
    for (let i = 1; i <= 5; i++) {
        let r = run(TENDERERS, st);
        await wait(6000);            // trial speed is forced 'normal' (2.4-4.5s delay)
        check(`use #${i} counted`, r.storage.getItem(P + 'trial_uses') === JSON.stringify(i), 'uses=' + r.storage.getItem(P + 'trial_uses'));
        check(`use #${i} tenderer opened`, r.storage.getItem(P + 't_i') === JSON.stringify(i), 't_i=' + r.storage.getItem(P + 't_i'));
        st = snap(r.storage);
        st[P + 'AUTO_RUN'] = JSON.stringify('1');
    }
    let r6 = run(TENDERERS, st);
    await wait(3000);
    check('6th load shows license gate', !!r6.d.getElementById('epro-license-gate'));
    check('6th load has no pro panel', !r6.d.getElementById('epro-pro-panel'));
    check('trial_uses stays 5', r6.storage.getItem(P + 'trial_uses') === JSON.stringify(5), r6.storage.getItem(P + 'trial_uses'));
    check('trial button hidden when exhausted', !r6.d.getElementById('epro-trial-btn'));
    check('trial-finished notice in gate', r6.d.body.textContent.includes('৫টি evaluation'));

    console.log('\n=== T16: PRO user - trial never counted ===');
    let rp = run(TENDERERS, Object.assign({}, PRO_ST, { [P + 'AUTO_RUN']: JSON.stringify('1') }));
    await wait(4000);
    check('trial_uses not set for pro', rp.storage.getItem(P + 'trial_uses') === null, rp.storage.getItem(P + 'trial_uses'));
    check('pro tenderer opened', rp.storage.getItem(P + 't_i') === JSON.stringify(1), 't_i=' + rp.storage.getItem(P + 't_i'));

    console.log('\n=== T17: all settings dropdowns / inputs / save ===');
    let rs = run(PLAIN, PRO_ST);
    await wait(2600);
    const limSel = rs.d.getElementById('epro-limit-select');
    check('limit options 20/50/100/200/500', JSON.stringify(Array.from(limSel.options).map(o => o.value)) === JSON.stringify(['20','50','100','200','500']));
    check('speed options fast/normal/safe', Array.from(rs.d.getElementById('epro-speed-select').options).map(o => o.value).join(',') === 'fast,normal,safe');
    check('reason default Accepted', rs.d.getElementById('epro-reason-input').value === 'Accepted');
    check('final reason default Responsive', rs.d.getElementById('epro-final-reason-input').value === 'Responsive');
    limSel.value = '200'; limSel.dispatchEvent(new rs.w.Event('change', { bubbles: true }));
    rs.d.getElementById('epro-reason-input').value = 'All OK';
    rs.d.getElementById('epro-final-reason-input').value = 'Fully Responsive';
    const spSel = rs.d.getElementById('epro-speed-select');
    spSel.value = 'safe'; spSel.dispatchEvent(new rs.w.Event('change', { bubbles: true }));
    rs.d.getElementById('epro-settings-btn').click();
    rs.d.getElementById('epro-settings-save').click();
    await wait(900);
    check('custom_limit saved = 200', rs.storage.getItem(P + 'custom_limit') === JSON.stringify(200), rs.storage.getItem(P + 'custom_limit'));
    check('custom_reason saved', rs.storage.getItem(P + 'custom_reason') === JSON.stringify('All OK'));
    check('custom_final_reason saved', rs.storage.getItem(P + 'custom_final_reason') === JSON.stringify('Fully Responsive'));
    check('speed_mode saved = safe', rs.storage.getItem(P + 'speed_mode') === JSON.stringify('safe'));
    check('drawer closed after save', !rs.d.getElementById('epro-settings-drawer').classList.contains('open'));
    check('save btn label restored', rs.d.getElementById('epro-settings-save').textContent === '💾 Save Settings');

    console.log('\n=== T18: trial user - settings locked + Get Pro ===');
    let rt = run(PLAIN, TRIAL_ST);
    await wait(2600);
    check('limit select disabled', rt.d.getElementById('epro-limit-select').disabled === true);
    check('reason input disabled', rt.d.getElementById('epro-reason-input').disabled === true);
    check('speed select disabled', rt.d.getElementById('epro-speed-select').disabled === true);
    check('no save button for trial', !rt.d.getElementById('epro-settings-save'));
    check('Get Pro box in settings', rt.d.body.textContent.includes('Settings Pro Feature'));
    check('Get Pro button in header', !!rt.d.getElementById('epro-buy-pro-hdr'));
    rt.d.getElementById('epro-buy-pro-hdr').click();
    check('header Get Pro opens gate', !!rt.d.getElementById('epro-license-gate'));

    console.log('\n=== T19: all panel buttons ===');
    let rb = run(PLAIN, PRO_ST);
    await wait(2600);
    rb.d.getElementById('epro-start').click();
    check('Start sets AUTO_RUN=1', rb.storage.getItem(P + 'AUTO_RUN') === JSON.stringify('1'));
    check('Start resets counters', rb.storage.getItem(P + 't_i') === JSON.stringify(0) && rb.storage.getItem(P + 'f_i') === JSON.stringify(0));
    rb.d.getElementById('epro-pause').click();
    check('Pause sets AUTO_RUN=2', rb.storage.getItem(P + 'AUTO_RUN') === JSON.stringify('2'), rb.storage.getItem(P + 'AUTO_RUN'));
    check('pause btn label Resume', rb.d.getElementById('epro-pause').textContent.includes('Resume'));
    rb.d.getElementById('epro-stop').click();
    check('Stop sets AUTO_RUN=0', rb.storage.getItem(P + 'AUTO_RUN') === JSON.stringify('0'));
    check('status STOPPED', rb.d.getElementById('epro-status-text').textContent === 'STOPPED');
    rb.d.getElementById('epro-final-start').click();
    check('Finalize start sets FINAL_RUN=1', rb.storage.getItem(P + 'FINAL_RUN') === JSON.stringify('1'));
    rb.d.getElementById('epro-final-stop').click();
    check('Finalize stop sets FINAL_RUN=0', rb.storage.getItem(P + 'FINAL_RUN') === JSON.stringify('0'));

    console.log('\n=== T20: JV Rows -> No ===');
    let rj = run(JV_PAGE, PRO_ST);
    await wait(2600);
    rj.d.getElementById('epro-jv').click();
    check('JV row 1 set to No', rj.d.getElementById('s1').value === '2', rj.d.getElementById('s1').value);
    check('JV row 2 set to No', rj.d.getElementById('s2').value === '2');
    check('non-JV row untouched', rj.d.getElementById('s3').value === '1');
    check('JV alert shown', rj.alerts.some(a => a.includes('JV')));
    check('log has JV Control', rj.d.getElementById('epro-log').textContent.includes('JV Control'));

    console.log('\n=== T21: gate buttons ===');
    let rg = run(PLAIN, null);
    await wait(2600);
    rg.d.getElementById('epro-copy-id').click();
    check('copy device id works', rg.w.__copied && rg.w.__copied.startsWith('SHAHIN-'), rg.w.__copied);
    const devId = rg.d.getElementById('epro-device-id').textContent.trim();
    rg.d.getElementById('epro-key-input').value = mk(devId);
    rg.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('license_key stored after activate', rg.storage.getItem(P + 'license_key') === JSON.stringify(mk(devId).toUpperCase()), rg.storage.getItem(P + 'license_key'));
    check('license_device stored', rg.storage.getItem(P + 'license_device') === JSON.stringify(devId));
    let rg2 = run(PLAIN, null);
    await wait(2600);
    rg2.d.getElementById('epro-key-input').value = 'AAAA-BBBB-CCCC-DDDD';
    rg2.d.getElementById('epro-activate-btn').click();
    await wait(1400);
    check('invalid key -> error alert', rg2.alerts.some(a => a.includes('Invalid')));
    check('no license stored on invalid', rg2.storage.getItem(P + 'license_key') === null);
    let rg3 = run(PLAIN, { [P + 'speed_mode']: JSON.stringify('fast') });
    await wait(2600);
    check('trial gate shows remaining 5', rg3.d.body.textContent.includes('5 বার ব্যবহার বাকি'));
    rg3.d.getElementById('epro-trial-btn').click();
    await wait(600);
    check('trial button -> panel opens', !!rg3.d.getElementById('epro-pro-panel'));

    console.log(`\n==== SUITE B: ${pass} passed, ${fail} failed ====`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('TEST ERROR', e); process.exit(1); });
