/*
 * Evaluation Pro license status API.
 *
 * Deploy this file as a Google Apps Script Web App that executes as the owner.
 * The linked Google Sheet remains private; this endpoint returns only the
 * status of the submitted license/device pair.
 */

const CONFIG = {
  SPREADSHEET_ID: 'PASTE_SPREADSHEET_ID_HERE',
  LICENSE_SHEET: 'Licenses',
  AUDIT_SHEET: 'Audit Log'
};

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || 'health').toLowerCase();
  if (action === 'health') {
    return json_({ ok: true, service: 'evaluation-pro-license-api', status: 'online' });
  }
  if (action === 'status') {
    return json_(status_(e.parameter || {}));
  }
  return json_({ ok: false, status: 'bad_request' });
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, status: 'bad_request', message: 'Invalid JSON request.' });
  }

  const action = String(body.action || 'status').toLowerCase();
  if (action === 'status') {
    return json_(status_(body));
  }
  return json_({ ok: false, status: 'bad_request' });
}

function status_(request) {
  const licenseKey = normalize_(request.licenseKey);
  const deviceId = normalize_(request.deviceId);
  const appVersion = String(request.appVersion || '').trim();

  if (!licenseKey || !deviceId) {
    return { ok: false, status: 'bad_request', message: 'licenseKey and deviceId are required.' };
  }

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.LICENSE_SHEET);
  if (!sheet) {
    return { ok: false, status: 'server_error', message: 'License sheet was not found.' };
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return { ok: false, status: 'not_registered', message: 'This license is not registered.' };
  }

  const headers = values[0].map(function (value) { return String(value).trim().toLowerCase(); });
  const index = function (name) { return headers.indexOf(name); };
  const licenseIdCol = index('license_id');
  const deviceIdCol = index('device_id');
  const licenseKeyCol = index('license_key');
  const statusCol = index('status');
  const lastCheckCol = index('last_check');
  const versionCol = index('last_app_version');

  if ([licenseIdCol, deviceIdCol, licenseKeyCol, statusCol].some(function (column) { return column < 0; })) {
    return { ok: false, status: 'server_error', message: 'License sheet headers are incomplete.' };
  }

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    const rowDeviceId = normalize_(row[deviceIdCol]);
    const rowLicenseKey = normalize_(row[licenseKeyCol]);
    if (rowDeviceId !== deviceId || rowLicenseKey !== licenseKey) continue;

    const rowStatus = normalize_(row[statusCol]).toLowerCase();
    if (rowStatus !== 'active') {
      return {
        ok: false,
        status: rowStatus || 'revoked',
        licenseId: String(row[licenseIdCol] || ''),
        message: 'This license is not active.'
      };
    }

    const now = new Date();
    if (lastCheckCol >= 0) sheet.getRange(rowIndex + 1, lastCheckCol + 1).setValue(now);
    if (versionCol >= 0 && appVersion) sheet.getRange(rowIndex + 1, versionCol + 1).setValue(appVersion);

    return {
      ok: true,
      status: 'active',
      licenseId: String(row[licenseIdCol] || ''),
      serverTime: now.toISOString()
    };
  }

  return { ok: false, status: 'not_registered', message: 'This license/device pair is not registered.' };
}

function normalize_(value) {
  return String(value == null ? '' : value).trim().toUpperCase();
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
