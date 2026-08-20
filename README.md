# TAG EIGHT — tag-8.com

Astro 기반 정적 사이트. **전 페이지가 원본 HTML에 본문을 담은 채로 출력된다** — 이게 이번 리뉴얼의 핵심이다.
기존 STUDIO.design 사이트는 클라이언트 렌더링이라 크롤러·LLM에 본문이 0자로 보였다.

- 언어: 일본어(기본, 접두사 없음) / 한국어 `/ko` / 번체중문 `/zh-tw`
- 페이지: 21개 (7페이지 × 3언어)
- 배포: Cloudflare Pages (무료)

---

## 매번 확인할 때 (2회차부터)

서버를 끌 필요도, `npm install` 을 다시 할 필요도 없다.

```bash
./update.sh
```

새로 받은 zip 에서 `src/` 와 `public/` 만 뽑아 덮어쓴다.
개발 서버는 켜둔 채로 두면 브라우저가 알아서 새로고침한다.
`package.json` 이 바뀐 경우에만 스크립트가 알려주고, 그때만 `npm install` 을 한 번 더 하면 된다.

---

## 로컬에서 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ 에 정적 파일 생성
npm run preview  # 빌드 결과 확인
```

---

## GitHub에 올리기 (최초 1회)

GitHub에서 **빈 저장소**를 먼저 만든다 (README·gitignore 체크 해제).
저장소 이름 예: `tag-eight-web`

```bash
cd tag-eight
git init
git add .
git commit -m "TAG EIGHT 사이트 초기 구조"
git branch -M main
git remote add origin https://github.com/<계정명>/tag-eight-web.git
git push -u origin main
```

---

## Cloudflare Pages 연결 (최초 1회)

1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 방금 만든 저장소 선택
3. 빌드 설정:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Save and Deploy

이후 `git push` 할 때마다 자동 배포된다.
**도메인은 신규 사이트를 프리뷰 URL에서 충분히 검수한 뒤에 연결할 것.**

### ⚠️ 도메인 전환 시 주의

`tag-8.com`의 **MX 레코드(메일)를 건드리지 말 것.** 잘못 만지면 `info@tag-8.com`이 죽는다.
바꾸는 건 A / CNAME 레코드뿐이다.

---

## 구조

```
src/
├─ data/
│  ├─ company.ts     ← 회사 정보 단일 소스. 会社概要 표시 + JSON-LD가 여기를 참조
│  └─ i18n.ts        ← 3개 언어 카피 사전. 문장 수정은 전부 여기서
├─ sections/         ← 페이지 본문 (언어 무관, lang을 받아서 렌더)
├─ components/       ← Head(SEO·hreflang·JSON-LD) / Header / Footer / Eyebrow
├─ layouts/Base.astro
└─ pages/
   ├─ *.astro        ← 일본어 (루트)
   └─ [lang]/*.astro ← 한국어·번체중문 (같은 섹션을 재사용)
```

**카피를 고칠 때는 `src/data/i18n.ts` 한 파일만 보면 된다.**
페이지 파일을 건드릴 일은 거의 없다.

---

## 남은 작업 (TODO)

- [ ] `src/data/company.ts` — 건물명(`近鉄半蔵門SQUARE` vs `VORT半蔵門PLUS`)과 대표번호 확정
- [ ] WORKS 상세 (Content Collections로 케이스 10건 추가)
- [ ] JOURNAL 아티클
- [ ] 문의 폼 (Cloudflare Pages Functions 또는 Formspree)
- [ ] OG 이미지 제작 후 `public/og.png` 추가 + `Head.astro`에 연결
- [ ] 팀 사진, 오피스 사진 등 이미지 에셋
- [ ] 기존 URL 301 리다이렉트 (`/SOLUTION` → `/service`, `/about` → 유지, `/people` → 유지, `/contact` → 유지)

---

## 디자인 노트

- 로고 `#8` = 해시태그 `#` + 무한 `∞`. 이 사이트는 그 **`#`을 섹션 마커로 전용**한다. 장식이 아니라 구조 표시.
- 색: 종이 `#FAFAF7` / 먹 `#0B0B0B` / 회 `#6E6E69` / 괘선 `#E2E1DC` / 朱 `#D2321E`
  朱는 마커와 포커스에만 쓴다. 넓은 면적에 쓰지 않는다.
- 서체: Archivo(디스플레이) / Azeret Mono(라벨·데이터) / 언어별 고딕(본문)
  CJK 폰트는 **활성 언어 것만** 불러온다. 3개를 다 불러오면 수 MB가 된다.
- 연출은 히어로의 `#8` 회전 진입 한 곳뿐. `prefers-reduced-motion`을 존중한다.
