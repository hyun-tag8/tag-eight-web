# 배포 안내

## 큰 그림

```
내 맥의 폴더  →  GitHub  →  Cloudflare Pages  →  tag-8.com
   (수정)        (git push)     (자동 빌드·배포)      (공개)
```

한 번 연결해두면, 이후에는 **`./deploy.sh` 한 줄이면 사이트가 갱신된다.**

Claude Design 은 이 용도가 아니다. 디자인 캔버스 도구라 호스팅과 도메인 연결을 하지 못한다.

---

## 최초 1회 (30분)

### 1. GitHub 에 빈 저장소 만들기

github.com 에서 **New repository**
- 이름: `tag-eight-web`
- **Private** 권장
- README·gitignore·license 전부 **체크 해제** (이미 프로젝트에 있다)

### 2. 이 폴더를 저장소에 올린다

```bash
cd /Users/rider38c/Downloads/tag-eight
git init
git add -A
git commit -m "TAG EIGHT 사이트 초기 배포"
git branch -M main
git remote add origin https://github.com/<계정명>/tag-eight-web.git
git push -u origin main
```

비밀번호를 물으면 GitHub 계정 비밀번호가 아니라 **Personal Access Token** 이 필요하다.
GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
→ 이 저장소에 `Contents: Read and write` 권한만 주면 된다.

### 3. Cloudflare Pages 연결

1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 방금 만든 저장소 선택
3. 빌드 설정
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Save and Deploy**

1~2분 뒤 `○○○.pages.dev` 임시 주소로 사이트가 뜬다.

### 4. 임시 주소에서 충분히 검수한다

> **배포 ≠ 공개다.**
> `○○○.pages.dev` 에 올라가도 `tag-8.com` 은 그대로 기존 사이트다.
> 도메인 연결(5단계)을 하기 전까지 새 사이트는 이 주소를 아는 사람만 본다.
> `public/_headers` 에 `.pages.dev` 전용 `X-Robots-Tag: noindex` 를 걸어둬서 검색에도 잡히지 않는다.
> **남은 수정은 전부 이 단계에서 한다.** 고칠 때마다 `./deploy.sh` 한 줄이면 90초 안에 반영된다.

**여기서 시간을 쓰는 게 맞다.** 도메인을 붙이기 전에 확인할 것:

- 전 페이지 표시 (일본어 / 한국어 / 번체중문)
- 모바일 실기기 표시
- 이미지 로딩
- **문의 폼 실제 송신** — 로컬에서는 `/api/contact` 가 404 라 여기서만 검증된다

### 5. 도메인 연결

Cloudflare Pages 프로젝트 → **Custom domains** → `tag-8.com` 추가

> ### ⚠️ MX 레코드를 건드리지 마라
>
> `info@tag-8.com` 이 MX 레코드로 동작한다.
> 바꿔야 하는 것은 **A 레코드와 CNAME 뿐**이다.
> MX 를 지우면 회사 메일이 즉시 죽는다.

기존 STUDIO 사이트는 도메인이 넘어간 뒤에도 **바로 해지하지 말고** 1~2주 두고 관찰한다.

---

## 이후 업데이트

내가 새 zip 을 주면:

```bash
./update.sh     # 소스 갱신 (서버 켜둔 채로)
./deploy.sh "무엇을 바꿨는지"
```

`deploy.sh` 는 빌드가 통과할 때만 올린다. 빌드가 깨지면 배포를 중단한다.

Cloudflare 가 1~2분 안에 자동으로 새 버전을 배포한다.

---

## 직접 고치고 싶을 때

작은 문구 수정은 zip 을 기다릴 필요 없다.

| 고칠 것 | 파일 |
|---|---|
| 모든 문구 (3개 언어) | `src/data/i18n.ts` |
| 회사 정보 · 주소 · 전화 | `src/data/company.ts` |
| 케이스 10건 본문 | `src/data/cases.ts` |
| 색 · 여백 · 서체 크기 | `src/styles/global.css` |

고친 뒤 `./deploy.sh "문구 수정"` 하면 반영된다.

**GitHub 웹사이트에서 직접 고쳐도 된다.** 저장소에서 파일을 열고 연필 아이콘 → 수정 → Commit.
맥을 안 켜도 되고, 커밋하면 Cloudflare 가 알아서 배포한다. 출장 중에 유용하다.

---

## 되돌리기

배포한 게 잘못됐을 때:

Cloudflare 대시보드 → 프로젝트 → **Deployments** → 이전 배포 → **Rollback**

몇 초 만에 직전 버전으로 돌아간다. 코드를 건드릴 필요가 없다.

---

## 비용

| 항목 | 비용 |
|---|---|
| Cloudflare Pages | 무료 (월 500회 빌드) |
| GitHub Private 저장소 | 무료 |
| 도메인 `tag-8.com` | 기존 유지 |
| STUDIO 구독 | **해지 가능** (안정화 확인 후) |

---

## 아직 남은 것

**끝난 것 — 다시 손대지 말 것**

- [x] 문의 폼 — **Formspree 를 쓰지 않는다.** Cloudflare Pages Function(`functions/api/contact.ts`) + Resend 로 구현 완료.
      남은 건 코드가 아니라 **Resend 가입 · DNS 3줄 · 환경변수 3개** 뿐이다 → `CONTACT_SETUP.md`
- [x] 프라이버시 폴리시 페이지 — 3개 언어 완성 (`/privacy`, `/ko/privacy`, `/zh-tw/privacy`)
- [x] OG 이미지 — `public/og.jpg` (1200×630) 제작 · `Head.astro` 연결 완료

**남은 것**

- [ ] PEOPLE 실제 멤버 사진 (현재 AI 가공. 본인 확인 필요 — 특히 HESTER LIN · JEEHYUN YONG)
- [ ] CONTACT 건물 외관 사진 (직접 촬영)
- [ ] 번체중문 케이스 10건 (`cases.ts` 에 zh-tw 0건 / ja·ko 각 10건)
- [ ] INSIGHT 페이지 콘텐츠
