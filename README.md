# 마음 키오스크 — 새 웹사이트 (정적 사이트)

기존 아임웹 사이트 `https://heartkiosk.com/` 의 내용·사진을 그대로 옮겨 만든 **무료 호스팅용 정적 사이트**입니다.
서버·데이터베이스·결제(PG) 없이 HTML/CSS/JS 파일만으로 동작합니다.

---

## 1. 폴더 구성

```
heartkiosk-site/
├─ index.html          홈 (히어로·소개·영상·특징·후기·이벤트·가격·FAQ)
├─ procedure.html      진행 절차  (원래 /34 페이지)
├─ about.html          서비스 소개 (원래 /contents 페이지)
├─ reviews.html        사용후기  (원래 /review_kiosk 페이지)
├─ reserve.html        예약 문의 (원래 상품 주문 페이지를 신청 폼으로 교체)
├─ privacy.html        개인정보처리방침 (초안 — 대표자 검토 후 게시)
├─ assets/
│  ├─ css/style.css    전체 디자인 (색·간격·모바일 대응)
│  ├─ js/config.js     ★ 연락처·계좌·폼 연결 설정 (여기만 고치면 됩니다)
│  ├─ js/main.js       메뉴·영상 재생·예약 폼 동작
│  └─ img/             사이트에서 쓰는 이미지 (총 1.4MB)
├─ apps-script/Code.gs  예약 접수를 받는 구글 Apps Script 코드 사본 (시트에 배포됨)
└─ README.md
```

## 2. 미리 보기

인터넷에 올리기 전에 파일을 더블클릭해서 열면 됩니다 (`index.html`).
폰트만 인터넷(Google Fonts)에서 불러오므로, 오프라인에서는 기본 폰트로 보입니다.

## 3. 배포 방법 (무료)

### 3-1. Vercel (가장 간단, 권장)
1. https://vercel.com 가입 (GitHub 계정으로 로그인 가능)
2. **Add New → Project → Deploy** 화면에서 이 폴더를 통째로 올리거나,
   GitHub에 저장소를 만들어 연결하면 자동 배포됩니다.
3. 배포되면 `https://프로젝트명.vercel.app` 주소가 바로 생깁니다.
   (Vercel은 정적 사이트 무료, 상업적 이용도 무료 Hobby 플랜에서 가능)

### 3-2. GitHub Pages
1. GitHub에 저장소를 만들고 이 폴더의 파일을 올립니다.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)** 선택
3. `https://아이디.github.io/저장소명/` 으로 공개됩니다.

### 3-3. Netlify (드래그 앤 드롭)
https://app.netlify.com/drop 에 폴더를 끌어다 놓으면 끝납니다.

> 세 곳 모두 카드 등록 없이 무료로 시작할 수 있습니다. 트래픽이 아주 많아지면
> Vercel 무료 한도(월 100GB)를 넘길 수 있는데, 이 사이트 규모(페이지 6장·이미지 1.4MB)에서는
> 월 수천~수만 방문까지는 문제되지 않습니다.

## 4. 도메인(heartkiosk.com) 연결

도메인은 **가비아**에 등록되어 있고(2027-11-19 만료), 아임웹과는 별개이므로
아임웹 구독을 해지해도 소유권은 그대로입니다.

1. 배포 후 호스팅 화면에서 **도메인 추가** → `heartkiosk.com`, `www.heartkiosk.com` 입력
2. 호스팅이 알려주는 레코드를 가비아 **My가비아 → DNS 관리**에서 입력
   - 보통 `A` 레코드 `@` → 호스팅 IP (예: Vercel `76.76.21.21`)
   - `CNAME` `www` → 호스팅이 준 주소
3. 반영까지 보통 10분~1시간(최대 24시간) 걸립니다.

> ⚠️ 지금 DNS가 아임웹을 가리키고 있으므로, **새 사이트가 먼저 정상 동작하는 것을 확인한 뒤**
> DNS를 바꾸는 것이 안전합니다. 순서를 바꾸면 그 사이에 사이트가 보이지 않습니다.

## 5. 예약 접수 방식 (중요)

PG 결제가 없어졌기 때문에, 예약 페이지는 **신청서 작성 → 보내기** 방식입니다.

| 방식 | 동작 | 준비물 |
|---|---|---|
| **① 자동 접수 (현재 설정됨)** | 신청 내용이 **구글 시트 '마음 키오스크 예약 접수'** 에 한 줄씩 자동 저장 | 없음 (이미 연결 완료) |
| **② 메일 (예비)** | 자동 접수에 실패하면 **메일로 보내기** 버튼이 나와 `heartkioskofficial@gmail.com` 앞으로 메일 앱이 열림 | 없음 |
| **③ 카카오톡 (예비)** | '내용 복사' 후 카카오톡 채널(`pf.kakao.com/_dFvxbG`)에 붙여넣기 | 없음 |

