const SHEET_NAME = "Witchlist";

function doPost(e) {
  const sheet = getSheet();
  const payload = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    new Date(),
    payload.username || "",
    payload.likedAndReposted === true ? "yes" : "no",
    payload.commentLink || "",
    payload.evmWallet || "",
    payload.submittedAt || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Received At",
      "X Username",
      "Liked + RT",
      "Comment Link",
      "EVM Wallet",
      "Submitted At"
    ]);
  }

  return sheet;
}
