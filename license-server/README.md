# Evaluation Pro pilot license server

This pilot uses a private Google Sheet as the registry and a Google Apps Script Web App as the HTTPS status API.

## Registry

A pilot registry was created with these sheets:

- `Licenses`
- `Audit Log`

The `Licenses` header row must remain:

```text
license_id | device_id | license_key | status | customer_name | email | phone | activated_at | revoked_at | last_check | last_app_version | notes
```

Use `active` for a usable device and `revoked` for a replaced/disabled device. Keep the Sheet private.

## Deploy the API

1. Open the private registry Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `Code.gs` into the Apps Script editor.
4. Replace `PASTE_SPREADSHEET_ID_HERE` with the spreadsheet ID.
5. Save the project.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as** to the owner account.
8. Set access to **Anyone** and deploy.
9. Copy the URL ending in `/exec`.

The deployed URL is required in the pilot userscript as `PRO_CONFIG.LICENSE_SERVER`.

## Register the pilot PC

After the pilot userscript is installed on the target PC:

1. Copy its Device ID from the license gate or footer.
2. Generate the existing lifetime key for that Device ID with the current admin generator.
3. Add one row to `Licenses`, for example:

```text
PILOT-001 | SHAHIN-XXXX-XXXX-XXXX | XXXX-XXXX-XXXX-XXXX | active | Mohammad Shahin Hossain | srony25@gmail.com | 01675350306 | 2026-11-01 | | | 1.16 | Pilot PC
```

The API checks the exact normalized `device_id` and `license_key` pair. It does not expose the Sheet contents.

## Replacement flow

For a future device replacement, mark the old row `revoked`, add the new device row as `active`, and record the change in `Audit Log`. The pilot userscript checks once per 24 hours when an e-GP page is opened. A confirmed `revoked` response stops the automation. During a temporary server failure, this pilot deliberately allows the locally valid lifetime license to continue, as selected for the pilot.

The existing v1.15 userscript does not call this API. Only the separate v1.16 pilot build uses it.
