# Evaluation Pro — Master AI Project Context and Change Prompt

**Document purpose:** This is the canonical context file for any future AI, agent, developer, or new chat working on the Evaluation Pro/e-GP userscript project. Read this file before changing any project file. Preserve every standing requirement unless the owner explicitly changes it.

**Last updated:** 2026-11-01 (UTC)
**Repository:** `shrony25/epro`
**Current working branch:** `arena/fba65677-epro`
**Branch base:** `567d428dd9fd9ba017dd33066767d33dbc04e23c` (`main`)
**Current branch status:** active; do not switch, rename, create, or push another branch.
**Project owner/developer:** Mohammad Shahin Hossain, Surveyor, LGED
**Contact:** 01675350306, srony25@gmail.com
**Portfolio:** https://shrony25.github.io/Shahin_1/
**Product site:** https://shrony25.github.io/epro/

---

## 0. Highest-priority instruction: release gate

**Do not publicly release Evaluation Pro v1.17.** The owner has explicitly said that public v1.17 release must not happen until he gives a later explicit approval.

Until that approval is written clearly:

- Do not replace or edit the public root userscript/metadata files.
- Do not replace or edit `download/evaluation-pro.user.js` or `download/evaluation-pro.meta.js`.
- Do not update `index.html`, GitHub Pages, the public title, the public download links, the public Google Sheet, or deployment configuration for v1.17.
- Do not publish the v1.17 test artifact as the public download.
- Keep the public release files at v1.16.
- A personal/local v1.17 test file may be updated and kept on this working branch.
- The user must test the separate file on his own computer and approve it before public release.

A future AI may perform the public release only after explicit user approval. At that time, run all source and obfuscated validations again, confirm zero failures, update the intended public files together, and report exactly what was changed. Do not infer approval from a request to test, prepare, inspect, or fix a test build.

---

## 1. Owner's working style and communication requirements

- Explain results to the owner in simple Bengali.
- Keep code and code comments in English. User-facing software text may remain Bengali/English as designed.
- Never silently remove existing functionality.
- Before each change, inspect the current repository and this context file; do not rely only on an old chat summary.
- After each meaningful change, update this file's changelog and the persistent Google Doc described below if it exists.
- When a new request conflicts with an older requirement, ask for clarification instead of guessing.
- Do not ask the owner for GitHub passwords, tokens, OAuth tokens, or 2FA codes.
- Work only on the current branch `arena/fba65677-epro`; commit and push only to that branch.
- Do not reveal secrets or credentials in a public release. Existing compatibility constants that are already part of the userscript must not be casually changed.

The owner currently has no live tender available for end-to-end production testing. Therefore, UI, license, settings, DOM automation controls, and simulated e-GP page validation are the available validation scope.

---

## 2. Product identity and non-negotiable compatibility

The software is **Evaluation Pro**, a commercial lifetime single-device userscript for `eprocure.gov.bd`.

These values and behaviors are compatibility-critical:

- Product name: `Evaluation Pro`
- Userscript namespace: `shahin.lged.eprocure.pro`
- Existing e-GP-only scope: `@match https://www.eprocure.gov.bd/*`
- Do not add broader `@match` patterns or permissions for other websites.
- Existing grants must remain: `GM_xmlhttpRequest`, `GM_setValue`, `GM_getValue`, `GM_registerMenuCommand`.
- Existing connection scope must remain `@connect script.google.com`.
- Keep the existing run-at behavior and the 19-line userscript metadata header structure.
- Preserve `SECRET_SALT = "SHAHIN_LGED_EPROCURE_PRO_V51_LIFETIME_2025_Secure!!"`.
- Preserve `SecureStore.prefix = "epro_shahin_v51_"`.
- Preserve the license suffix `LIFETIME_V51_SHAHIN_LGED` used by key generation.
- Preserve activation compatibility, including the existing stored-license behavior and legacy activation fallback.
- Preserve the hardware-fingerprint/license behavior: platform, CPU cores, RAM/deviceMemory, language, timezone/offset, screen, GPU model and GPU driver information; a valid license must not be lost merely because of a browser/profile/Chrome update.
- Preserve lifetime single-PC semantics and the existing `SHAHIN-XXXX-XXXX-XXXX` device-ID format.
- Preserve the five-use trial limit (`TRIAL_USES = 5`).
- Preserve the maximum run safety cap (`MAX_TENDERS_PER_RUN = 200`).
- Preserve the developer credit, authorship protection, license gate, support contact, and existing activation/check compatibility.
- Do not change the license key algorithm unless the owner explicitly requests a compatibility-breaking migration.

