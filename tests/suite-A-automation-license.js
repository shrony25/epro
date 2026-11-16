/*
 * Evaluation Pro - Regression Suite A
 * license gate/activate, minimize & fold persistence, mode selector,
 * OTM/LTM mode guard + flash, form/tenderer loops, toast, settings drawer.
 * Run:  node tests/suite-A-automation-license.js <script-to-test>
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const CODE = fs.readFileSync(process.argv[2] || '/home/user/evaluation-pro.user.js', 'utf8');
const SALT = "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!";
const SU = "LIFETIME_V51_SHAHIN_LGED";
const P = 'epro_shahin_v51_';
const mk = (id) => { const h = crypto.createHash('sha256').update(id + '|' + SALT + '|' + SU).digest('hex'); return `${h.substring(2,6)}-${h.substring(10,14)}-${h.substring(18,22)}-${h.substring(26,30)}`.toUpperCase(); };

const OTM_EVAL_PAGE = `<!doctype html><html><body>
<div class="pageHead_1">"View Forms / Seek Clarification "
<span style="float:right;"><a href="Evalclarify.jsp?tenderId=1339708&st=cl&comType=null" class="action-button-goback">Go back to Dashboard</a></span></div>
<div class="tableHead_1 t_space">Tender/Proposal Detail</div>
<table width="100%" cellspacing="0" class="tablelist_1_t_space"><tbody>
<tr><td width="10%" class="t-align-left ff">Evaluation Status :</td></tr>
<tr><td width="86%" class="t-align-left">
<input name="techQualify" type="radio" value="techQualify" id="techQualify" checked>
&nbsp; Accept &nbsp;&nbsp;
<input name="techQualify" type="radio" value="techFail" id="techFail">
&nbsp; Reject
<input name="methodType" type="hidden" value="OTM">
</td></tr>
<tr><td class="t-align-left"><textarea rows="5" id="evalNonCompRemarks" name="evalNonCompRemarks"></textarea></td></tr>
</tbody></table>
<form><div class="t-align_center t_space"><label class="formBtn_1"><input name="btnPost" id="btnPost" type="submit" value="Submit"/></label></div></form>
</body></html>`;

const FORM_LIST_PAGE = `<!doctype html><html><body>
<div class="pageHead_1"><span style="float:right;"><a href="Evalclarify.jsp?tenderId=1&st=cl" class="action-button-goback">Go back to Dashboard</a></span></div>
<div>Company Details</div><div>Package Information</div>
<table><thead><tr><th>Form Name</th><th>Evaluation Status</th><th>Action</th></tr></thead><tbody>
${[1,2,3,4,5,6,7,8,9].map(i => `<tr><td>Form ${i}</td><td>Pending</td><td><a href="#" id="ef${i}">Evaluate Form</a></td></tr>`).join('')}
</tbody></table></body></html>`;

const TENDERER_LIST_PAGE = `<!doctype html><html><body><div>List of Tenderers</div>
<table><tbody>${[1,2,3].map(i => `<tr><td>${i}</td><td>Tenderer ${i}</td><td><a href="#" id="et${i}">Evaluate Tenderer</a></td></tr>`).join('')}</tbody></table></body></html>`;
const PLAIN_PAGE = '<!doctype html><html><body><h1>e-GP</h1></body></html>';

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
    w.GM_xmlhttpRequest = (options) => { if (options && typeof options.onerror === 'function') options.onerror({}); };
    try { w.crypto.subtle = crypto.webcrypto.subtle; } catch (e) {}
    try {
        Object.defineProperty(w.HTMLElement.prototype, 'innerText', { get() { return this.textContent; }, set(v) { this.textContent = v; }, configurable: true });
    } catch (e) {}
    const clicks = [];
    w.document.addEventListener('click', (e) => clicks.push({ id: e.target.id || '', text: (e.target.textContent || '').trim().substring(0, 30), tag: e.target.tagName }));
    const submits = [];
    w.document.addEventListener('submit', () => submits.push(1));
    w.eval(CODE);
    return { w, d: w.document, clicks, submits, storage: w.localStorage };
}
const snap = (ls) => { const o = {}; for (let i = 0; i < ls.length; i++) o[ls.key(i)] = ls.getItem(ls.key(i)); return o; };

(async () => {
    console.log('\n=== T1: fresh install -> license gate + device id ===');
    let r = run(PLAIN_PAGE, null);
    await wait(2600);
    const devEl = r.d.getElementById('epro-device-id');
    check('license gate shown', !!r.d.getElementById('epro-license-gate'));
    check('device id format', devEl && /^SHAHIN-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(devEl.textContent.trim()), devEl && devEl.textContent);
    const id1 = devEl ? devEl.textContent.trim() : '';
    const st1 = snap(r.storage);

    console.log('\n=== T2: activate -> PRO ===');
    st1[P + 'license_key'] = JSON.stringify(mk(id1));
    st1[P + 'license_device'] = JSON.stringify(id1);
    let r2 = run(PLAIN_PAGE, st1);
    await wait(2600);
    check('PRO panel after activation', !!r2.d.getElementById('epro-pro-panel'));
    check('no gate for pro', !r2.d.getElementById('epro-license-gate'));

    console.log('\n=== T3: OLD-style stored license -> instant PRO ===');
    const oldId = 'SHAHIN-66A9-4C3C-A68C';
    let r3 = run(PLAIN_PAGE, { [P + 'license_key']: JSON.stringify(mk(oldId)), [P + 'license_device']: JSON.stringify(oldId) });
    await wait(2600);
    check('old key validates against stored device id', !!r3.d.getElementById('epro-pro-panel'));

    console.log('\n=== T4: mismatch (wrong key stored) -> gate with warning ===');
    let r4 = run(PLAIN_PAGE, { [P + 'license_key']: JSON.stringify('AAAA-BBBB-CCCC-DDDD'), [P + 'license_device']: JSON.stringify('SHAHIN-1111-2222-3333') });
    await wait(2600);
    check('gate shown on mismatch', !!r4.d.getElementById('epro-license-gate'));
    check('mismatch warning visible', r4.d.body.textContent.includes('মিলছে না'));

    console.log('\n=== T5: minimize persistence ===');
    let r5 = run(PLAIN_PAGE, st1);
    await wait(2600);
    r5.d.getElementById('epro-min-btn').click();
    check('panel_minimized saved', r5.storage.getItem(P + 'panel_minimized') === JSON.stringify('1'));
    let r5b = run(PLAIN_PAGE, snap(r5.storage));
    await wait(2600);
    check('panel stays hidden after reload', r5b.d.getElementById('epro-pro-panel').style.display === 'none');
    check('mini pill visible after reload', r5b.d.getElementById('epro-min').style.display === 'block');
    r5b.d.getElementById('epro-min').click();
    check('pill click restores panel', r5b.d.getElementById('epro-pro-panel').style.display === 'block');
    check('minimize flag cleared', r5b.storage.getItem(P + 'panel_minimized') === JSON.stringify('0'));

    console.log('\n=== T6: fold persistence ===');
    let r6 = run(PLAIN_PAGE, st1);
    await wait(2600);
    r6.d.getElementById('epro-fold-btn').click();
    check('panel_folded saved', r6.storage.getItem(P + 'panel_folded') === JSON.stringify('1'));
    check('logbox hidden when folded', r6.d.getElementById('epro-log').style.display === 'none');
    let r6b = run(PLAIN_PAGE, snap(r6.storage));
    await wait(2600);
    check('fold restored after reload', r6b.d.getElementById('epro-log').style.display === 'none');
    r6b.d.getElementById('epro-fold-btn').click();
    check('unfold works', r6b.d.getElementById('epro-log').style.display === 'block');

    console.log('\n=== T7: mode selector persistence ===');
    let r7 = run(PLAIN_PAGE, st1);
    await wait(2600);
    r7.d.getElementById('epro-mode-otm').click();
    check('eval_mode = OTM saved', r7.storage.getItem(P + 'eval_mode') === JSON.stringify('OTM'));
    check('status shows OTM', r7.d.getElementById('epro-mode-text').textContent === 'OTM');
    let r7b = run(PLAIN_PAGE, snap(r7.storage));
    await wait(2600);
    check('mode restored after reload', r7b.d.getElementById('epro-mode-text').textContent === 'OTM');

    console.log('\n=== T8: OTM eval page + LTM mode -> STOP + flash ===');
    const st8 = Object.assign({}, st1, { [P + 'AUTO_RUN']: JSON.stringify('1'), [P + 'speed_mode']: JSON.stringify('fast'), [P + 'eval_mode']: JSON.stringify('LTM') });
    let r8 = run(OTM_EVAL_PAGE, st8);
    await wait(5000);
    check('automation stopped (AUTO_RUN=0)', r8.storage.getItem(P + 'AUTO_RUN') === JSON.stringify('0'), r8.storage.getItem(P + 'AUTO_RUN'));
    check('flash banner visible', r8.d.getElementById('epro-flash').style.display === 'block');
    check('flash text mentions OTM tender detected', r8.d.getElementById('epro-flash').textContent.includes('OTM tender detected'));
    check('reason NOT filled', r8.d.getElementById('evalNonCompRemarks').value === '');
    check('submit NOT clicked', r8.submits.length === 0);
    check('status STOPPED', r8.d.getElementById('epro-status-text').textContent === 'STOPPED');

    console.log('\n=== T9: OTM eval page + OTM mode -> evaluates ===');
    const st9 = Object.assign({}, st1, { [P + 'AUTO_RUN']: JSON.stringify('1'), [P + 'speed_mode']: JSON.stringify('fast'), [P + 'eval_mode']: JSON.stringify('OTM') });
    let r9 = run(OTM_EVAL_PAGE, st9);
    await wait(5000);
    check('reason filled with settings text', r9.d.getElementById('evalNonCompRemarks').value === 'Accepted', JSON.stringify(r9.d.getElementById('evalNonCompRemarks').value));
    check('Accept radio checked', r9.d.getElementById('techQualify').checked === true);
    check('submit fired', r9.submits.length >= 1, 'submits=' + r9.submits.length);
    check('no flash', r9.d.getElementById('epro-flash').style.display !== 'block');
    check('log has clarification line', r9.d.getElementById('epro-log').textContent.includes('Clarification'));

    console.log('\n=== T10: OTM form list -> first Evaluate Form clicked ===');
    let r10 = run(FORM_LIST_PAGE, Object.assign({}, st1, { [P + 'AUTO_RUN']: JSON.stringify('1'), [P + 'speed_mode']: JSON.stringify('fast') }));
    await wait(5000);
    check('first Evaluate Form clicked', r10.clicks.some(c => c.id === 'ef1'), JSON.stringify(r10.clicks.map(c => c.id)));
    check('form counter incremented', r10.storage.getItem(P + 'f_i') === JSON.stringify(1));

    console.log('\n=== T11: no pending forms -> Go back to Dashboard ===');
    let r11 = run(FORM_LIST_PAGE.replace(/Evaluate Form/g, 'View'), Object.assign({}, st1, { [P + 'AUTO_RUN']: JSON.stringify('1'), [P + 'speed_mode']: JSON.stringify('fast') }));
    await wait(7000);
    check('dashboard link clicked', r11.clicks.some(c => /Go back to Dashboard/.test(c.text)), JSON.stringify(r11.clicks.map(c => c.text)));

    console.log('\n=== T12: tenderer list -> first Evaluate Tenderer clicked ===');
    let r12 = run(TENDERER_LIST_PAGE, Object.assign({}, st1, { [P + 'AUTO_RUN']: JSON.stringify('1'), [P + 'speed_mode']: JSON.stringify('fast') }));
    await wait(5000);
    check('first Evaluate Tenderer clicked', r12.clicks.some(c => c.id === 'et1'), JSON.stringify(r12.clicks.map(c => c.id)));
    check('tender counter incremented', r12.storage.getItem(P + 't_i') === JSON.stringify(1));

    console.log('\n=== T13: right click toast ===');
    let r13 = run(PLAIN_PAGE, st1);
    await wait(2600);
    r13.d.getElementById('epro-rc-toggle').click();
    await wait(300);
    const toast = r13.d.getElementById('epro-rc-toast');
    check('toast shown on ON', toast && toast.classList.contains('show'));
    check('toast text ok', toast && toast.textContent.includes('তারিখের বক্সগুলোতে ক্লিক বা সিলেক্ট কাজ না করলে Right Click অপশন টি বন্ধ রাখুন'));
    await wait(4000);
    check('toast auto hidden', !toast.classList.contains('show'));

    console.log('\n=== T14: settings drawer ===');
    let r14 = run(PLAIN_PAGE, st1);
    await wait(2600);
    const dr = r14.d.getElementById('epro-settings-drawer');
    r14.d.getElementById('epro-settings-btn').click();
    check('drawer open', dr.classList.contains('open'));
    r14.d.getElementById('epro-settings-btn').click();
    check('drawer closed on 2nd click', !dr.classList.contains('open'));
    r14.d.getElementById('epro-settings-btn').click();
    r14.d.getElementById('epro-settings-save').click();
    await wait(900);
    check('drawer closed after save', !dr.classList.contains('open'));
    check('custom_limit saved', r14.storage.getItem(P + 'custom_limit') === JSON.stringify(50));

    console.log(`\n==== SUITE A: ${pass} passed, ${fail} failed ====`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('TEST ERROR', e); process.exit(1); });
