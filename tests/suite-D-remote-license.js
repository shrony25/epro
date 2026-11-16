/*
 * Evaluation Pro - Regression Suite D
 * Remote license status: active, revoked, not registered, daily cache,
 * and offline-allowed policy.
 * Run: node tests/suite-D-remote-license.js <master-source>
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

const SOURCE_PATH = process.argv[2] || '/home/user/Evaluation-Pro-v1.16-Master-Source.user.js';
const SOURCE = fs.readFileSync(SOURCE_PATH, 'utf8');
const CODE = SOURCE;
const SALT = 'SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!';
const SUFFIX = 'LIFETIME_V51_SHAHIN_LGED';
const PREFIX = 'epro_shahin_v51_';
const DEVICE_ID = 'SHAHIN-ABCD-1234-EF56';
const licenseKey = (id) => {
    const hash = crypto.createHash('sha256').update(id + '|' + SALT + '|' + SUFFIX).digest('hex');
    return `${hash.substring(2, 6)}-${hash.substring(10, 14)}-${hash.substring(18, 22)}-${hash.substring(26, 30)}`.toUpperCase();
};
const PRO_STORAGE = {
    [PREFIX + 'license_key']: JSON.stringify(licenseKey(DEVICE_ID)),
    [PREFIX + 'license_device']: JSON.stringify(DEVICE_ID)
};
const PLAIN = '<!doctype html><html><body><h1>e-GP</h1></body></html>';

let pass = 0;
let fail = 0;
const check = (name, condition, details) => {
    if (condition) {
        pass += 1;
        console.log('  PASS', name);
    } else {
        fail += 1;
        console.log('  FAIL', name, details === undefined ? '' : '-> ' + details);
    }
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function snapshot(storage) {
    const result = {};
    for (let i = 0; i < storage.length; i += 1) result[storage.key(i)] = storage.getItem(storage.key(i));
    return result;
}

function run(response, storage, requestMode = 'response') {
    const dom = new JSDOM(PLAIN, {
        url: 'https://www.eprocure.gov.bd/x',
        runScripts: 'outside-only',
        pretendToBeVisual: true
    });
    const w = dom.window;
    for (const [key, value] of Object.entries(storage || PRO_STORAGE)) w.localStorage.setItem(key, value);
    w.GM_setValue = (key, value) => w.localStorage.setItem(key, JSON.stringify(value));
    w.GM_getValue = (key, fallback) => {
        const value = w.localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    };
    w.GM_registerMenuCommand = () => {};
    let requestCount = 0;
    w.GM_xmlhttpRequest = (options) => {
        requestCount += 1;
        setTimeout(() => {
            if (requestMode === 'offline') {
                options.onerror({});
                return;
            }
            options.onload({ status: 200, responseText: JSON.stringify(response) });
        }, 0);
    };
    w.alert = () => {};
    try { w.crypto.subtle = crypto.webcrypto.subtle; } catch (e) {}
    try {
        Object.defineProperty(w.HTMLElement.prototype, 'innerText', {
            get() { return this.textContent; },
            set(value) { this.textContent = value; },
            configurable: true
        });
    } catch (e) {}
    w.eval(CODE);
    return { w, d: w.document, requestCount: () => requestCount, storage: w.localStorage };
}

(async () => {
    console.log('\n=== D1: active response allows the Pro panel ===');
    let result = run({ ok: true, status: 'active', licenseId: 'LICENSE-001' });
    await wait(250);
    check('active response shows panel', !!result.d.getElementById('epro-pro-panel'));
    check('active response performs one request', result.requestCount() === 1, result.requestCount());
    check('active status is cached', JSON.parse(result.storage.getItem(PREFIX + 'remote_license_status')) === 'active');

    console.log('\n=== D2: revoked response gates the Pro panel ===');
    result = run({ ok: false, status: 'revoked' });
    await wait(250);
    check('revoked response shows license gate', !!result.d.getElementById('epro-license-gate'));
    check('revoked notice is visible', result.d.body.textContent.includes('revoke'));
    check('revoked status is cached', JSON.parse(result.storage.getItem(PREFIX + 'remote_license_status')) === 'revoked');

    console.log('\n=== D3: not registered response gates the Pro panel ===');
    result = run({ ok: false, status: 'not_registered' });
    await wait(250);
    check('unregistered response shows license gate', !!result.d.getElementById('epro-license-gate'));
    check('unregistered notice is visible', result.d.body.textContent.includes('registered'));

    console.log('\n=== D4: a fresh active cache avoids another request ===');
    const cachedStorage = {
        ...PRO_STORAGE,
        [PREFIX + 'remote_license_status']: JSON.stringify('active'),
        [PREFIX + 'remote_license_checked_at']: JSON.stringify(Date.now())
    };
    result = run({ ok: false, status: 'revoked' }, cachedStorage);
    await wait(250);
    check('fresh cache still shows panel', !!result.d.getElementById('epro-pro-panel'));
    check('fresh cache makes no request', result.requestCount() === 0, result.requestCount());

    console.log('\n=== D5: an expired cache checks again ===');
    const expiredStorage = {
        ...PRO_STORAGE,
        [PREFIX + 'remote_license_status']: JSON.stringify('active'),
        [PREFIX + 'remote_license_checked_at']: JSON.stringify(Date.now() - 25 * 60 * 60 * 1000)
    };
    result = run({ ok: false, status: 'revoked' }, expiredStorage);
    await wait(250);
    check('expired cache accepts the new revoke', !!result.d.getElementById('epro-license-gate'));
    check('expired cache makes one request', result.requestCount() === 1, result.requestCount());

    console.log('\n=== D6: server outage follows the selected allow-indefinitely policy ===');
    result = run({}, PRO_STORAGE, 'offline');
    await wait(250);
    check('offline server still shows local Pro panel', !!result.d.getElementById('epro-pro-panel'));
    check('offline request was attempted', result.requestCount() === 1, result.requestCount());

    console.log(`\n==== SUITE D: ${pass} passed, ${fail} failed ====\n`);
    process.exit(fail ? 1 : 0);
})();