The public v1.16 metadata files currently point to:

- `https://shrony25.github.io/epro/evaluation-pro.meta.js`
- `https://shrony25.github.io/epro/evaluation-pro.user.js`

The separate v1.17 personal test artifact intentionally retains those existing public update/download URLs until an approved public release. Do not alter those URLs only to make the test build public.

---

## 3. Current files and release boundaries

### Protected v1.16 source

- `Evaluation-Pro-v1.16-Master-Source.user.js`
  - Readable production v1.16 master source.
  - Must remain saved and unchanged while v1.17 is being tested.
  - Do not use a destructive in-place edit for v1.17.

### Current v1.17 personal test artifact

- `Evaluation-Pro-v1.17-Test.user.js`
  - Obfuscated v1.17 build for the owner's personal/local testing.
  - Current corrected artifact has metadata `@version 1.17` and the visible panel/mini labels show `v1.17`.
  - This is not the public release file.
  - Raw branch URL:
    `https://github.com/shrony25/epro/raw/refs/heads/arena/fba65677-epro/Evaluation-Pro-v1.17-Test.user.js`

### Public files that remain v1.16 until approval

- `evaluation-pro.user.js`
- `evaluation-pro.meta.js`
- `download/evaluation-pro.user.js`
- `download/evaluation-pro.meta.js`
- `index.html`
- GitHub Pages/public deployment and any linked public Sheet/title/download text

Do not update those public files for v1.17 before explicit approval.

### Existing validation suites

- `tests/suite-A-automation-license.js`
- `tests/suite-B-dropdowns-buttons-trial.js`
- `tests/suite-C-hardware-fingerprint.js`
- `tests/suite-D-remote-license.js`

The old A/B assertions were written for the pre-v1.17 global runtime keys and the old `safe` speed option. For v1.17 validation, use adapted copies/harnesses that understand tab-scoped runtime keys and `normal`, `fast`, `smartfast`. Do not weaken the product to satisfy obsolete assertions. Suites C and D validate hardware/license and remote policy.

---

## 4. Active v1.17 acceptance criteria

These criteria are active and must remain true unless the owner explicitly changes them:

1. A temporary remote-license transport failure must not block a locally valid lifetime license. A confirmed remote deny response must be actionable and must stop automation.
2. The speed settings must retain `Normal` and `Fast` and add `Smart Fast`. Smart Fast must perform a page-ready check and use a non-zero safe submit delay.
3. The scrollbar styling must be scoped only to the Evaluation Pro panel/log. It must not restyle the e-GP page globally.
4. Run state and counters must be isolated per browser tab. Pause/Resume, Stop, Finalize Stop, counters, and final states must not leak between tabs.
5. Checkpoints, reload resume, and bounded retry must exist. When retries are exhausted, the log must show an explicit stopped/failure state; never fail silently.
6. Progress/report system is out of scope for this release.
7. e-GP tab signal bar is out of scope for this release.
8. Optional browser notification is out of scope for this release.
9. Before any public v1.17 release, both readable source and obfuscated build must pass all validation with `0 failed`, and the owner must approve the release.

---

## 5. v1.17 implementation details already completed

### 5.1 Visible version-label correction

The owner tested the earlier v1.17 artifact and supplied a screenshot showing a mismatch: the panel header displayed `Evaluation Pro v1.16`, while the log displayed `Ready - Shahin Pro v1.17` and the lifetime license was active.

The v1.17 test artifact was rebuilt so that all relevant user-visible version labels are v1.17, including:

- userscript metadata `@version 1.17`
- panel header badge `v1.17`
- minimized pill label `Evaluation Pro v1.17`
- license gate title
- menu/credit text and build/version text
- ready log text

Do not blindly replace strings in an obfuscated file. The earlier plain-text search did not find the old label because obfuscation encoded strings. Rebuild from readable source and then obfuscate.

### 5.2 Remote license policy

Local lifetime-license validation is performed first so the panel can start without waiting for the remote server. Remote status is checked in the background for a Pro license.

The status request sends JSON including:

