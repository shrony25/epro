// ==UserScript==
// @name         Evaluation Pro
// @namespace    shahin.lged.eprocure.pro
// @version      1.13
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
 * Evaluation Pro v1.13 - Lifetime Edition
 * =====================================================
 * Developed by: Mohammad Shahin Hossain
 * Designation : Surveyor, LGED
 * Email       : srony25@gmail.com
 * Mobile      : 01675350306
 * Website     : https://shrony25.github.io/Shahin_1/
 * 
 * PRODUCT     : Evaluation Pro
 * VERSION     : 1.13
 * BUILD       : 2025-09-28-SHAHIN-v113-UPDATE
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
        VERSION: "1.13",
        BUILD: "20250928-SHAHIN-v113",
        AUTHOR: "Mohammad Shahin Hossain - LGED",
        
        REASON_TEXT: "Accepted",
        FINAL_REASON_TEXT: "Responsive",
        MIN_DELAY: 2400,
        MAX_DELAY: 4500,
        MAX_TENDERS_PER_RUN: 200,

        TRIAL_USES: 5,
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

    /******************** EFFECTIVE SETTINGS HELPERS (PRO) ********************/
    function getEffectiveLimit(){
        // Trial fixed 5, Pro selectable 20/50/100/200/500 default 50
        const isPro = window.__PRO_LICENSE_ACTIVE === true;
        if (!isPro) return 5;
        const custom = Number(SecureStore.get('custom_limit', 50));
        const allowed = [20,50,100,200,500];
        return allowed.includes(custom) ? custom : 50;
    }
    function getEffectiveReason(){
        const isPro = window.__PRO_LICENSE_ACTIVE === true;
        if (!isPro) return PRO_CONFIG.REASON_TEXT;
        return SecureStore.get('custom_reason', PRO_CONFIG.REASON_TEXT) || PRO_CONFIG.REASON_TEXT;
    }
    function getEffectiveFinalReason(){
        const isPro = window.__PRO_LICENSE_ACTIVE === true;
        if (!isPro) return PRO_CONFIG.FINAL_REASON_TEXT;
        return SecureStore.get('custom_final_reason', PRO_CONFIG.FINAL_REASON_TEXT) || PRO_CONFIG.FINAL_REASON_TEXT;
    }
    function getEffectiveDelay(){
        const isPro = window.__PRO_LICENSE_ACTIVE === true;
        const mode = isPro ? SecureStore.get('speed_mode','normal') : 'normal';
        if (mode === 'fast') return {min:1200, max:2000};
        if (mode === 'safe') return {min:4000, max:7000};
        return {min:2400, max:4500};
    }

    /******************** RIGHT CLICK ENABLE LOGIC ********************/
    let rightClickStyleEl = null;
    function onContextMenuAllow(e){
        // Allow right click menu, stop e-GP blocking
        // Don't break datepicker - datepicker uses click not contextmenu
        e.stopPropagation();
        // Do not preventDefault - let browser show menu
    }
    function onCopyAllow(e){
        e.stopPropagation();
    }
    function applyRightClickMode(enabled){
        try{
            if (enabled) {
                document.addEventListener('contextmenu', onContextMenuAllow, true);
                document.addEventListener('copy', onCopyAllow, true);
                document.addEventListener('cut', onCopyAllow, true);
                // Remove blocking attributes
                document.querySelectorAll('[oncontextmenu]').forEach(el=> el.removeAttribute('oncontextmenu'));
                document.querySelectorAll('[oncopy]').forEach(el=> el.removeAttribute('oncopy'));
                document.querySelectorAll('[oncut]').forEach(el=> el.removeAttribute('oncut'));
                document.oncontextmenu = null;
                if (document.body) document.body.oncontextmenu = null;
                // Enable text selection via CSS
                if (!rightClickStyleEl) {
                    rightClickStyleEl = document.createElement('style');
                    rightClickStyleEl.id = 'epro-rc-style';
                    rightClickStyleEl.textContent = `* { user-select: text !important; -webkit-user-select: text !important; } input, textarea { user-select: text !important; }`;
                    document.head.appendChild(rightClickStyleEl);
                }
            } else {
                document.removeEventListener('contextmenu', onContextMenuAllow, true);
                document.removeEventListener('copy', onCopyAllow, true);
                document.removeEventListener('cut', onCopyAllow, true);
                if (rightClickStyleEl) { rightClickStyleEl.remove(); rightClickStyleEl = null; }
            }
            SecureStore.set('right_click_enabled', enabled ? '1' : '0');
            const st = document.getElementById('epro-rc-status');
            const tog = document.getElementById('epro-rc-toggle');
            if (st) st.textContent = enabled ? 'ON' : 'OFF';
            if (st) st.style.color = enabled ? '#2dd4bf' : '#94a3b8';
            if (tog) { if (enabled) tog.classList.add('on'); else tog.classList.remove('on'); }
        }catch(e){}
    }

    /******************** RIGHT CLICK TOAST (auto hide) ********************/
    const RC_TOAST_TEXT = "⚠️ তারিখের বক্সগুলোতে ক্লিক বা সিলেক্ট কাজ না করলে Right Click অপশন টি বন্ধ রাখুন ⚠️";
    let rcToastTimer = null;
    function showRcToast(){
        try{
            const wrap = document.querySelector('.epro-top-tools');
            if (!wrap) return;
            let toast = document.getElementById('epro-rc-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'epro-rc-toast';
                toast.className = 'epro-toast';
                wrap.appendChild(toast);
            }
            toast.textContent = RC_TOAST_TEXT;
            if (rcToastTimer) { clearTimeout(rcToastTimer); rcToastTimer = null; }
            requestAnimationFrame(()=> { toast.classList.add('show'); });
            rcToastTimer = setTimeout(()=>{
                if (toast) toast.classList.remove('show');
                rcToastTimer = null;
            }, 3500);
        }catch(e){}
    }

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
        // Footer credit on eProcure pages
        const tryFooter = () => {
            const footer = document.querySelector('footer, #footer, .footer');
            if (footer && !footer.querySelector('.shahin-credit-insert')) {
                const cr = document.createElement('div');
                cr.className = 'shahin-credit-insert';
                cr.style.cssText = 'text-align:center;padding:8px;font-size:11px;color:#0f766e;background:#ecfdf5;border-top:2px solid #14b8a6;margin-top:12px';
                cr.innerHTML = `Automation powered by <strong>Mohammad Shahin Hossain</strong>, Surveyor, LGED • 01675350306 • srony25@gmail.com • <a href="https://shrony25.github.io/Shahin_1/" target="_blank" style="color:#0d9488">Website</a>`;
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
        #epro-pro-panel{position:fixed;bottom:12px;right:12px;width:342px;background:linear-gradient(160deg,#042f2e,#0f172a 55%, #022c22);color:#e2e8f0;border-radius:16px;box-shadow:0 16px 50px rgba(0,0,0,.5), 0 0 0 1px #134e4a;z-index:999999;font-family:"Inter","Noto Sans Bengali",system-ui,sans-serif;font-size:12.5px;overflow:hidden;max-height:92vh;overflow-y:auto}
        #epro-pro-header{background:linear-gradient(90deg,#047857,#0d9488,#0891b2);padding:11px 12px;color:#fff;position:relative}
        #epro-pro-header .title{font-size:14px;font-weight:800;letter-spacing:.2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap}
        #epro-pro-header .sub{font-size:10.5px;opacity:.95;margin-top:2px}
        .epro-ver-small{font-size:10px;opacity:.9;background:rgba(255,255,255,.18);padding:1px 6px;border-radius:10px;font-weight:700;letter-spacing:.2px}
        #epro-body{padding:10px 12px}
        .epro-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
        .epro-btn{border:none;border-radius:8px;padding:7px 8px;font-weight:700;cursor:pointer;transition:.14s;font-size:11.5px;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18)}
        .epro-btn:hover{transform:translateY(-1.5px);filter:brightness(1.07)}
        .epro-start{background:linear-gradient(135deg,#059669,#10b981)}
        .epro-pause{background:linear-gradient(135deg,#d97706,#f59e0b)}
        .epro-stop{background:linear-gradient(135deg,#dc2626,#ef4444);grid-column:span 2}
        .epro-jv{background:linear-gradient(135deg,#7c3aed,#8b5cf6);grid-column:span 2}
        .epro-final-start{background:linear-gradient(135deg,#0284c7,#0ea5e9)}
        .epro-final-stop{background:#334155}
        .epro-status{background:#011e1b;border:1px solid #134e4a;border-radius:10px;padding:8px 10px;margin:6px 0;font-size:11px;line-height:1.5}
        .epro-status b{color:#2dd4bf}
        .epro-top-tools{position:relative;display:flex;justify-content:space-between;align-items:center;background:#001a18;border:1px solid #134e4a;border-radius:8px;padding:6px 9px;margin:0 0 6px 0;font-size:10.5px;color:#cbd5e1}
        .epro-top-tools .epro-rc-label{display:flex;align-items:center;gap:5px;font-weight:600}
        .epro-toast{position:absolute;top:calc(100% + 6px);left:0;right:0;background:linear-gradient(160deg,#1c1917,#0c0a09);border:1px solid #f59e0b;border-radius:10px;padding:7px 9px;font-size:10.5px;line-height:1.5;color:#fde68a;box-shadow:0 10px 26px rgba(0,0,0,.55);opacity:0;transform:translateY(-6px);transition:opacity .25s ease,transform .25s ease;pointer-events:none;z-index:5;text-align:center}
        .epro-toast.show{opacity:1;transform:translateY(0)}
        .epro-toggle{position:relative;width:32px;height:18px;background:#334155;border-radius:20px;cursor:pointer;transition:.2s;flex-shrink:0}
        .epro-toggle.on{background:#10b981;box-shadow:0 0 8px rgba(16,185,129,.5)}
        .epro-toggle-dot{position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}
        .epro-toggle.on .epro-toggle-dot{left:16px}
        .epro-logbox{background:#001412;border-radius:8px;padding:7px;height:110px;overflow-y:auto;font-size:10.5px;color:#5eead4;margin-top:6px;border:1px solid #0f3a36;font-family:ui-monospace,Consolas,monospace}
        .epro-credit{text-align:center;padding:10px 12px;background:linear-gradient(180deg,#001a18,#001412);border-top:1px solid #134e4a;font-size:10.5px;color:#99f6e4;line-height:1.4}
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
        .epro-settings-drawer{overflow:hidden;max-height:0;opacity:0;transform:translateY(-6px);background:#001a18;border-top:1px solid #134e4a;border-bottom:1px solid #134e4a;padding:0 14px;margin:0 -12px 0 -12px;transition:max-height .3s ease,opacity .22s ease,transform .22s ease,padding .22s ease,margin .22s ease}
        .epro-settings-drawer.open{max-height:460px;opacity:1;transform:translateY(0);padding:12px 14px;margin:0 -12px 10px -12px}
        .epro-setting-row{display:flex;justify-content:space-between;align-items:center;margin:10px 0;font-size:12px;color:#cbd5e1}
        .epro-setting-row span{font-weight:600}
        .epro-select{background:#011e1b;border:1px solid #0f766e;color:#5eead4;border-radius:8px;padding:6px 8px;font-size:12px;min-width:110px;outline:none}
        .epro-select:focus{border-color:#2dd4bf}
        .epro-input-small{background:#011e1b;border:1px solid #0f766e;color:#5eead4;border-radius:8px;padding:6px 8px;font-size:12px;width:150px;outline:none}
        .epro-input-small:focus{border-color:#2dd4bf;box-shadow:0 0 0 2px #2dd4bf33}
        .epro-win-btn{background:rgba(255,255,255,0.22);border:none;color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;font-weight:bold;transition:.15s}
        .epro-win-btn:hover{background:rgba(255,255,255,.32)}
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
              <h2>Evaluation Pro v1.13</h2>
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
            gate.remove();
            initProApp({valid:true, pro:false, trial:true, remaining: PRO_CONFIG.TRIAL_USES - uses, deviceId: licenseInfo.deviceId});
        };
    }

    function makeDraggable(element, handleEl, onClickCallback) {
        let isDragging = false, hasMoved = false;
        let startX, startY, initialLeft, initialTop;
        handleEl = handleEl || element;
        handleEl.style.cursor = 'move';
        handleEl.title = 'Drag to move anywhere';
        
        handleEl.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT' || e.target.classList.contains('epro-win-btn') || e.target.closest('.epro-toggle') || e.target.closest('button')) return;
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
            element.style.left = initialLeft + 'px';
            element.style.top = initialTop + 'px';
            element.style.margin = '0';
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            element.style.left = (initialLeft + dx) + 'px';
            element.style.top = (initialTop + dy) + 'px';
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        if (onClickCallback) {
            element.addEventListener('click', function(e) {
                if (!hasMoved) onClickCallback(e);
            });
        }
    }

    function createProPanel(licenseInfo) {
        if (document.getElementById('epro-pro-panel')) return;
        injectStyles();
        injectPermanentCredit();

        const savedLimit = SecureStore.get('custom_limit', 50);
        const savedReason = SecureStore.get('custom_reason', PRO_CONFIG.REASON_TEXT);
        const savedFinalReason = SecureStore.get('custom_final_reason', PRO_CONFIG.FINAL_REASON_TEXT);
        const savedSpeed = SecureStore.get('speed_mode', 'normal');
        const rcEnabled = SecureStore.get('right_click_enabled', '0') === '1';
        const isPro = licenseInfo.pro === true;

        const panel = document.createElement('div');
        panel.id = 'epro-pro-panel';
        panel.innerHTML = `
        <div id="epro-pro-header">
          <div style="float:right;display:flex;gap:5px;align-items:center;">
            <button id="epro-settings-btn" class="epro-win-btn" title="Pro Settings" style="font-size:13px;padding:2px 7px;">⚙️</button>
            <button id="epro-fold-btn" class="epro-win-btn" title="Compact/Expand View">▲</button>
            <button id="epro-min-btn" class="epro-win-btn" title="Minimize Panel">⎯</button>
          </div>
          <div class="title">Evaluation Pro <span class="epro-ver-small">v1.13</span> ${!isPro ? `<button id="epro-buy-pro-hdr" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;padding:2px 8px;border-radius:12px;font-size:10.5px;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(245,158,11,.4);">👑 Get Pro</button>` : ''}</div>
          <div class="sub">${isPro ? '✅ Lifetime Licensed • Shahin LGED' : `🧪 Trial Mode (${licenseInfo.remaining || 0}/5 এভুলেশন বাকি)`}</div>
        </div>
        <div id="epro-body">
          <div class="epro-top-tools">
            <span class="epro-rc-label">🖱️ Right Click: <b id="epro-rc-status" style="color:${rcEnabled ? '#2dd4bf' : '#94a3b8'}">${rcEnabled ? 'ON' : 'OFF'}</b></span>
            <div id="epro-rc-toggle" class="epro-toggle ${rcEnabled ? 'on' : ''}" title="Date Box এ সমস্যা হলে Right Click OFF রাখুন"><div class="epro-toggle-dot"></div></div>
          </div>
          <div class="epro-status">
            Status: <b id="epro-status-text">STOPPED</b><br>
            <span id="epro-progress">Tender: 0 | Form: 0</span><br>
            <span id="epro-final-progress">Finalize: 0</span>
          </div>

          <div id="epro-settings-drawer" class="epro-settings-drawer">
            <div style="font-weight:800;color:#2dd4bf;margin-bottom:8px;font-size:12.5px;display:flex;justify-content:space-between;align-items:center;">
              <span>⚙️ Pro Settings</span>
              <span style="font-size:10px;background:${isPro ? '#065f46' : '#7f1d1d'};color:#fff;padding:2px 7px;border-radius:10px;">${isPro ? 'PRO' : 'LOCKED'}</span>
            </div>
            
            <div class="epro-setting-row">
              <span>Evaluation Limit</span>
              <select id="epro-limit-select" class="epro-select" ${!isPro ? 'disabled' : ''}>
                <option value="20" ${savedLimit==20?'selected':''}>20</option>
                <option value="50" ${savedLimit==50?'selected':''}>50</option>
                <option value="100" ${savedLimit==100?'selected':''}>100</option>
                <option value="200" ${savedLimit==200?'selected':''}>200</option>
                <option value="500" ${savedLimit==500?'selected':''}>500</option>
              </select>
            </div>

            <div class="epro-setting-row">
              <span>Reason Text</span>
              <input id="epro-reason-input" class="epro-input-small" value="${savedReason}" maxlength="60" placeholder="Accepted" ${!isPro ? 'disabled' : ''}>
            </div>

            <div class="epro-setting-row">
              <span>Finalize Reason</span>
              <input id="epro-final-reason-input" class="epro-input-small" value="${savedFinalReason}" maxlength="60" placeholder="Responsive" ${!isPro ? 'disabled' : ''}>
            </div>

            <div class="epro-setting-row">
              <span>Speed Mode</span>
              <select id="epro-speed-select" class="epro-select" ${!isPro ? 'disabled' : ''}>
                <option value="fast" ${savedSpeed=='fast'?'selected':''}>Fast (1.2-2s)</option>
                <option value="normal" ${savedSpeed=='normal'?'selected':''}>Normal (2.4-4.5s)</option>
                <option value="safe" ${savedSpeed=='safe'?'selected':''}>Safe (4-7s)</option>
              </select>
            </div>

            ${!isPro ? `<div style="background:#450a0a;border:1px solid #7f1d1d;border-radius:8px;padding:8px;margin-top:10px;font-size:11px;color:#fecaca;text-align:center;">🔒 Settings Pro Feature<br>Pro নিলে Limit, Reason, Speed কাস্টম করতে পারবেন<br><button id="epro-settings-buy-pro" style="margin-top:6px;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;padding:5px 12px;border-radius:12px;font-size:11px;font-weight:800;cursor:pointer;">👑 Get Pro</button></div>` : `<button id="epro-settings-save" class="epro-btn epro-start" style="width:100%;margin-top:12px;padding:9px;font-size:12.5px;">💾 Save Settings</button>`}
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
        mini.innerHTML = `⚡ Evaluation Pro v1.13 ${!isPro ? `<span id="epro-min-buy-pro" style="background:#f59e0b;color:#000;padding:2px 7px;border-radius:10px;font-size:11px;font-weight:800;margin:0 4px;cursor:pointer;">👑 Get Pro</span>` : ''} ▶`;
        document.body.appendChild(mini);

        makeDraggable(panel, panel.querySelector('#epro-pro-header'));
        makeDraggable(mini, mini, () => { panel.style.display='block'; mini.style.display='none'; });

        const buyHdr = panel.querySelector('#epro-buy-pro-hdr');
        if (buyHdr) buyHdr.onclick = (e) => { e.stopPropagation(); createLicenseGate(licenseInfo); };
        const buyMin = mini.querySelector('#epro-min-buy-pro');
        if (buyMin) buyMin.onclick = (e) => { e.stopPropagation(); createLicenseGate(licenseInfo); };
        const buySet = panel.querySelector('#epro-settings-buy-pro');
        if (buySet) buySet.onclick = (e) => { e.stopPropagation(); createLicenseGate(licenseInfo); };

        panel.querySelector('#epro-min-btn').onclick = (e) => {
            e.stopPropagation();
            panel.style.display='none';
            mini.style.display='block';
        };

        const foldBtn = panel.querySelector('#epro-fold-btn');
        const logBox = panel.querySelector('#epro-log');
        const creditBox = panel.querySelector('.epro-credit');
        const settingsDrawer = panel.querySelector('#epro-settings-drawer');
        let isFolded = false;
        foldBtn.onclick = (e) => {
            e.stopPropagation();
            isFolded = !isFolded;
            if (isFolded) {
                logBox.style.display = 'none';
                creditBox.style.display = 'none';
                if (settingsDrawer) settingsDrawer.classList.remove('open');
                foldBtn.textContent = '▼';
            } else {
                logBox.style.display = 'block';
                creditBox.style.display = 'block';
                foldBtn.textContent = '▲';
            }
        };

        panel.querySelector('#epro-pro-header').ondblclick = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
            panel.style.display='none';
            mini.style.display='block';
        };

        // Settings toggle (smooth open / close)
        const settingsBtn = panel.querySelector('#epro-settings-btn');
        if (settingsBtn) {
            settingsBtn.onclick = (e) => {
                e.stopPropagation();
                if (!settingsDrawer) return;
                settingsDrawer.classList.toggle('open');
            };
        }

        // Settings save (Pro only)
        const saveBtn = panel.querySelector('#epro-settings-save');
        if (saveBtn) {
            saveBtn.onclick = (e) => {
                e.stopPropagation();
                const limitSel = document.getElementById('epro-limit-select');
                const reasonInp = document.getElementById('epro-reason-input');
                const finalReasonInp = document.getElementById('epro-final-reason-input');
                const speedSel = document.getElementById('epro-speed-select');
                if (limitSel) SecureStore.set('custom_limit', Number(limitSel.value));
                if (reasonInp) SecureStore.set('custom_reason', reasonInp.value.trim() || PRO_CONFIG.REASON_TEXT);
                if (finalReasonInp) SecureStore.set('custom_final_reason', finalReasonInp.value.trim() || PRO_CONFIG.FINAL_REASON_TEXT);
                if (speedSel) SecureStore.set('speed_mode', speedSel.value);
                Logger.add(`⚙️ Settings Saved • Limit:${limitSel ? limitSel.value : ''} • Speed:${speedSel ? speedSel.value : ''}`);
                saveBtn.textContent = '✅ Saved!';
                setTimeout(()=>{
                    saveBtn.textContent = '💾 Save Settings';
                    const drawer = document.getElementById('epro-settings-drawer');
                    if (drawer) drawer.classList.remove('open');
                }, 500);
            };
        }

        // Right Click Toggle (top tools row - free for all)
        const rcToggle = document.getElementById('epro-rc-toggle');
        if (rcToggle) {
            rcToggle.onclick = (e) => {
                e.stopPropagation();
                const isOn = rcToggle.classList.contains('on');
                applyRightClickMode(!isOn);
                if (!isOn) showRcToast();
                Logger.add(!isOn ? '🖱️ Right Click Enabled' : '🖱️ Right Click Disabled • Date Box Safe Mode');
            };
        }
        // Apply saved right click state on load
        setTimeout(()=> applyRightClickMode(rcEnabled), 500);

        // events
        document.getElementById('epro-start').onclick = () => {
            SecureStore.set('AUTO_RUN', '1');
            SecureStore.set('FINAL_RUN', '0');
            SecureStore.set('t_i', 0); SecureStore.set('f_i', 0); SecureStore.set('final_i', 0);
            Logger.add(`Eval started • Limit:${getEffectiveLimit()} • Reason:${getEffectiveReason()} • Shahin Pro`);
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
            GM_registerMenuCommand('© Mohammad Shahin Hossain - LGED', ()=> alert('Evaluation Pro v1.13\n\nDeveloped by:\nMohammad Shahin Hossain\nSurveyor, LGED\n\n01675350306\nsrony25@gmail.com\nhttps://shrony25.github.io/Shahin_1/'));
            GM_registerMenuCommand('📞 Support: 01675350306', ()=> window.open('tel:01675350306'));
            GM_registerMenuCommand('⚙️ Settings', ()=> {
                const d = document.getElementById('epro-settings-drawer');
                if (d) { d.classList.toggle('open'); const p = document.getElementById('epro-pro-panel'); if (p) p.style.display='block'; const m = document.getElementById('epro-min'); if (m) m.style.display='none'; }
            });
            GM_registerMenuCommand('🖱️ Toggle Right Click', ()=> {
                const tog = document.getElementById('epro-rc-toggle');
                if (tog) tog.click();
            });
        }
    }

    function updateProUI() {
        const st = document.getElementById('epro-status-text');
        if (!st) return;
        const state = SecureStore.get('AUTO_RUN', '0');
        const finalRunning = SecureStore.get('FINAL_RUN', '0') === '1';
        let label = 'STOPPED';
        if (state === '1') label = `RUNNING (Eval • Limit:${getEffectiveLimit()})`;
        else if (finalRunning) label = 'RUNNING (Final)';
        else if (state === '2') label = 'PAUSED';
        st.innerText = label;
        const pg = document.getElementById('epro-progress');
        if (pg) pg.innerText = `Tender: ${SecureStore.get('t_i',0)}/${getEffectiveLimit()} | Form: ${SecureStore.get('f_i',0)}`;
        const fpg = document.getElementById('epro-final-progress');
        if (fpg) fpg.innerText = `Finalize: ${SecureStore.get('final_i',0)}`;
        const pauseBtn = document.getElementById('epro-pause');
        if (pauseBtn) pauseBtn.innerText = state === '2' ? '▶ Resume' : '⏸ Pause';
    }

    /******************** AUTOMATION CORE ********************/
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const randDelay = () => {
        const d = getEffectiveDelay();
        return sleep(d.min + Math.random() * (d.max - d.min));
    };
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
            if (reason) { reason.value = getEffectiveReason(); reason.dispatchEvent(new Event("input",{bubbles:true})); }
            if (accept) { accept.checked = true; accept.dispatchEvent(new Event("change",{bubbles:true})); }
        }, true);
    }

    async function tendererList() {
        if (!isRunning()) return;
        const doneTender = Number(SecureStore.get('t_i', 0));
        const limit = getEffectiveLimit();
        if (doneTender >= limit) { SecureStore.set('AUTO_RUN', '0'); Logger.add(`✓ Limit reached: ${limit}`); updateProUI(); return; }
        if (doneTender >= PRO_CONFIG.MAX_TENDERS_PER_RUN) { SecureStore.set('AUTO_RUN', '0'); Logger.add('Max limit reached'); updateProUI(); return; }
        await randDelay();
        const links = Array.from(document.querySelectorAll("a")).filter(a => normText(a) === "Evaluate Tenderer");
        if (links.length === 0) { SecureStore.set('AUTO_RUN','0'); Logger.add('No more tenders'); updateProUI(); return; }
        SecureStore.set('t_i', doneTender + 1); SecureStore.set('f_i', 0);
        Logger.add(`Tender #${doneTender+1}/${limit} opening…`);
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
        const effReason = getEffectiveReason();
        reason.value = effReason;
        reason.dispatchEvent(new Event("input", { bubbles: true }));
        reason.dispatchEvent(new Event("change", { bubbles: true }));
        if (accept) { accept.checked = true; accept.dispatchEvent(new Event("change", { bubbles: true })); }
        Logger.add(`✓ Clarification: ${effReason}`);
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
        const effFinalReason = getEffectiveFinalReason();
        if (reason) { reason.value = effFinalReason; reason.dispatchEvent(new Event("input", { bubbles: true })); reason.dispatchEvent(new Event("change", { bubbles: true })); }
        Logger.add(`✓ Technically ${effFinalReason} set`);
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
        else { Logger.add(`Ready - Shahin Pro v1.13 • Limit:${getEffectiveLimit()} • ${getEffectiveReason()}`); }
        updateProUI();
    }

    async function initProApp(licenseInfo) {
        window.__PRO_LICENSE_ACTIVE = licenseInfo.pro;
        window.__DEVICE_ID = licenseInfo.deviceId;
        createProPanel(licenseInfo);
        Logger.add(`${PRO_CONFIG.PRODUCT_NAME} ${PRO_CONFIG.VERSION}`);
        Logger.add(`© ${PRO_CONFIG.CREDIT_NAME}, ${PRO_CONFIG.CREDIT_TITLE}`);
        Logger.add(`📱 ${PRO_CONFIG.CREDIT_PHONE} • ${PRO_CONFIG.CREDIT_EMAIL}`);
        if (licenseInfo.pro) Logger.add(`✓ LIFETIME LICENSE ACTIVE • ${licenseInfo.deviceId} • Limit:${getEffectiveLimit()}`);
        else Logger.add(`Trial: ${licenseInfo.remaining} uses left • Limit:5`);
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
    console.log('%c Evaluation Pro v1.13 ', 'background:#047857;color:#ecfdf5;font-size:14px;padding:6px 12px;border-radius:6px');
    console.log('%c Developed by: Mohammad Shahin Hossain\n Surveyor, LGED\n 01675350306 | srony25@gmail.com\n https://shrony25.github.io/Shahin_1/ ', 'color:#0d9488;font-size:12px');
    console.log('%c © 2025 Mohammad Shahin Hossain - All Rights Reserved - Lifetime Single-PC License ', 'color:#dc2626');

})();