### ③ 구글 스프레드시트 자동 접수 — 연결 완료 상태 (2026-11-26)

| 항목 | 값 |
|---|---|
| 시트 | `마음 키오스크 예약 접수` — https://docs.google.com/spreadsheets/d/1NEXQxOExz3vEyht3xGsRg2LgBLk-7hehNpRYTQe18rM/edit |
| Apps Script 프로젝트 | `마음 키오스크 예약 접수 웹앱` (시트에 붙은 프로젝트, ID `1g_PwUUgHn-68of4rwCb2bYjRsN_WDziBkwruyeWjTQ5sucyyEOdTavB7`) |
| 웹 앱 URL | https://script.google.com/macros/s/AKfycbz_BPUhixFr8Ry1ykMga9UlzV8BID5XUM-vDwRhpYB3F7huJtfUK_Jx7or62Uo9x8jV/exec |
| 배포 설정 | 실행 대상: 나(kmh123012@gmail.com) · 액세스 권한: **모든 사용자** · 버전 2 |
| 코드 사본 | `apps-script/Code.gs` (사이트 폴더 안) |

**동작 방식 (건드릴 필요 없음)**
- `reserve.html` 신청서 → `assets/js/main.js` 가 `config.js`의 `reserveEndpoint` 로 POST → Apps Script `doPost` 가 시트 마지막 줄에 추가
- Apps Script는 `OPTIONS` 사전 요청에 응답하지 않으므로 `Content-Type: text/plain;charset=utf-8` 로 보냅니다(본문은 JSON 그대로). `application/json` 으로 바꾸면 브라우저가 막습니다.
- 시트 칸은 텍스트 서식으로 기록되어 전화번호 앞자리 0과 접수시각이 그대로 보존됩니다. 접수시각은 한국시간(KST)입니다.
- 자동 접수에 실패하면 화면이 알아서 메일·카카오톡 안내로 넘어갑니다.

**나중에 코드를 고칠 때**
1. 시트를 열고 **확장 프로그램 → Apps Script**
2. `apps-script/Code.gs` 내용을 붙여넣고 저장(Ctrl+S)
3. **배포 → 배포 관리 → 수정 → 버전: 새 버전 → 배포** (URL은 그대로 유지됨)

## 6. 자주 고칠 곳

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 대표 이메일·카카오톡 채널·전화번호 | `assets/js/config.js` |
| 예약금 입금 계좌 | `assets/js/config.js` 의 `bank` (은행명·계좌번호·예금주를 채우면 예약 페이지에 자동 표시) |
| 유튜브 영상 | `assets/js/config.js` 의 `youtubeId` |
| 가격·옵션 문구 | `index.html`, `reserve.html`, `about.html` 의 `.price-card` 부분 |
| 사진 교체 | `assets/img/` 의 같은 이름 파일을 바꿔 넣기 |
| 사업자 정보 | 각 페이지 맨 아래 `footer` |

## 7. 기존 사이트와 달라진 점

- **결제(PG) 없음** → 예약금은 계좌이체로 안내 (계좌를 `config.js`에 넣으면 자동 표시)
- **회원가입·장바구니·마이페이지 없음** (실제로 쓰이지 않던 아임웹 기본 기능)
- 상단 검색 기능 없음
- 가격은 **현재 상품 페이지 기준**(키오스크 30만원 / 축의대 전담 70·50만원 / QR 20만원)으로 통일
  — 기존 '서비스 소개' 페이지에는 옛 가격(20만·40만원)이 남아 있어 최신 가격으로 맞췄습니다.
- `개인정보처리방침`은 새로 만든 **초안**입니다. 보유 기간·파기 방법을 확인한 뒤 게시해 주세요.

## 8. 검증 결과 (2026-11-26)

- 예약 자동 접수: 배포된 웹앱에 실제 POST 전송 → 시트에 행이 저장되는 것 확인 (검증용 테스트 행은 삭제함)
- 접수시각 KST 표기·전화번호 앞자리 0 보존(텍스트 서식) 확인
- 예약 폼: 정상 접수 / 전송 실패(메일·카톡 안내로 전환) / 예상 밖 응답(실패 처리) 3가지 경우 모두 동작 확인
- 예약금 계좌: 신한은행 `110-307-860851` (예금주 `김명현` — 사업자명 `마음 키오스크`로 바뀔 수 있음)

- 6개 페이지 × PC(1440px)·모바일(390px)·태블릿(768px)·소형(360px) 렌더링 확인 — 가로 넘침 0건
- 이미지 33개(전 페이지 합계) 전부 정상 표시(누락 0건), 내부 링크 깨짐 0건
- 예약 폼: 빈 값 제출 시 안내 문구, 옵션 미선택 안내, 정상 제출 시 신청 내용 요약 + 메일 링크 생성 확인
- 미리보기 캡처: `work/heartkiosk-preview/` (desktop.png, mobile.png 등)