- `action: "status"`
- stored `licenseKey`
- stored activation `deviceId`
- `appVersion: PRO_CONFIG.VERSION`
- `build: PRO_CONFIG.BUILD`

The configured endpoint is the existing Google Apps Script `/exec` endpoint in the source. Do not change it without a deliberate server/configuration change.

Remote behavior:

- `active` with a valid response is accepted and cached for the existing 24-hour interval.
- Confirmed `revoked` response is cached, stops `AUTO_RUN` and `FINAL_RUN`, removes the Pro panel, and shows an actionable license gate message.
- Confirmed `not_registered` response is actionable and shows the registry/device message.
- Non-2xx, malformed JSON, missing `GM_xmlhttpRequest`, timeout, `onerror`, or temporary transport failure is an offline/transport failure, not a confirmed denial.
- Remote transport is retried with bounded waits; the current implementation uses attempts at approximately 0 ms, 900 ms, and 2200 ms.
- After transport failure, the locally valid lifetime license remains usable and the offline state is recorded.
- A cached confirmed revoked state remains blocking until a later successful active check; a mere outage must not convert a valid local license into a gate.

The server-side registry remains private. `license-server/Code.gs` exposes only status/health responses and expects the existing private `Licenses` and `Audit Log` sheets.

Required `Licenses` header:

`license_id | device_id | license_key | status | customer_name | email | phone | activated_at | revoked_at | last_check | last_app_version | notes`

Use `active` for an allowed device and `revoked` for a replaced/disabled device. The API compares the normalized exact `device_id` and `license_key` pair.

### 5.3 Speed modes

The settings must show exactly the supported v1.17 modes:

- `Normal`: navigation delay approximately 2.4–4.5 seconds.
- `Fast`: navigation delay approximately 1.2–2.0 seconds.
- `Smart Fast`: navigation delay approximately 0.75–1.25 seconds, after checking that the page is ready.

Submit delays remain non-zero and safer than navigation delays:

- Normal: approximately 2.4–4.0 seconds.
- Fast: approximately 2.2–3.2 seconds.
- Smart Fast: approximately 1.8–2.8 seconds.

Smart Fast uses a page-ready check and an additional safe rendering delay (including double `requestAnimationFrame` where available). Trial users are not allowed to bypass the normal trial behavior. The old `safe` value is treated as an invalid/legacy setting and migrates to Normal; the `safe` option must not return to the v1.17 UI.

### 5.4 Tab-scoped runtime storage

License, settings, and remote cache remain shared in `SecureStore`. Runtime state is isolated with a session-tab identifier:

- `sessionStorage` key: `epro_shahin_v51_tab_id`
- runtime keys are stored through `RunStore` as `epro_shahin_v51_tab_<TAB_SESSION_ID>_<KEY>`
- runtime keys include `AUTO_RUN`, `FINAL_RUN`, `t_i`, `f_i`, `final_i`, checkpoint values, retry counters, and resume notice

This prevents one e-GP tab from changing another tab's run state or counters. Existing shared keys such as license, settings, trial count, mode, and remote cache must remain shared for compatibility.

### 5.5 Checkpoints, reload resume, and bounded retry

The current flow records checkpoint step, URL, timestamp, and per-stage retry count. It announces resume when a running tab is loaded again.

Relevant stages include tenderer list, form list, evaluation page, finalize list, finalize detail, and page detection. Missing required page elements do not silently return:

- retry up to the bounded maximum (currently 3 attempts)
- log the retry number
- reload while the relevant run state is active
- when exhausted, clear the relevant run state, write an explicit Bengali/English stopped message, and show a visible flash notice

Manual Stop and Finalize Stop clear checkpoints. Successful completion writes an explicit completion checkpoint/log state.

### 5.6 Scoped scrollbar

The teal scrollbar rules target only:

- `#epro-pro-panel`
- `.epro-logbox`

Do not use global `body`, `html`, `*::-webkit-scrollbar`, or e-GP selectors for this feature. The e-GP page styling must remain untouched.

### 5.7 Existing UI/functionality retained

Do not remove or regress:

- Normal operation and Fast operation
- LTM/OTM mode selector and mode guard
- Start Eval, Pause/Resume, Stop
- Finalize Start and Finalize Stop
- Evaluation limit settings and reason/final-reason settings for Pro
- JV rows to No control
- right-click/copy support toggle and date-box safe mode
- minimize/fold persistence
- trial gate and lifetime license activation
- hardware/device ID and copy button
- developer credit and support information
- existing form/tenderer/finalize selectors and clarification/final responsiveness automation

