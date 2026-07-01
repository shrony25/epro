// ==UserScript==
// @name         Evaluation Pro
// @namespace    shahin.lged.eprocure.pro
// @version      1.10
// @description  Auto Evaluation + Clarification + JV Control + Finalize Responsiveness - Licensed Lifetime Edition by Mohammad Shahin Hossain, LGED
// @author       Mohammad Shahin Hossain
// @copyright    2025 Mohammad Shahin Hossain, Surveyor, LGED. All Rights Reserved.
// @license      Commercial - Lifetime Single Device - srony25@gmail.com
// @match        https://www.eprocure.gov.bd/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      shrony25.github.io
// @run-at       document-idle
// @updateURL    https://shrony25.github.io/epro/evaluation-pro.meta.js
// @downloadURL  https://shrony25.github.io/epro/evaluation-pro.user.js
// @supportURL   mailto:srony25@gmail.com
// ==/UserScript==

/*
 * Evaluation Pro v1.10 - Lifetime Edition
 * =====================================================
 * Developed by: Mohammad Shahin Hossain
 * Designation : Surveyor, LGED
 * Email       : srony25@gmail.com
 * Mobile      : 01675350306
 * Website     : https://shrony25.github.io/Shahin_1/
 * 
 * PRODUCT     : Evaluation Pro
 * VERSION     : 1.10
 * BUILD       : 2025-06-30
 * 
 * LICENSE     : COMMERCIAL LIFETIME - SINGLE DEVICE
 * Copyright © 2025 Mohammad Shahin Hossain. All Rights Reserved.
 * 
 * Unauthorized copying, modification, distribution is strictly prohibited
 * and punishable under Bangladesh Copyright Act 2000.
 * 
 * This software is developed and owned by Mohammad Shahin Hossain, LGED
 */

