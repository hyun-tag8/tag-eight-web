# 문의 폼 — 설정 절차

Cloudflare Pages 에 배포된 뒤에만 동작한다. 로컬 `astro dev` 에서는 `/api/contact` 가 404 다.

---

## 0. 구조와 배경 (2026-08-21 결정)

```
방문자가 폼 송신
   ↓
Cloudflare Pages Function  (functions/api/contact.ts)
   ↓ HTTPS
Google Apps Script         (script.google.com · 원본은 docs/gas-mailer.gs)
   ↓
Gmail 이 info@tag-8.com 으로 2통 발송
   ├─ 담당자 통지 → info@tag-8.com
   └─ 자동응답   → 문의자
```

### 왜 외부 발송사를 안 쓰나

당초 Resend 로 만들었으나 **DNS 제약으로 인증이 불가능**했다.

```
tag-8.com 의 DNS 관리처 : eNom (Google Workspace 리셀러)
eNom Host Records 지원  : A / AAAA / CNAME / URL Redirect / URL Frame / TXT
                          ↑ MX 가 없다
Resend 필수 레코드      : MX(send) + TXT(send) + TXT(resend._domainkey)
```

`Email Settings` 섹션에 MX 항목이 있으나 이는 **루트 도메인 전체**를 대상으로 하고,
Google Workspace 의 MX 5줄이 패널 밖에서 자동 주입되고 있어 **건드리면 회사 메일이 끊긴다.**

Brevo(TXT 만으로 가능)도 검토했으나, 이미 쓰고 있는 Workspace 로 보내면
**DNS 작업이 0 이고 관리할 업체도 늘지 않는다.** 그래서 Apps Script 로 정했다.

| | Apps Script | Brevo | Resend |
|---|---|---|---|
| DNS 작업 | **없음** | TXT 2~3줄 | MX 필요 → **불가** |
| 신규 가입 | 없음 | 필요 | 필요 |
| 도달률 | 최고(Google 직접) | 양호 | 양호 |
| 발신 주소 | `info@tag-8.com` | `no-reply@tag-8.com` | 동左 |

**코드는 3가지 경로를 모두 지원한다.** 환경변수만 바꾸면 전환된다(5장).

---

## 1. Apps Script 배포

### 1-1. 프로젝트 생성

1. **`info@tag-8.com` 으로 로그인한 상태**에서 https://script.google.com/home 접속
   ※ 개인 Gmail 로 만들면 발신자가 그 주소가 된다. 반드시 회사 계정
2. **새 프로젝트** → 이름을 `TAG EIGHT Contact Mailer` 로 변경
3. 기본 코드(`function myFunction() {}`)를 **전부 지우고**
   `docs/gas-mailer.gs` 내용을 **전부 붙여넣는다**

### 1-2. 토큰 설정

붙여넣은 코드 위쪽의 이 줄을 찾는다.

```js
const TOKEN = 'CHANGE_ME_긴무작위문자열로바꿀것';
```

**길고 무작위한 문자열로 바꾼다.** 예: `t8-9fK2xQ7mZp4RvB1nY6wLdA3sHgJ5e`

> 이 값이 **아무나 이 URL 로 메일을 보내지 못하게 막는 유일한 장치**다.
> 짧거나 추측 가능하면 스팸 발송기로 악용된다.
> 같은 값을 나중에 Cloudflare 환경변수 `GAS_TOKEN` 에 넣는다. **메모해 둘 것.**

저장(⌘S).

### 1-3. 권한 승인 — 배포 전에 먼저 한다

1. 상단 함수 선택 드롭다운에서 **`testSend`** 선택 → **실행**
2. 권한 요청 화면이 뜬다
   - **「고급」** 클릭
   - **「TAG EIGHT Contact Mailer(안전하지 않음)으로 이동」** 클릭
   - **「허용」**
   > 본인이 만든 스크립트라 이 경고는 정상이다
3. `info@tag-8.com` 에 **테스트 메일 1통**이 오면 성공

### 1-4. 웹앱 배포

**배포 → 새 배포 → 유형 선택(톱니바퀴) → 웹 앱**

| 항목 | 값 |
|---|---|
| 설명 | `v1` |
| 실행 사용자 | **나 (info@tag-8.com)** |
| 액세스 권한이 있는 사용자 | 🔴 **모든 사용자** |

> **「모든 사용자」가 아니면 Cloudflare 가 호출할 수 없다.**
> 대신 로그인 HTML 이 돌아와서 폼이 `?e=2` 로 실패한다.
> 보안은 위 TOKEN 이 담당한다.

**배포** → 발급된 **웹 앱 URL** 복사

```
https://script.google.com/macros/s/AKfycb.../exec
```

### 1-5. 배포 확인

그 URL 을 **브라우저 주소창에 붙여넣고 열어본다.**

| 보이는 것 | 판정 |
|---|---|
| `{"ok":false,"error":"POST only"}` | ✅ 정상 |
| Google 로그인 화면 | 🔴 액세스 권한이 「모든 사용자」가 아니다. 재배포 |