---

## 6. Validation history and required test evidence

The corrected v1.17 readable build and obfuscated artifact were both syntax-checked and run through adapted validation harnesses.

### Current zero-failure results

| Build | Suite A | Suite B | Suite C | Suite D | New-feature smoke |
|---|---:|---:|---:|---:|---:|
| Readable v1.17 source | 42 passed, 0 failed | 54 passed, 0 failed | 14 passed, 0 failed | 14 passed, 0 failed | 19 passed, 0 failed |
| Obfuscated v1.17 test build | 42 passed, 0 failed | 54 passed, 0 failed | 14 passed, 0 failed | 14 passed, 0 failed | 19 passed, 0 failed |

`node --check` also passed for the obfuscated artifact.

The 19 smoke checks cover metadata/header version, mini label, speed modes, scoped scrollbar, valid local license before remote response, offline allowance, confirmed revoke action, tab isolation, Smart Fast field filling/checking/submission, form counter isolation, and tenderer counter isolation.

Historical testing notes:

- The original A/B suites initially failed because they expected global `AUTO_RUN`/counter keys and the obsolete `safe` speed option. Adapted assertions were used for the accepted v1.17 behavior; the product was not changed to preserve obsolete test assumptions.
- The first attempt to repair the screenshot issue by grepping the obfuscated file failed because the old label was encoded. Do not repeat blind replacement in compiled output.
- The temporary readable v1.17 source used to produce the earlier artifact was not persistent. The corrected source was reconstructed from the untouched v1.16 master and the accepted v1.17 changes, then rebuilt and revalidated.

Before a future release, rerun the equivalent tests against the exact final readable source and exact final obfuscated artifact. A release is not ready if any suite has a failure.

---

## 7. Git history and current delivery state

Relevant current branch history:

- Base: `567d428` — branch base from `main`
- `9a23289` — `Fix v1.17 panel version badge`
- `bac91d2` — earlier v1.17 personal test artifact commit on the remote branch
- `761a1af` — merge commit retaining the corrected local artifact while integrating the remote test-artifact history

The corrected artifact is pushed to branch `arena/fba65677-epro`. Public v1.16 files are still unchanged. Keep the branch clean after committing intended changes and verify `git status` before reporting completion.

When pushing future changes:

```bash
git add <intended-files>
git commit -m "<clear change description>"
git push origin arena/fba65677-epro
```

Never push v1.17 changes to `main` or another branch during the owner's testing phase.

---

## 8. How to handle future change requests

For every future change:

1. Read this entire context file.
2. Inspect the actual repository files and current branch status.
3. Identify whether the request affects the protected v1.16 master, the v1.17 test artifact, shared license compatibility, or public release files.
4. Unless the owner explicitly says to release publicly, modify only a separate/readable test source and regenerate `Evaluation-Pro-v1.17-Test.user.js`; keep v1.16 master and public files unchanged.
5. Preserve all compatibility-critical constants and metadata scope.
6. Add or update a focused test for the change.
7. Run syntax checks plus all source and obfuscated suites; require `0 failed`.
8. Test the visible UI label and relevant user-facing behavior, not just a string search in an obfuscated build.
9. Update this prompt's current-state section and changelog with the date, exact files, behavior, test totals, commit, and whether public release remains blocked.
10. Update the persistent Google Doc copy of this prompt if one exists, keeping the GitHub file and Google Doc synchronized.
11. Update `DRIVE-SYNC-MANIFEST.md` with every Drive upload/replacement, including file path, version/status, Drive ID/link, checksum, and date.
12. Update the corresponding private Drive file when an accepted/final file changes; do not create ambiguous duplicate copies unless preserving an intentional rollback version.
13. Commit and push only to `arena/fba65677-epro`.
14. Report the result in simple Bengali and clearly distinguish local test delivery from public release.

If the owner later requests a public v1.17 release, first confirm that the request is explicit. Then make a release checklist covering the readable source, obfuscated root/download script, both metadata files, `index.html` labels/links, Pages deployment, the private license Sheet/server compatibility, and rollback/safety verification. Do not update any of those merely because a test passed.

---

## 9. Persistent project prompt/document references

