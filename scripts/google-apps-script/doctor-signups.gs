/**
 * Receives doctor sign-ups from the website and adds each one as a row in this
 * Google Sheet. (Google Apps Script - this file is not part of the Next.js app;
 * it is kept here so the code you paste into Google is in version control.)
 *
 * SETUP (about 5 minutes)
 * 1. Create a Google Sheet, e.g. "Doctor sign-ups".
 * 2. In the sheet: Extensions > Apps Script. Delete the sample code, paste this
 *    whole file, and save.
 * 3. Project Settings (gear icon) > Script properties > Add script property:
 *      name: SECRET     value: a long random string you make up
 * 4. Deploy > New deployment > select type "Web app":
 *      Execute as: Me        Who has access: Anyone
 *    Click Deploy, approve the permissions when asked, and copy the "Web app URL".
 *    (Open that URL in a browser: it should say the endpoint is running.)
 * 5. On the website's server (Render > Environment) set:
 *      DOCTOR_SHEET_WEBHOOK_URL     = the Web app URL
 *      DOCTOR_SHEET_WEBHOOK_SECRET  = the same value as SECRET above
 *
 * After editing this script later: Deploy > Manage deployments > pencil icon >
 * Version: New version > Deploy (the URL stays the same).
 *
 * "Anyone" access only means the URL can be called; every request must carry the
 * SECRET or it is ignored, so keep the URL and the secret private.
 */

const SHEET_NAME = "Doctor signups";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || data.secret !== secret) return reply({ ok: false, error: "unauthorized" });
    if (!Array.isArray(data.columns) || !Array.isArray(data.values)) return reply({ ok: false, error: "bad request" });

    // Two doctors submitting at the same moment must not write to the same row.
    lock.waitLock(15000);

    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      // Header row comes from the website, so the columns are defined in one place.
      sheet.getRange(1, 1, 1, data.columns.length).setValues([data.columns]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    const range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, data.values.length);
    range.setNumberFormat("@"); // plain text, so a value starting with "=" is never run as a formula
    range.setValues([data.values.map(String)]);
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Lets you check the deployment by opening the Web app URL in a browser.
function doGet() {
  return reply({ ok: true, message: "Doctor sign-up endpoint is running." });
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
