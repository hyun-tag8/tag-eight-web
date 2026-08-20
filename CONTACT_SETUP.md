# 문의 폼 — 배포 절차

Cloudflare Pages 에 배포된 뒤에만 동작한다. 로컬 `astro dev` 에서는 `/api/contact` 가 404 다.

## 1. Cloudflare Pages 연결
GitHub 저장소를 Pages 에 연결한다. `functions/` 는 자동 인식되므로 별도 설정이 없다.

## 2. Resend 가입 + 도메인 인증
1. https://resend.com 가입
2. **Domains → Add Domain → `tag-8.com`**
3. 화면에 나오는 **DNS 레코드 3건(SPF / DKIM / DMARC)** 을 Cloudflare DNS 에 추가
4. Verified 표시를 확인 — 인증 전에는 발송이 거부된다
5. **API Keys → Create** → 키 복사 (한 번만 보인다)

## 3. 환경변수
Cloudflare Pages → **Settings → Environment variables** (Production / Preview 양쪽)

| 이름 | 값 |
|---|---|
| `RESEND_API_KEY` | Resend 에서 발급한 키 |
| `MAIL_TO` | `info@tag-8.com` |
| `MAIL_FROM` | `TAG EIGHT <no-reply@tag-8.com>` |

`MAIL_TO` / `MAIL_FROM` 은 생략해도 위 값이 기본값이다.

## 4. 확인
1. `https://tag-8.com/contact` 에서 실제로 송신
2. `info@tag-8.com` 에 통지 도착 확인
3. 입력한 주소로 **자동응답** 도착 확인
4. 통지 메일에 그대로 **답장** → 문의자에게 가는지 확인 (reply-to)
5. `/contact/thanks/` 로 이동했는지 확인

## 동작
- 통지 1통 + 자동응답 1통, 총 2통
- 자동응답은 폼의 언어(ja / ko / zh-TW)로 발송
- 봇 트랩(`_gotcha`)에 값이 있으면 발송하지 않고 완료 페이지로 보낸다
- 실패 시 `/contact/?e=1`(입력 오류) 또는 `?e=2`(서버 오류)로 되돌아오고 폼에 안내가 뜬다

## 주의
- `MAIL_FROM` 도메인은 **반드시 Resend 인증을 마쳐야** 한다
- 개인정보 국외 이전은 `/privacy` 에 이미 명시했다. **송신처를 바꾸면 그 문구도 같이 고쳐야 한다**
