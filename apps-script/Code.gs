/**
 * 마음 키오스크 — 예약 접수 웹앱 (Google Apps Script)
 * ------------------------------------------------------------
 * reserve.html 의 신청서를 구글 시트 '마음 키오스크 예약 접수'에 한 줄씩 저장합니다.
 * 배포: 배포 > 새 배포 > 웹 앱 / 실행 대상: 나 / 액세스 권한: 모든 사용자
 */

var SHEET_ID = '1NEXQxOExz3vEyht3xGsRg2LgBLk-7hehNpRYTQe18rM';
var SHEET_NAME = '시트1';
var TZ = 'Asia/Seoul';
var HEADER = ['접수시각', '예식일', '예식시간', '예식장', '주소', '신랑', '신부', '연락처', '이메일', '옵션', '추천인', '문의'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);
  return sheet;
}

function stamp_(v) {
  var d = v ? new Date(v) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return Utilities.formatDate(d, TZ, 'yyyy-MM-dd HH:mm:ss');
}

function pick_(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    var v = obj[keys[i]];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var sheet = getSheet_();
    var d = {};
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    if (raw) {
      try { d = JSON.parse(raw); } catch (err) { d = (e && e.parameter) || {}; }
    } else {
      d = (e && e.parameter) || {};
    }
    var values = [
      stamp_(d.submittedAt),
      pick_(d, ['weddingDate']),
      pick_(d, ['weddingTime']),
      pick_(d, ['venue']),
      pick_(d, ['venueAddress', 'address']),
      pick_(d, ['groom']),
      pick_(d, ['bride']),
      pick_(d, ['phone']),
      pick_(d, ['email']),
      pick_(d, ['option']),
      pick_(d, ['referrer']),
      pick_(d, ['memo', 'message'])
    ].map(function (v) { return String(v); });
    /* 전화번호·시각이 숫자로 바뀌지 않도록 텍스트 서식으로 한 줄 추가 */
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, HEADER.length).setNumberFormat('@').setValues([values]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('마음 키오스크 예약 접수 웹앱이 정상 동작 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 설치 확인용: 편집기에서 이 함수를 한 번 실행하면 시트에 테스트 행이 한 줄 들어갑니다.
 */
function testAppend() {
  doPost({ postData: { contents: JSON.stringify({
    submittedAt: new Date().toISOString(),
    weddingDate: '2026-12-31',
    weddingTime: '12:30',
    venue: '테스트 예식장',
    venueAddress: '서울 어딘가',
    groom: '테스트신랑',
    bride: '테스트신부',
    phone: '010-0000-0000',
    email: '',
    option: '테스트 옵션',
    referrer: '',
    memo: '설치 테스트 행입니다.'
  }) } });
}