- Canonical GitHub context file (this file):
  `https://github.com/shrony25/epro/blob/arena/fba65677-epro/AI-PROJECT-CONTEXT-PROMPT.md`
- Corrected v1.17 personal test artifact:
  `https://github.com/shrony25/epro/raw/refs/heads/arena/fba65677-epro/Evaluation-Pro-v1.17-Test.user.js`
- Drive file manifest (all software-related files and synchronization rules):
  `https://github.com/shrony25/epro/blob/arena/fba65677-epro/DRIVE-SYNC-MANIFEST.md`
- Drive manifest copy:
  `https://drive.google.com/file/d/1w-wJVS724KpzYYphz08-SzHI-awYdKWC/view?usp=drivesdk`
  - Drive file ID: `1w-wJVS724KpzYYphz08-SzHI-awYdKWC`
- Google Doc copy (persistent, synchronized): https://docs.google.com/document/d/1Va1Ue2tZjONCl7m7gZY7BDEqgpkb8kLVK4ruISQMuXk/edit
  - Document ID: `1Va1Ue2tZjONCl7m7gZY7BDEqgpkb8kLVK4ruISQMuXk`
  - Title: **Evaluation Pro — Master AI Project Context and Change Prompt**
  - Drive folder: https://drive.google.com/drive/folders/1BV7p8tPfwd6HDzRUs5uhCNGQTK8683Jr
  - Drive folder ID: `1BV7p8tPfwd6HDzRUs5uhCNGQTK8683Jr`
  - Keep this Google Doc synchronized with the GitHub file and append dated change entries; do not delete earlier history.

---

## 10. Change log

### 2026-11-01 — v1.17 test artifact version-label fix and context creation

- Confirmed the owner does not authorize public v1.17 release yet.
- Diagnosed the screenshot inconsistency: panel header showed v1.16 while log/build showed v1.17.
- Reconstructed a readable v1.17 build from the untouched `Evaluation-Pro-v1.16-Master-Source.user.js` without modifying that v1.16 master.
- Restored/retained the accepted v1.17 behaviors: background-safe remote license policy, confirmed-deny handling, Normal/Fast/Smart Fast, Smart Fast page readiness and safe delay, tab-scoped runtime state, checkpoints, bounded retry, scoped scrollbar, existing license/settings/automation controls.
- Corrected panel header, minimized pill, gate/menu/build labels to v1.17.
- Generated and syntax-checked the obfuscated personal test artifact `Evaluation-Pro-v1.17-Test.user.js`.
- Ran readable and obfuscated validation: Suite A 42/0, Suite B 54/0, Suite C 14/0, Suite D 14/0, smoke 19/0.
- Committed/pushed the corrected artifact on `arena/fba65677-epro`; public root/download/Pages/Sheet/title remain v1.16.
- Created this master AI context prompt for future chats and future incremental updates.

### 2026-11-01 — persistent Google Doc and Drive folder registered

- Created the Google Doc `Evaluation Pro — Master AI Project Context and Change Prompt` and populated it with the project context, compatibility rules, release gate, implementation history, and validation results.
- Created the Drive folder `Evaluation Pro Project Context` and moved the Google Doc into it.
- Recorded the Google Doc URL/ID and Drive folder URL/ID in this GitHub file.
- Public v1.17 release remains blocked; no public root/download/Pages/Sheet/title update was performed.

### 2026-11-01 — complete software archive added to Google Drive

- Created a structured private Drive archive under `Evaluation Pro Project Context`.
- Added protected public v1.16 root/download scripts and metadata, readable v1.13/v1.15/v1.16 sources, the corrected v1.17 personal test build, all four validation suites, license-server files, README/site/admin/sales files, and the user manual PDF.
- Added `DRIVE-SYNC-MANIFEST.md` with Drive IDs, links, checksums, version/status boundaries, and future synchronization rules.
- The Drive archive is private working storage and backup only; it does not authorize a public v1.17 release.

### Future entries

For every later change, append a dated entry here containing:

- the owner's requested change;
- files touched and files intentionally protected;
- compatibility/risk decisions;
- tests run and exact pass/fail totals;
- commit/push status;
- whether public release is still blocked or explicitly approved;
- any new known issue, workaround, or user screenshot finding.

**Do not delete earlier entries.** Add corrections as new dated entries so another AI can reconstruct the full project history.
