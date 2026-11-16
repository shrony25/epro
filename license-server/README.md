# Evaluation Pro license server

This service uses a private Google Sheet as the license registry and a Google Apps Script Web App as the HTTPS status API.

## Registry

The registry contains these sheets:

- `Licenses`
- `Audit Log`

The `Licenses` header row must remain:

```text
license_id | device_id | license_key | status | customer_name | email | phone | activated_at | revoked_at | last_check | last_app_version | notes
```

Use `active` for a usable device and `revoked` for a replaced or disabled device. Keep the Sheet private.

## Deploy the API

1. Open the private registry Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `Code.gs` into the Apps Script editor.
4. Replace `PASTE_SPREADSHEET_ID_HERE` with the spreadsheet ID.
5. Save the project.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as** to the owner account.
8. Set access to **Anyone** and deploy.
9. Copy the URL ending in `/exec` and configure it in the userscript.

## Register a device

After generating a lifetime key for a Device ID, add one row to `Licenses`, for example:

```text
LICENSE-001 | SHAHIN-XXXX-XXXX-XXXX | XXXX-XXXX-XXXX-XXXX | active | Customer Name | email@example.com | 01XXXXXXXXX | 2026-11-01 | | | 1.16 | Lifetime license
```

The API checks the exact normalized `device_id` and `license_key` pair. It does not expose the Sheet contents.

## Replacement flow

For a device replacement, mark the old row `revoked`, add the new device row as `active`, and record the change in `Audit Log`. The v1.16 userscript checks once per 24 hours when an e-GP page is opened. A confirmed `revoked` response stops the automation. During a temporary server failure, the configured offline policy allows a locally valid lifetime license to continue.

The existing v1.15 userscript does not call this API. Users must install the v1.16 release to receive remote status checks.