---

## 2. Cloudflare 환경변수

Cloudflare Pages → 프로젝트 → **Settings → Environment variables**
**Production 과 Preview 양쪽 모두**에 넣는다.

| 이름 | 값 |
|---|---|
| `GAS_URL` | 1-4 에서 복사한 `.../exec` URL |
| `GAS_TOKEN` | 1-2 에서 정한 문자열 (**Apps Script 와 완전히 같아야 한다**) |
| `MAIL_TO` | `info@tag-8.com` |
| `MAIL_FROM` | `TAG EIGHT <no-reply@tag-8.com>` |

`MAIL_TO` / `MAIL_FROM` 은 생략해도 위 값이 기본값이다.
Apps Script 경로에서는 `MAIL_FROM` 의 **이름 부분만** 쓰이고, 실제 주소는 Workspace 계정이 된다.

넣은 뒤 **Deployments → 최신 배포 → Retry deployment.**
환경변수는 재배포해야 반영된다.

---

## 3. 확인 — 4개 전부 통과해야 한다

`https://<프로젝트>.pages.dev/contact` 에서 실제로 송신한다.

- [ ] `info@tag-8.com` 에 통지 도착
- [ ] 입력한 주소로 **자동응답** 도착 (폼 언어에 맞는 문면)
- [ ] 통지 메일에 그대로 **답장** → 문의자에게 간다 (reply-to)
- [ ] `/contact/thanks/` 로 이동

**이 4개는 로컬에서 확인할 수 없다.**

### 실패했을 때

| 되돌아온 주소 | 원인 |
|---|---|
| `/contact/?e=1` | 입력값 검증 실패 (회사명·이름 누락, 이메일 형식) |
| `/contact/?e=2` | 서버 오류 |

`?e=2` 의 원인은 Cloudflare → 프로젝트 → **Functions → Real-time Logs** 에 그대로 찍힌다.

| 로그 내용 | 원인 |
|---|---|
| `gas: bad token` | `GAS_TOKEN` 과 Apps Script 의 `TOKEN` 이 다르다 |
| `gas 응답이 JSON 이 아니다` | 웹앱 액세스 권한이 「모든 사용자」가 아니다 |
| `gas: daily quota exhausted` | 하루 발송 상한 도달 (Workspace 1,500통/일) |
| `아무것도 설정되지 않았다` | `GAS_URL` / `GAS_TOKEN` 미설정 |

---

## 4. 코드를 고칠 때 (Apps Script)

⚠️ **저장만 해서는 웹앱이 갱신되지 않는다.**

```
배포 → 배포 관리 → 편집(연필) → 버전: 새 버전 → 배포
```

URL 은 그대로 유지되므로 Cloudflare 는 다시 안 만져도 된다.

---

## 5. 발송 경로 전환

`functions/api/contact.ts` 의 `makeSender()` 가 아래 우선순위로 자동 선택한다.

```
① GAS_URL + GAS_TOKEN   → Google Apps Script
② BREVO_API_KEY         → Brevo
③ RESEND_API_KEY        → Resend
```

**위쪽이 설정돼 있으면 아래는 무시된다.** 전환하려면 상위 변수를 지워야 한다.

DNS 를 Cloudflare 로 이전하면 MX 를 만들 수 있으므로 Resend 가 다시 쓸 수 있게 된다.
그때는 `GAS_URL` / `GAS_TOKEN` 을 지우고 `RESEND_API_KEY` 를 넣은 뒤 재배포한다.

---

## 동작 사양

- 통지 1통 + 자동응답 1통, 총 2통
- 자동응답은 폼의 언어(ja / ko / zh-TW)로 발송
- 봇 트랩(`_gotcha`)에 값이 있으면 **발송하지 않고** 완료 페이지로 보낸다
- 입력값의 개행(`\r\n`)은 공백으로 치환한다 — 헤더 인젝션 방지
- 길이 상한: 회사명 120 / 이름 80 / 메일 160 / 제목 120 / 본문 4000
- HTML 메일과 평문 메일을 함께 보낸다 (Apps Script 가 HTML 을 평문으로 변환)

---

## ⚠️ 알아둘 것

**1. Workspace 계정에 종속된다.**
`info@tag-8.com` 계정이 사라지거나 Apps Script 프로젝트가 삭제되면 폼이 멈춘다.
소유자를 대표 계정으로 유지할 것.

**2. 개인정보 국외 이전 문구**
`/privacy` 에 송신처가 명시되어 있다. 발송 경로를 바꾸면 3개 언어를 함께 고쳐야 한다.

```
현재 : メール配信：Google Workspace（米国）
       메일 발송: Google Workspace (미국)
       郵件發送：Google Workspace（美國）
```

수정 위치는 `src/data/i18n.ts` 의 각 언어 `privacy` 항목.

**3. 하루 발송 상한**
Google Workspace 는 1,500통/일. 문의 1건당 2통이므로 750건/일까지 가능하다.
문의 폼 용도로는 충분하지만, 뉴스레터 발송 등으로 전용하면 안 된다.
