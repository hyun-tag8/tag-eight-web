# INSIGHT 발행 가이드

주 1~2회 글을 올리기 위한 문서. **터미널도, 파일 업로드도 필요 없다.**

---

## 0. 한 번만 하는 준비 (약 10분)

### 0-1. GitHub OAuth App 만들기

관리화면이 GitHub 에 글을 저장하려면 「로그인 창구」가 하나 필요하다.

1. https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. 아래대로 입력

   | 항목 | 값 |
   |---|---|
   | Application name | `TAG EIGHT CMS` |
   | Homepage URL | `https://tag-eight-web.pages.dev` |
   | Authorization callback URL | `https://tag-eight-web.pages.dev/api/oauth` |

   > **도메인(tag-8.com)을 연결한 뒤에는** 위 두 값과
   > `public/admin/config.yml` 의 `base_url` 을 `https://tag-8.com` 으로 바꾼다.

3. **Register application**
4. **Client ID** 를 복사해 둔다
5. **Generate a new client secret** → 나온 값을 복사해 둔다 (**이 화면을 벗어나면 다시 못 본다**)

### 0-2. Cloudflare 에 값 등록

Cloudflare Dashboard → **Workers & Pages** → `tag-eight-web`
→ **Settings** → **Environment variables** → **Production**

| 이름 | 값 | 종류 |
|---|---|---|
| `GITHUB_CLIENT_ID` | 위에서 복사한 Client ID | Plaintext |
| `GITHUB_CLIENT_SECRET` | 위에서 복사한 Secret | **Secret** ← 반드시 |

저장 후 **Deployments → 최신 배포 → Retry deployment** 로 한 번 다시 배포한다.
(환경변수는 새로 배포해야 반영된다. 문의폼 때와 같다.)

---

## 1. 글 쓰는 순서

1. `https://tag-eight-web.pages.dev/admin` 접속 (도메인 연결 후에는 `https://tag-8.com/admin`)
2. **Sign in with GitHub** → 저장소 권한 승인 (처음 한 번만)
3. 왼쪽 **INSIGHT 記事** → 우측 상단 **新規作成**
4. 입력

   | 항목 | 설명 |
   |---|---|
   | 言語 | 이 글의 언어 |
   | 記事ID | URL 이 된다. 영소문자·숫자·하이픈. 예 `naver-ai-tab` |
   | タイトル | 제목 |
   | 一行要約 | 검색결과·SNS 공유에 뜬다. 60〜90자 |
   | 公開日 | 목록 정렬 기준 |
   | タグ | **2개까지 권장** |
   | 一覧の先頭に固定 | 목록 맨 위 고정 |
   | 下書き | **체크된 동안은 공개되지 않는다** |
   | 本文 | 마크다운 |

5. **保存** → 저장소에 커밋됨
6. `下書き` 체크를 풀고 다시 保存 → **약 2분 뒤 공개**

### 다른 언어판 추가

같은 순서로 새 글을 만들되 **`記事ID` 를 똑같이** 쓴다.
예) `naver-ai-tab` 를 ja / ko / zh-tw 세 건.
→ URL 이 각각 `/insight/naver-ai-tab`, `/ko/insight/naver-ai-tab`, `/zh-tw/insight/naver-ai-tab` 가 된다.

**한 언어만 있어도 문제없다.** 없는 언어는 그 글만 안 생긴다.

---

## 2. 본문에 쓸 수 있는 것

```markdown
## 큰 제목
### 작은 제목

문단은 빈 줄로 나눈다.

- 항목
- 항목

1. 번호
2. 번호

> 인용

**굵게**, [링크](https://tag-8.com), `코드`

---
```

이미지는 본문 툴바의 이미지 버튼 → 업로드. `public/img/insight/` 에 저장된다.

⚠️ **표는 쓰지 마라.** 모바일에서 가로로 넘친다. 목록으로 바꿔 쓴다.

---

## 3. 자주 걸리는 것

| 증상 | 원인·대처 |
|---|---|
| 로그인 창이 열렸다 그냥 닫힌다 | Cloudflare 환경변수 미등록 또는 배포 전. 0-2 재확인 |
| `Not Found` | callback URL 오타. 지금은 `https://tag-eight-web.pages.dev/api/oauth` |
| 保存했는데 사이트에 없다 | `下書き` 가 켜져 있다 / 빌드 2분 대기 / Deployments 에서 실패 여부 확인 |
| 記事ID 를 잘못 썼다 | 관리화면에서 파일을 지우고 새로 만든다. 이미 공개했다면 URL 이 바뀌므로 주의 |

---

## 4. 개발자용 메모

- 본문 저장 위치: `src/content/insight/YYYY-MM-DD-<postId>-<lang>.md`
- 스키마: `src/content.config.ts` — 필드를 늘리려면 여기와 `public/admin/config.yml` 을 **양쪽 다** 고친다
- 목록/기사 화면: `src/sections/Journal.astro` / `src/sections/Post.astro`
- 본문 스타일: `global.css` 의 `.prose` — **마크다운이 들어오는 유일한 자리라 여기서만 태그 선택자를 쓴다**
- 로컬 작업 시 `local_backend: true` 라 `npm run dev` 중에는 로그인 없이 파일을 직접 고친다