(function () {
    'use strict';

    /******************** AUTHORSHIP PROTECTION ********************/
    const AUTHOR_SIGNATURE = "SHAHIN_LGED_EPRO_V51_2025";
    const AUTHOR_HASH = "9f4c2a7e1b"; // tamper check
    // DO NOT REMOVE CREDIT - LICENSE WILL FAIL
    // Developed by Mohammad Shahin Hossain, Surveyor, LGED
    
    /******************** PRO CONFIG - SHAHIN EDITION ********************/
    const PRO_CONFIG = {
        CREDIT_NAME: "Mohammad Shahin Hossain",
        CREDIT_TITLE: "Surveyor, LGED",
        CREDIT_COMPANY: "Local Government Engineering Department",
        CREDIT_EMAIL: "srony25@gmail.com",
        CREDIT_PHONE: "01675350306",
        CREDIT_WEBSITE: "https://shrony25.github.io/Shahin_1/",
        LICENSE_SERVER: "", // offline lifetime
        
        SECRET_SALT: "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!",
        
        PRODUCT_NAME: "Evaluation Pro",
        VERSION: "1.10",
        BUILD: "20250630-SHAHIN-v110"",
        AUTHOR: "Mohammad Shahin Hossain - LGED",
        
        REASON_TEXT: "Accepted",
        FINAL_REASON_TEXT: "Responsive",
        MIN_DELAY: 2400,
        MAX_DELAY: 4500,
        MAX_TENDERS_PER_RUN: 200,

        TRIAL_USES: 2,
        LIFETIME: true
    };

    // Anti-tamper: verify author
    (function verifyAuthorship(){
        const sig = [PRO_CONFIG.CREDIT_NAME, PRO_CONFIG.CREDIT_EMAIL, PRO_CONFIG.CREDIT_PHONE].join("|");
        if (!sig.includes("Shahin") || !sig.includes("srony25@gmail.com") || !sig.includes("01675350306")) {
            document.documentElement.innerHTML = '<div style="font-family:sans-serif;padding:40px;text-align:center"><h2 style="color:#e11d48">License Tampering Detected</h2><p>This copy of Evaluation Pro has been illegally modified.<br>Original Author: Mohammad Shahin Hossain, LGED<br>Contact: srony25@gmail.com / 01675350306</p></div>';
            throw new Error("AUTHORSHIP_TAMPER_"+AUTHOR_SIGNATURE);
        }
    })();

    /******************** SECURE STORAGE ********************/
    const SecureStore = {
        prefix: "epro_shahin_v51_",
        set(key, val) {
            try {
                if (typeof GM_setValue !== 'undefined') return GM_setValue(this.prefix + key, val);
                localStorage.setItem(this.prefix + key, JSON.stringify(val));
            } catch(e){}
        },
        get(key, def = null) {
            try {
                if (typeof GM_getValue !== 'undefined') return GM_getValue(this.prefix + key, def);
                const v = localStorage.getItem(this.prefix + key);
                return v ? JSON.parse(v) : def;
            } catch(e){ return def; }
        }
    };

    /******************** LIFETIME LICENSE ENGINE ********************/
    const LicenseEngine = {
        async sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },

        async getDeviceFingerprint() {
            const components = [
                navigator.userAgent,
                navigator.language,
                navigator.platform,
                navigator.hardwareConcurrency || 4,
                screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
                new Date().getTimezoneOffset(),
                Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka',
                navigator.deviceMemory || 8,
                (()=>{ try {
                    const c = document.createElement('canvas');
                    const ctx = c.getContext('2d');
                    ctx.textBaseline = "top";
                    ctx.font = "14px 'Arial'";
                    ctx.fillStyle = "#2a2a2a";
                    ctx.fillRect(0,0,300,50);
                    ctx.fillStyle = "#069";
                    ctx.fillText("Shahin LGED Evaluation Pro "+AUTHOR_SIGNATURE, 2, 2);
                    ctx.fillStyle = "rgba(102,204,0,0.7)";
                    ctx.fillText(PRO_CONFIG.CREDIT_EMAIL, 4, 20);
                    return c.toDataURL();
                } catch(e){ return 'canvas_err'; } })()
            ].join('|SHAHIN|');
            const hash = await this.sha256(components + PRO_CONFIG.SECRET_SALT);
            return `SHAHIN-${hash.substring(0,4).toUpperCase()}-${hash.substring(5,9).toUpperCase()}-${hash.substring(10,14).toUpperCase()}`;
        },

        async generateExpectedKey(deviceId) {
            const raw = await this.sha256(deviceId + '|' + PRO_CONFIG.SECRET_SALT + '|LIFETIME_V51_SHAHIN_LGED');
            const a = raw.substring(2,6).toUpperCase();
            const b = raw.substring(10,14).toUpperCase();
            const c = raw.substring(18,22).toUpperCase();
            const d = raw.substring(26,30).toUpperCase();
            return `${a}-${b}-${c}-${d}`;
        },

        async validateLicense(key, deviceId) {
            if (!key || key.length < 15) return false;
            const expected = await this.generateExpectedKey(deviceId);
            return key.toUpperCase().trim() === expected;
        },

        async check() {
            const deviceId = await this.getDeviceFingerprint();
            const license = SecureStore.get('license_key', '');
            const activatedDevice = SecureStore.get('license_device', '');
            // Lifetime - no expiry check, expiry = 0
            if (license && activatedDevice === deviceId) {
                const valid = await this.validateLicense(license, deviceId);
                if (valid) {
                    return { valid: true, pro: true, lifetime: true, deviceId, license };
                }
            }
            const trialUses = SecureStore.get('trial_uses', 0);
            if (trialUses < PRO_CONFIG.TRIAL_USES) {
                return { valid: true, pro: false, trial: true, remaining: PRO_CONFIG.TRIAL_USES - trialUses, deviceId };
            }
            return { valid: false, reason: 'unlicensed', deviceId };
        },

        async activate(key) {
            const deviceId = await this.getDeviceFingerprint();
            const valid = await this.validateLicense(key, deviceId);
            if (!valid) return { success: false, error: 'Invalid lifetime license key for this computer.\nContact: Mohammad Shahin Hossain\n01675350306 / srony25@gmail.com' };
            SecureStore.set('license_key', key.toUpperCase());
            SecureStore.set('license_device', deviceId);
            SecureStore.set('license_expiry', 0); // 0 = Lifetime
            SecureStore.set('license_type', 'LIFETIME');
            SecureStore.set('activated_at', Date.now());
            SecureStore.set('licensed_to', PRO_CONFIG.CREDIT_NAME);
            return { success: true, deviceId, lifetime: true };
        }
    };

    /******************** LOGGER ********************/
    const Logger = {
        logs: [],
        add(msg, type='info') {
            const entry = `[${new Date().toLocaleTimeString('bn-BD')}] ${msg}`;
            this.logs.unshift(entry);
            if (this.logs.length > 60) this.logs.pop();
            console.log(`%c[SHAHIN EPRO] ${msg}`, 'color:#00c896;font-weight:bold');
            this.render();
        },
        render() {
            const el = document.getElementById('epro-log');
            if (el) el.innerHTML = this.logs.slice(0,9).map(l=>`<div style="padding:2px 0;border-bottom:1px dotted #173a3a">${l}</div>`).join('');
        }
    };

    /******************** CREDIT INJECTION ********************/
    function injectPermanentCredit() {
        // Watermark top
        if (!document.getElementById('shahin-watermark')) {
            const wm = document.createElement('div');
            wm.id = 'shahin-watermark';
            wm.style.cssText = 'position:fixed;top:8px;right:10px;background:linear-gradient(90deg,#065f46,#0d9488);color:#ecfdf5;font-size:10px;padding:5px 12px;border-radius:20px;z-index:999998;border:1px solid #14b8a6;letter-spacing:.3px;font-family:Inter,system-ui,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.25)';
            wm.innerHTML = `⚡ Evaluation Pro v1.10 • Developed by <b>Mohammad Shahin Hossain, LGED</b>`;
            document.body.appendChild(wm);
        }
        // Footer credit on eProcure pages
        const tryFooter = () => {
            const footer = document.querySelector('footer, #footer, .footer');
            if (footer && !footer.querySelector('.shahin-credit-insert')) {
                const cr = document.createElement('div');
                cr.className = 'shahin-credit-insert';
                cr.style.cssText = 'text-align:center;padding:8px;font-size:11px;color:#0f766e;background:#ecfdf5;border-top:2px solid #14b8a6;margin-top:12px';
                cr.innerHTML = `Automation powered by <strong>Mohammad Shahin Hossain</strong>, Surveyor, LGED • 01675350306 • srony25@gmail.com • <a href="https://shrony25.github.io/Shahin_1/" target="_blank" style="color:#0d9488">Portfolio</a>`;
                footer.prepend(cr);
            }
        };
        tryFooter();
        setTimeout(tryFooter, 2000);
    }
    setInterval(injectPermanentCredit, 5000);

    /******************** PRO UI - SHAHIN BRANDED ********************/
    function injectStyles() {
        if (document.getElementById('epro-shahin-styles')) return;
        const css = document.createElement('style');
        css.id = 'epro-shahin-styles';
        css.textContent = `
        #epro-pro-panel{position:fixed;bottom:22px;right:22px;width:360px;background:linear-gradient(160deg,#042f2e,#0f172a 55%, #022c22);color:#e2e8f0;border-radius:18px;box-shadow:0 16px 50px rgba(0,0,0,.5), 0 0 0 1px #134e4a;z-index:999999;font-family:"Inter","Noto Sans Bengali",system-ui,sans-serif;font-size:13px;overflow:hidden}
        #epro-pro-header{background:linear-gradient(90deg,#047857,#0d9488,#0891b2);padding:15px 16px;color:#fff}
        #epro-pro-header .title{font-size:15px;font-weight:800;letter-spacing:.2px}
        #epro-pro-header .sub{font-size:11px;opacity:.95;margin-top:2px}
        .epro-ver-badge{float:right;background:rgba(255,255,255,.18);padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700}
        #epro-body{padding:14px 16px}
        .epro-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
        .epro-btn{border:none;border-radius:10px;padding:10px 10px;font-weight:700;cursor:pointer;transition:.14s;font-size:12.5px;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18)}
        .epro-btn:hover{transform:translateY(-1.5px);filter:brightness(1.07)}
        .epro-start{background:linear-gradient(135deg,#059669,#10b981)}
        .epro-pause{background:linear-gradient(135deg,#d97706,#f59e0b)}
        .epro-stop{background:linear-gradient(135deg,#dc2626,#ef4444);grid-column:span 2}
        .epro-jv{background:linear-gradient(135deg,#7c3aed,#8b5cf6);grid-column:span 2}
        .epro-final-start{background:linear-gradient(135deg,#0284c7,#0ea5e9)}
        .epro-final-stop{background:#334155}
        .epro-status{background:#011e1b;border:1px solid #134e4a;border-radius:12px;padding:11px;margin:9px 0;font-size:12.5px;line-height:1.6}
        .epro-status b{color:#2dd4bf}
        .epro-logbox{background:#001412;border-radius:10px;padding:9px;height:156px;overflow-y:auto;font-size:11px;color:#5eead4;margin-top:8px;border:1px solid #0f3a36;font-family:ui-monospace,Consolas,monospace}
        .epro-credit{text-align:center;padding:13px 14px;background:linear-gradient(180deg,#001a18,#001412);border-top:1px solid #134e4a;font-size:11.5px;color:#99f6e4;line-height:1.55}
        .epro-credit strong{color:#2dd4bf;font-size:13px}
        .epro-credit a{color:#5eead4;text-decoration:none}
        .epro-license-gate{position:fixed;inset:0;background:radial-gradient(1200px 800px at 70% -10%, #0d948844, transparent), rgba(1,22,20,.96);z-index:1000000;display:flex;align-items:center;justify-content:center;font-family:Inter,"Noto Sans Bengali",system-ui,sans-serif}
        .epro-license-card{background:linear-gradient(165deg,#042f2e,#0f172a);color:#e2e8f0;border-radius:22px;padding:30px 28px;width:500px;max-width:94vw;box-shadow:0 30px 80px rgba(0,0,0,.65);border:1px solid #0f766e}
        .epro-license-card h2{margin:0 0 4px;font-size:22px;background:linear-gradient(90deg,#2dd4bf,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800}
        .epro-input{width:100%;padding:13px 14px;background:#001a18;border:1.5px solid #0f766e;border-radius:12px;color:#5eead4;font-size:16px;letter-spacing:1.5px;text-align:center;margin:12px 0;box-sizing:border-box;font-family:ui-monospace,Consolas,monospace}
        .epro-input:focus{outline:none;border-color:#2dd4bf;box-shadow:0 0 0 3px #2dd4bf33}
        .epro-activate{background:linear-gradient(90deg,#059669,#0d9488);color:#fff;border:none;padding:13px;border-radius:12px;width:100%;font-weight:800;cursor:pointer;font-size:15px;letter-spacing:.3px}
        .epro-device{font-family:ui-monospace,Consolas,monospace;background:#001a18;padding:10px 12px;border-radius:10px;font-size:13px;color:#2dd4bf;text-align:center;border:1px dashed #0f766e;margin:8px 0;letter-spacing:.5px}
        .epro-min{position:fixed;bottom:22px;right:22px;background:linear-gradient(90deg,#047857,#0d9488);color:#fff;padding:11px 18px;border-radius:30px;z-index:999999;cursor:pointer;font-family:Inter,sans-serif;font-weight:700;box-shadow:0 10px 30px rgba(13,148,136,.4);display:none;font-size:13px}
        .shahin-seal{font-size:10px;color:#5eead4;opacity:.9}
        `;
        document.head.appendChild(css);
    }

    function createLicenseGate(licenseInfo) {
        injectStyles();
        if (document.getElementById('epro-license-gate')) return;
        const gate = document.createElement('div');
        gate.className = 'epro-license-gate';
        gate.id = 'epro-license-gate';
        gate.innerHTML = `
        <div class="epro-license-card">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
            <div>
              <h2>Evaluation Pro v1.10</h2>
              <div style="color:#5eead4;font-size:13px;font-weight:600">Lifetime License • Shahin Edition</div>
            </div>
            <span style="background:#065f46;color:#a7f3d0;font-size:10px;padding:4px 9px;border-radius:20px;font-weight:700">LIFETIME</span>
          </div>

          <div style="background:#001a18;border:1px solid #0f3a36;border-radius:12px;padding:12px;margin:14px 0;font-size:12.5px;color:#99f6e4;line-height:1.6">
            Developed by<br>
            <strong style="color:#2dd4bf;font-size:15px">Mohammad Shahin Hossain</strong><br>
            Surveyor, Local Government Engineering Department (LGED)<br>
            📱 01675350306 • ✉️ srony25@gmail.com<br>
            🌐 <a href="https://shrony25.github.io/Shahin_1/" target="_blank" style="color:#5eead4">shrony25.github.io/Shahin_1</a>
          </div>

          <div style="font-size:12px;color:#a7f3d0">আপনার Device ID (এটি বিক্রেতাকে দিন):</div>
          <div class="epro-device" id="epro-device-id">${licenseInfo.deviceId}</div>
          <button id="epro-copy-id" style="width:100%;background:#0f3a36;color:#5eead4;border:1px solid #0f766e;padding:9px;border-radius:10px;cursor:pointer;font-size:12.5px;margin-bottom:14px;font-weight:600">📋 Copy Device ID</button>

          <input id="epro-key-input" class="epro-input" placeholder="XXXX-XXXX-XXXX-XXXX" maxlength="19" />
          <button id="epro-activate-btn" class="epro-activate">🔓 Activate Lifetime License</button>

          ${licenseInfo.trial ? `
          <div style="margin-top:14px;text-align:center;color:#fcd34d;font-size:13px;font-weight:600">Trial Mode: ${licenseInfo.remaining} বার ব্যবহার বাকি</div>
          <button id="epro-trial-btn" style="margin-top:9px;width:100%;background:#1e293b;color:#fde68a;border:1px solid #444;padding:11px;border-radius:10px;cursor:pointer;font-weight:600">Trial দিয়ে চালিয়ে যান</button>
          ` : `
          <div style="margin-top:14px;text-align:center;color:#fca5a5;font-size:13px">Trial শেষ। Lifetime License প্রয়োজন।<br>যোগাযোগ: 01675350306</div>`}

          <div style="margin-top:20px;border-top:1px solid #134e4a;padding-top:14px;text-align:center;font-size:11.5px;color:#5eead4;line-height:1.7">
            © 2025 <strong style="color:#2dd4bf">Mohammad Shahin Hossain</strong><br>
            Surveyor, LGED • All Rights Reserved<br>
            <span class="shahin-seal">Licensed Software • Single PC • Lifetime • Unauthorized distribution prohibited</span>
          </div>
        </div>`;
        document.body.appendChild(gate);

        document.getElementById('epro-copy-id').onclick = () => {
            navigator.clipboard.writeText(licenseInfo.deviceId);
            alert('Device ID copied!\n\n' + licenseInfo.deviceId + '\n\nএটি Shahin ভাইকে পাঠান:\n01675350306\nsrony25@gmail.com');
        };
        const keyInput = document.getElementById('epro-key-input');
        keyInput.addEventListener('input', e => {
            let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
            e.target.value = v.match(/.{1,4}/g)?.join('-').substring(0,19) || v;
        });
        document.getElementById('epro-activate-btn').onclick = async () => {
            const key = keyInput.value.trim();
            const res = await LicenseEngine.activate(key);
            if (res.success) {
                alert('✅ Lifetime License Activated!\n\nDeveloped by:\nMohammad Shahin Hossain\nSurveyor, LGED\n\nDevice: ' + res.deviceId + '\n\nধন্যবাদ!');
                location.reload();
            } else {
                alert('❌ ' + res.error);
            }
        };
        const trialBtn = document.getElementById('epro-trial-btn');
        if (trialBtn) trialBtn.onclick = () => {
            const uses = SecureStore.get('trial_uses', 0);
            SecureStore.set('trial_uses', uses + 1);
            gate.remove();
            initProApp({valid:true, pro:false, trial:true, remaining: PRO_CONFIG.TRIAL_USES - uses -1});
        };
    }

    function createProPanel(licenseInfo) {
        if (document.getElementById('epro-pro-panel')) return;
        injectStyles();
        injectPermanentCredit();

        const panel = document.createElement('div');
        panel.id = 'epro-pro-panel';
        panel.innerHTML = `
        <div id="epro-pro-header">
          <span class="epro-ver-badge">LIFETIME v1.10</span>
          <div class="title">Evaluation Pro</div>
          <div class="sub">${licenseInfo.pro ? '✅ Lifetime Licensed • Shahin LGED' : '🧪 Trial Mode'}</div>
        </div>
        <div id="epro-body">
          <div class="epro-status">
            Status: <b id="epro-status-text">STOPPED</b><br>
            <span id="epro-progress">Tender: 0 | Form: 0</span><br>
            <span id="epro-final-progress">Finalize: 0</span>
          </div>
          <div class="epro-grid">
            <button class="epro-btn epro-start" id="epro-start">▶ Start Eval</button>
            <button class="epro-btn epro-pause" id="epro-pause">⏸ Pause</button>
            <button class="epro-btn epro-stop" id="epro-stop">■ Stop</button>
            <button class="epro-btn epro-jv" id="epro-jv">⚙️ JV Rows → No</button>
            <button class="epro-btn epro-final-start" id="epro-final-start">Finalize ▶</button>
            <button class="epro-btn epro-final-stop" id="epro-final-stop">Finalize ■</button>
          </div>
          <div class="epro-logbox" id="epro-log">Shahin Pro Engine initializing...</div>
        </div>
        <div class="epro-credit">
          Developed by<br>
          <strong>Mohammad Shahin Hossain</strong><br>
          Surveyor, LGED<br>
          <span style="font-size:11px">📱 01675350306 • ✉️ srony25@gmail.com</span><br>
          <a href="https://shrony25.github.io/Shahin_1/" target="_blank">🌐 shrony25.github.io/Shahin_1</a><br>
          <span style="font-size:10px;color:#0d9488">© 2025 All Rights Reserved • Lifetime Single-PC License<br>Licensed Device: ${ (licenseInfo.deviceId||'TRIAL').substring(0,19) }</span>
        </div>
        `;
        document.body.appendChild(panel);

        const mini = document.createElement('div');
        mini.id = 'epro-min';
        mini.className = 'epro-min';
        mini.innerHTML = '⚡ Evaluation Pro ▶';
        document.body.appendChild(mini);
        mini.onclick = () => { panel.style.display='block'; mini.style.display='none'; };
        panel.querySelector('#epro-pro-header').ondblclick = () => { panel.style.display='none'; mini.style.display='block'; };

        // events
        document.getElementById('epro-start').onclick = () => {
            SecureStore.set('AUTO_RUN', '1');
            SecureStore.set('FINAL_RUN', '0');
            SecureStore.set('t_i', 0); SecureStore.set('f_i', 0); SecureStore.set('final_i', 0);
            Logger.add('Eval started - Shahin Pro');
            location.reload();
        };
        document.getElementById('epro-pause').onclick = () => {
            const state = SecureStore.get('AUTO_RUN', '0');
            if (state === '1') { SecureStore.set('AUTO_RUN', '2'); Logger.add('Paused'); updateProUI(); }
            else if (state === '2') { SecureStore.set('AUTO_RUN', '1'); location.reload(); }
        };
        document.getElementById('epro-stop').onclick = () => { SecureStore.set('AUTO_RUN', '0'); Logger.add('Stopped'); updateProUI(); };
        document.getElementById('epro-jv').onclick = () => setJVRowsToNo();
        document.getElementById('epro-final-start').onclick = () => {
            SecureStore.set('FINAL_RUN', '1'); SecureStore.set('AUTO_RUN', '0'); SecureStore.set('final_i', 0);
            Logger.add('Finalize started'); location.reload();
        };
        document.getElementById('epro-final-stop').onclick = () => { SecureStore.set('FINAL_RUN', '0'); Logger.add('Finalize stopped'); updateProUI(); };

        updateProUI();
        
        // GM menu
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('© Mohammad Shahin Hossain - LGED', ()=> alert('Evaluation Pro v1.10\n\nDeveloped by:\nMohammad Shahin Hossain\nSurveyor, LGED\n\n01675350306\nsrony25@gmail.com\nhttps://shrony25.github.io/Shahin_1/'));
            GM_registerMenuCommand('📞 Support: 01675350306', ()=> window.open('tel:01675350306'));
        }
    }

    function updateProUI() {
        const st = document.getElementById('epro-status-text');
        if (!st) return;
        const state = SecureStore.get('AUTO_RUN', '0');
        const finalRunning = SecureStore.get('FINAL_RUN', '0') === '1';
        let label = 'STOPPED';
        if (state === '1') label = 'RUNNING (Eval)';
        else if (finalRunning) label = 'RUNNING (Final)';
        else if (state === '2') label = 'PAUSED';
        st.innerText = label;
        const pg = document.getElementById('epro-progress');
        if (pg) pg.innerText = `Tender: ${SecureStore.get('t_i',0)} | Form: ${SecureStore.get('f_i',0)}`;
        const fpg = document.getElementById('epro-final-progress');
        if (fpg) fpg.innerText = `Finalize: ${SecureStore.get('final_i',0)}`;
        const pauseBtn = document.getElementById('epro-pause');
        if (pauseBtn) pauseBtn.innerText = state === '2' ? '▶ Resume' : '⏸ Pause';
    }

    /******************** AUTOMATION CORE ********************/
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randDelay = () => sleep(PRO_CONFIG.MIN_DELAY + Math.random() * (PRO_CONFIG.MAX_DELAY - PRO_CONFIG.MIN_DELAY));
    const normText = el => el && el.innerText ? el.innerText.replace(/\s+/g, " ").trim() : "";
    const isRunning = () => SecureStore.get('AUTO_RUN', '0') === '1';
    const isFinalRunning = () => SecureStore.get('FINAL_RUN', '0') === '1';

    function setJVRowsToNo() {
        const keywords = ["JVCA Partner", "Joint Venture Agreement", "Subcontractor", "JV", "Joint Venture"];
        let changed = 0;
        document.querySelectorAll("table tr").forEach(tr => {
            const firstCell = tr.querySelector("td,th");
            if (!firstCell) return;
            const txt = normText(firstCell).toLowerCase();
            if (!keywords.some(k => txt.includes(k.toLowerCase()))) return;
            tr.querySelectorAll("select").forEach(sel => {
                const noOpt = Array.from(sel.options).find(o => o.text.trim().toLowerCase() === "no");
                if (noOpt && sel.value !== noOpt.value) {
                    sel.value = noOpt.value;
                    sel.dispatchEvent(new Event("change", { bubbles: true }));
                    changed++;
                }
            });
        });
        Logger.add(`JV Control: ${changed} fields → No`);
        alert(changed ? `✅ JV Pro by Shahin\n${changed} টি ফিল্ড 'No' করা হয়েছে।\n\nDeveloped by:\nMohammad Shahin Hossain\nSurveyor, LGED\n01675350306` : "JV সম্পর্কিত কোনো row পাওয়া যায়নি।");
    }

    function hookSubmitInjection() {
        if (window.__eproShahinHooked) return;
        window.__eproShahinHooked = true;
        document.addEventListener("submit", function(e){
            const form = e.target; if (!form) return;
            const reason = form.querySelector("#evalNonCompRemarks");
            const accept = form.querySelector("#techQualify");
            if (reason) { reason.value = PRO_CONFIG.REASON_TEXT; reason.dispatchEvent(new Event("input",{bubbles:true})); }
            if (accept) { accept.checked = true; accept.dispatchEvent(new Event("change",{bubbles:true})); }
        }, true);
    }

    async function tendererList() {
        if (!isRunning()) return;
        const doneTender = Number(SecureStore.get('t_i', 0));
        if (doneTender >= PRO_CONFIG.MAX_TENDERS_PER_RUN) { SecureStore.set('AUTO_RUN', '0'); Logger.add('Max limit reached'); updateProUI(); return; }
        await randDelay();
        const links = Array.from(document.querySelectorAll("a")).filter(a => normText(a) === "Evaluate Tenderer");
        if (links.length === 0) { SecureStore.set('AUTO_RUN','0'); Logger.add('No more tenders'); updateProUI(); return; }
        SecureStore.set('t_i', doneTender + 1); SecureStore.set('f_i', 0);
        Logger.add(`Tender #${doneTender+1} opening…`);
        links[0].click();
    }
    async function formList() {
        if (!isRunning()) return;
        await randDelay();
        const forms = Array.from(document.querySelectorAll("a")).filter(a => normText(a) === "Evaluate Form");
        if (forms.length === 0) {
            SecureStore.set('f_i', 0);
            const dashLink = Array.from(document.querySelectorAll("a")).find(a => normText(a) === "Go back to Dashboard");
            Logger.add('Forms done → dashboard');
            if (dashLink) { await randDelay(); dashLink.click(); } else history.back();
            return;
        }
        const done = Number(SecureStore.get('f_i', 0));
        SecureStore.set('f_i', done + 1);
        Logger.add(`Form #${done+1} evaluating`);
        forms[0].click();
    }
    async function evaluationPage() {
        if (!isRunning()) return;
        await randDelay();
        const reason = document.getElementById("evalNonCompRemarks");
        const accept = document.getElementById("techQualify");
        const submit = document.getElementById("btnPost");
        if (!reason || !submit) return;
        reason.value = PRO_CONFIG.REASON_TEXT;
        reason.dispatchEvent(new Event("input", { bubbles: true }));
        reason.dispatchEvent(new Event("change", { bubbles: true }));
        if (accept) { accept.checked = true; accept.dispatchEvent(new Event("change", { bubbles: true })); }
        Logger.add('✓ Clarification: Accepted');
        await randDelay();
        submit.click();
    }
    async function finalizeList() {
        if (!isFinalRunning()) return;
        await randDelay();
        const allLinks = Array.from(document.querySelectorAll("a")).filter(a => normText(a) === "Finalize Responsiveness");
        const pendingLinks = allLinks.filter(a => {
            const row = a.closest("tr"); if (!row) return true;
            const cells = row.querySelectorAll("td");
            if (cells.length < 3) return true;
            const txt = normText(cells[2]);
            return !txt || txt === "-" || txt === "–" || txt === "--";
        });
        if (pendingLinks.length === 0) { SecureStore.set('FINAL_RUN','0'); Logger.add('✓ All Finalize completed'); updateProUI(); return; }
        const done = Number(SecureStore.get('final_i',0));
        SecureStore.set('final_i', done + 1);
        Logger.add(`Finalize #${done+1}`);
        pendingLinks[0].click();
    }
    async function finalizeDetail() {
        if (!isFinalRunning()) return;
        await randDelay();
        let techResRadio = null;
        document.querySelectorAll("input[type='radio']").forEach(r => {
            const txt = (r.closest("td, label")?.innerText || "").toLowerCase();
            if (txt.includes("technically") && txt.includes("responsive") && !txt.includes("non-responsive") && !txt.includes("non responsive")) techResRadio = r;
        });
        if (techResRadio) { techResRadio.checked = true; techResRadio.dispatchEvent(new Event("change", { bubbles: true })); }
        let reason = null;
        const tds = Array.from(document.querySelectorAll("td"));
        const rCell = tds.find(td => /reason\s*:?/i.test(td.innerText));
        if (rCell) reason = rCell.parentElement.querySelector("textarea");
        if (!reason) reason = document.querySelector("textarea");
        if (reason) { reason.value = PRO_CONFIG.FINAL_REASON_TEXT; reason.dispatchEvent(new Event("input", { bubbles: true })); reason.dispatchEvent(new Event("change", { bubbles: true })); }
        Logger.add('✓ Technically Responsive set');
        await randDelay();
        const submit = document.querySelector("input[type='submit'][value='Submit'], button[type='submit']");
        if (submit) { const oldConfirm = window.confirm; window.confirm = () => true; submit.click(); window.confirm = oldConfirm; }
    }

    function detectPage() {
        const pageText = document.body.innerText || "";
        const links = Array.from(document.querySelectorAll("a"));
        return {
            isEvalPage: document.getElementById("btnPost") && document.getElementById("evalNonCompRemarks"),
            isFormPage: pageText.includes("Company Details") && pageText.includes("Package Information") && pageText.includes("Form Name"),
            isTenderList: pageText.includes("List of Tenderers") || links.some(a => normText(a) === "Evaluate Tenderer"),
            isFinalizeList: links.some(a => normText(a) === "Finalize Responsiveness") || pageText.includes("Finalize Evaluation Status"),
            isFinalizeDetail: pageText.includes("Technically Responsive") && pageText.includes("Technically Non-responsive") && !!document.querySelector("input[type='submit'][value='Submit'], button[type='submit']")
        };
    }

    async function runAutomation() {
        hookSubmitInjection();
        injectPermanentCredit();
        const p = detectPage();
        if (isFinalRunning() && p.isFinalizeDetail) { Logger.add('▶ Finalize Detail'); await finalizeDetail(); }
        else if (isFinalRunning() && p.isFinalizeList) { Logger.add('▶ Finalize List'); await finalizeList(); }
        else if (isRunning() && p.isEvalPage) { Logger.add('▶ Evaluation Page'); await evaluationPage(); }
        else if (isRunning() && p.isFormPage) { Logger.add('▶ Form List'); await formList(); }
        else if (isRunning() && p.isTenderList) { Logger.add('▶ Tenderer List'); await tendererList(); }
        else { Logger.add('Ready - Shahin Pro v1.10'); }
        updateProUI();
    }

    async function initProApp(licenseInfo) {
        createProPanel(licenseInfo);
        Logger.add(`${PRO_CONFIG.PRODUCT_NAME} ${PRO_CONFIG.VERSION}`);
        Logger.add(`© ${PRO_CONFIG.CREDIT_NAME}, ${PRO_CONFIG.CREDIT_TITLE}`);
        Logger.add(`📱 ${PRO_CONFIG.CREDIT_PHONE} • ${PRO_CONFIG.CREDIT_EMAIL}`);
        if (licenseInfo.pro) Logger.add(`✓ LIFETIME LICENSE ACTIVE • ${licenseInfo.deviceId}`);
        else Logger.add(`Trial: ${licenseInfo.remaining} uses left`);
        setInterval(updateProUI, 1500);
        await runAutomation();
    }

    // BOOT
    (async () => {
        injectStyles();
        injectPermanentCredit();
        const lic = await LicenseEngine.check();
        if (!lic.valid) { createLicenseGate(lic); return; }
        if (!lic.pro && lic.trial) {
            const shown = SecureStore.get('trial_gate_shown', false);
            if (!shown) { SecureStore.set('trial_gate_shown', true); createLicenseGate(lic); return; }
        }
        await initProApp(lic);
    })();

    // Console signature
    console.log('%c Evaluation Pro v1.10 ', 'background:#047857;color:#ecfdf5;font-size:14px;padding:6px 12px;border-radius:6px');
    console.log('%c Developed by: Mohammad Shahin Hossain\n Surveyor, LGED\n 01675350306 | srony25@gmail.com\n https://shrony25.github.io/Shahin_1/ ', 'color:#0d9488;font-size:12px');
    console.log('%c © 2025 Mohammad Shahin Hossain - All Rights Reserved - Lifetime Single-PC License ', 'color:#dc2626');

})();
