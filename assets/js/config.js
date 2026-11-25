/* =========================================================
   마음 키오스크 — 사이트 설정
   ---------------------------------------------------------
   이 파일 하나만 고치면 사이트 전체 안내 수단이 바뀝니다.
   (예약 폼, 카카오톡 버튼, 계좌 안내, 영상)
   ========================================================= */

window.HK_CONFIG = {
  /* 1) 대표 이메일 — 예약 신청 내용이 이 주소로 갑니다 */
  email: "heartkioskofficial@gmail.com",

  /* 2) 카카오톡 채널 — '문의하기' 버튼이 여는 주소 */
  kakaoChannel: "https://pf.kakao.com/_dFvxbG",

  /* 3) 전화 상담을 받으실 경우 번호를 넣으면 사이트에 표시됩니다. (없으면 그대로 두세요) */
  phone: "",

  /* 4) 예약금 입금 계좌
        은행명·계좌번호·예금주를 모두 채우면 예약 페이지에 계좌 안내 박스가 나타납니다.
        비워 두면 "예약 확인 후 안내" 문구가 나옵니다. */
  bank: {
    bankName: "신한은행",
    accountNumber: "110-307-860851",
    holder: "김명현"
  },

  /* 5) 예약 폼 자동 접수 (선택)
        Google Apps Script 웹앱 URL, Formspree 같은 엔드포인트를 넣으면
        '신청서 보내기'가 그 주소로 데이터를 POST 합니다.
        비워 두면 메일 보내기 · 내용 복사 · 카카오톡 문의 방식으로 동작합니다. */
  reserveEndpoint: "https://script.google.com/macros/s/AKfycbz_BPUhixFr8Ry1ykMga9UlzV8BID5XUM-vDwRhpYB3F7huJtfUK_Jx7or62Uo9x8jV/exec",

  /* 6) 유튜브 영상 ID (사용 영상) */
  youtubeId: "QH8jgQp7Ydk"
};
