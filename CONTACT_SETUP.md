# 문의 폼 — 설정 절차

Cloudflare Pages 에 배포된 뒤에만 동작한다. 로컬 `astro dev` 에서는 `/api/contact` 가 404 다.

---

## 0. 왜 Brevo 인가 (2026-08-21 결정)

당초 Resend 로 만들었으나 **DNS 제약으로 인증이 불가능**했다.

```
tag-8.com 의 DNS 관리처 : eNom (Google Workspace 리셀러)
eNom Host Records 지원  : A / AAAA / CNAME / URL Redirect / URL Frame / TXT
                          ↑ MX 가 없다
Resend 필수 레코드      : MX(send) + TXT(send) + TXT(resend._domainkey)
```

Resend 는 Return-Path 용 **MX** 를 반드시 요구하는데 eNom 에서는 MX 레코드를 만들 수 없다.
`Email Settings` 섹션에 MX 항목이 있으나 이는 **루트 도메인 전체**를 대상으로 하고,
현재 Google Workspace 의 MX 5줄이 패널 밖에서 자동 주입되고 있어 **건드리면 회사 메일이 끊긴다.**

→ **TXT 만으로 도메인 인증이 끝나는 Brevo 로 우회한다.**
→ 나중에 DNS 를 Cloudflare 로 이전하면 Resend 로 되돌릴 수 있다(아래 5장).

---

## 1. Brevo 가입 + 도메인 인증

1. https://www.brevo.com 가입 (무료 플랜)
2. 좌측 하단 계정명 → **Senders, Domains & Dedicated IPs** → **Domains** 탭
3. **Add a domain** → `tag-8.com` 입력
4. 화면에 나오는 **DNS 레코드**를 eNom 에 추가 (2장)
5. **Authenticate this domain** → 초록 체크 확인
6. **SMTP & API → API Keys → Generate a new API key** → 키 복사 (한 번만 보인다)

> 화면에 나오는 레코드가 이 문서와 다르면 **화면 쪽이 맞다.** 그대로 넣는다.
> 단 **MX 가 요구되면 멈춘다.** eNom 에서 만들 수 없다.

---

## 2. eNom 에 DNS 레코드 추가

### 접속 경로

```
admin.google.com → アカウント → ドメイン → ドメインの管理
  → tag-8.com → "Enom の DNS コントロールパネル" 안내
  → 표시된 로그인 정보로 eNom 접속 (ログイン名: tag-8.com)
```

### 추가 방법

`Host Records` 섹션 → **`Edit`** → **`Add New`** → 빈 행에 입력 → **`Save`**

| 칸 | 넣는 것 |
|---|---|
| Host Name | 레코드 이름. **`.tag-8.com` 은 붙이지 않는다** (`brevo-code`, `mail._domainkey` 등) |
| Address | 값. 길면 반드시 **복사·붙여넣기** |
| Record Type | `TXT` |

### 🔴 절대 하지 말 것

- **기존 14줄을 수정·삭제하지 않는다.** `Add New` 로 추가만 한다
- **`Email Settings` 섹션을 건드리지 않는다.** `User (MX Record)` 로 바꾸면
  Google Workspace 의 MX 자동 주입이 끊겨 `info@tag-8.com` 이 즉시 죽는다
- `Registrar Lock` 은 별건이다. 지금 건드리지 않는다

### 저장 후 검증

외부에서 실제로 조회해 확인한다. 아래가 **전부 나와야** 정상이다.

```bash
dig +short MX  tag-8.com          # Google 5줄이 그대로 있어야 한다
dig +short TXT tag-8.com          # SPF + google-site-verification
dig +short TXT _dmarc.tag-8.com   # v=DMARC1; p=none;
```

**MX 5줄이 사라졌으면 즉시 복구한다.**

```
1  aspmx.l.google.com
5  alt1.aspmx.l.google.com
5  alt2.aspmx.l.google.com
10 aspmx2.googlemail.com
10 aspmx3.googlemail.com
```

---

## 3. Cloudflare 환경변수

Cloudflare Pages → 프로젝트 → **Settings → Environment variables**
**Production 과 Preview 양쪽 모두**에 넣는다.

| 이름 | 값 |
|---|---|
| `BREVO_API_KEY` | Brevo 에서 발급한 키 (`xkeysib-` 로 시작) |
| `MAIL_TO` | `info@tag-8.com` |
| `MAIL_FROM` | `TAG EIGHT <no-reply@tag-8.com>` |

`MAIL_TO` / `MAIL_FROM` 은 생략해도 위 값이 기본값이다.

넣은 뒤 **Deployments → 최신 배포 → Retry deployment.**
환경변수는 재배포해야 반영된다.

---

## 4. 확인 — 4개 전부 통과해야 한다

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
| `/contact/?e=2` | 서버 오류. 대부분 **API 키 미설정** 또는 **도메인 인증 미완료** |

`?e=2` 가 나오면 Cloudflare → 프로젝트 → **Functions → Real-time Logs** 에서 실제 오류를 본다.

---

## 5. 나중에 Resend 로 되돌리기

DNS 를 Cloudflare 로 이전하면 MX 를 만들 수 있으므로 Resend 가 쓸 수 있게 된다.
코드는 **이미 양쪽을 지원한다.** 환경변수만 바꾸면 된다.

```
BREVO_API_KEY   삭제
RESEND_API_KEY  추가
→ Retry deployment
```

`functions/api/contact.ts` 의 `makeSender()` 가 키가 들어 있는 쪽을 자동으로 고른다.
**Brevo 우선**이므로 되돌릴 때는 `BREVO_API_KEY` 를 반드시 지워야 한다.

---

## 동작 사양

- 통지 1통 + 자동응답 1통, 총 2통
- 자동응답은 폼의 언어(ja / ko / zh-TW)로 발송
- 봇 트랩(`_gotcha`)에 값이 있으면 **발송하지 않고** 완료 페이지로 보낸다
- 입력값의 개행(`\r\n`)은 공백으로 치환한다 — 헤더 인젝션 방지
- 길이 상한: 회사명 120 / 이름 80 / 메일 160 / 제목 120 / 본문 4000

---

## ⚠️ 개인정보 국외 이전 문구

`/privacy` 에 **송신처가 명시되어 있다.** 발송사를 바꾸면 3개 언어 전부 고쳐야 한다.

```
현재 기재 : メール送信：Resend（米国）
변경 필요 : メール送信：Brevo（フランス）
```

Brevo 는 EU(프랑스) 사업자다. 미국이 아니다. **일본 개인정보보호법상 국외 이전처 표기가 달라진다.**
`src/data/i18n.ts` 의 `privacy` 항목 3개 언어를 함께 수정한다.
