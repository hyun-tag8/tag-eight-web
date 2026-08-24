# TAG EIGHT 사이트 — 인수인계 (2026-08-24)

## 0. 새 대화창에서 가장 먼저 할 일

```
1. 최신 zip 확인:  tag-eight-web_v138.zip
2. 로컬 경로:      ~/Downloads/tag-eight-web   (Mac mini)
3. PRD 읽기:       PRD.md  ← 모든 결정의 근거가 여기 있다
4. 트랜스크립트:    /mnt/transcripts/  (journal.txt 에 카탈로그)
```

⚠️ `update.sh` 는 Downloads 안에서 **가장 최근 zip**을 집는다.
   실행 첫 줄에 찍히는 `▶ 사용할 파일` 버전이 받은 것과 같은지 반드시 확인한다.
   (2026-08-24, v136을 안 받은 채 v135로 빌드해 「수정이 반영 안 된다」로 헤맴)

**PRD.md 가 단일 진실 소스다.** 「왜 이렇게 했는가」와 「왜 이건 안 하는가」가 전부 기록돼 있다.
같은 논의를 반복하지 않으려면 손대기 전에 해당 섹션을 먼저 읽는다.

---

## 1. 프로젝트 기본

| | |
|---|---|
| 스택 | Astro SSG + Cloudflare Pages + GitHub |
| 언어 | ja(기본) / ko / zh-TW — **58 페이지** |
| 배포 | GitHub `hyun-tag8/tag-eight-web` → `tag-eight-web.pages.dev` (자동 배포) |
| 현재 버전 | **v138** |
| 로컬 확인 | `./update.sh` → `localhost:4321` (Mac mini, Node v24) |

### QA 스크립트 (`/home/claude/`)
```
qa.py          47p × 3뷰포트 — 가로넘침 / JS에러 / alt누락
footercheck.py 푸터 아래 빈 공간
lines2.py      멤버 소개문 줄 수 (2줄 고정 규칙 검증)
```
**변경 후 반드시 3개 다 돌린다.**

### 빌드·패키징 루틴
```bash
cd "/home/claude/site/tag-eight 21" && npm run build
pkill -f "http.server 4321"; cd dist && python3 -m http.server 4321 --bind 127.0.0.1 &
# 검증 후
cd /home/claude && rm -rf pkg && mkdir -p pkg/tag-eight
cd "/home/claude/site/tag-eight 21" && cp -R src public functions /home/claude/pkg/tag-eight/
cp astro.config.mjs tsconfig.json package.json README.md DEPLOY.md PRD.md \
   CONTACT_SETUP.md deploy.sh update.sh /home/claude/pkg/tag-eight/
cd /home/claude/pkg && zip -qr /mnt/user-data/outputs/tag-eight-web_v125.zip tag-eight
```

---

## 2. 🔴 공개 블로커 (우선순위순)

| # | 항목 | 비고 |
|---|---|---|
| 1 | **zh-TW 케이스 10건 HESTER 사인오프** | v137에 초안 투입 완료. **검수 전까지 공개 보류** |
| 2 | **멤버 5명 본인 확인** | AI 가공 얼굴. 특히 HESTER LIN(눈매 신규) · JEEHYUN YONG(재현도 최저) |
| 3 | **애널리틱스 미설치** | 스크립트 0개. 공개 전 설치 안 하면 베이스라인이 사라진다 |
| 4 | **도메인 tag-8.com 연결** | eNom에서 A레코드만 교체. MX 5개·SPF TXT 절대 미변경 |

**완료됨** — GitHub+Cloudflare 연결(08-20) / 문의폼 GAS+Gmail 경유(08-23, Resend·Formspree 폐기) / Privacy 페이지

## 3. 🟡 진행 예정

| 항목 | 상태 |
|---|---|
| zh-TW 케이스 원고 | **v137에서 10건 투입 완료**(ja 10 / ko 10 / zh-TW 10). HESTER 검수 대기 |
| INSIGHT 페이지 | 빈 페이지 |
| 실물 덱 전체 개정 | 사이트 확정 후 맞춘다 |
| 케이스별 이미지 | `cases.ts` 에 `image` 필드 없음. 현재 도시 히어로 이미지 재사용 |

### ⚠ 덱과 갈린 항목 (개정 시 일괄 반영)
```
MISSION 문구
자본금 550만 (덱 p14 · 명함 · 견적서는 500만)
WHAT WE DO 3영역 명칭:
  戦略設計・現地最適化      → ブランド戦略・現地最適化
  クリエイティブ制作        → クリエイティブ開発・コンテンツ制作
  キャンペーン実行・検証     → プロモーション実行・メディア運用
```

---

## 4. 확정된 디자인 원칙 (건드리지 말 것)

### 4.1 호버 — 큰 제목은 반응하지 않는다
```
큰 제목    이미 그 화면의 주역 → 변화 없음
작은 층    색 + 굵기 + 확대로 살아난다
```
| 위치 | 반응 대상 |
|---|---|
| 홈 WORKS | 분류(`メディア戦略`)에 개인색 + w500 + scale(1.12) / 루트는 scale만 |
| **WORKS 목록** | **방향 박스(.case-tag)가 흰색 → 검정으로 반전.** 제목은 반응 없음(4.1 원칙) |
| 홈 CAPABILITIES | 일본어 영역명에 개인색 |
| CAPABILITIES 페이지 | 라벨 scale(1.18) + 항목에 개인색 |

> **홈과 상세는 반응 대상이 달라도 된다.** 홈은 훑는 자리, 상세는 읽는 자리.
> **통일하지 말 것.**

### 4.2 개인색 — 배경에 따라 값이 다르다
```
01 #F37021  DONGHYUN
02 #3F8F63  YONGJUN
03 #2E6FB7  JEEHYUN
04 #C0417A  HESTER
05 #6B7043  SHISEI   (홈 미등장 — 케이스 4장이라)
```
- **흰 배경**: 위 원본색 그대로. `ink` 변형(#B54A15 등)은 **폐기** — 원본보다 어두워 「진해 보인다」
- **PEOPLE `#` 마크**: 같은 색 + **불투명도 42~46%** → 화면상 `#FABD99` 등 파스텔로 보임.
  그 파스텔 값을 텍스트에 쓰면 대비 1.6~2.0:1 로 읽히지 않는다
- **네온(`text-shadow`)은 쓰지 않는다** — 무채색 사이트에서 깔끔하지 못하다

### 4.3 전환
```
color / font-weight :  .22s cubic-bezier(.22, 1, .36, 1)
transform           :  .3s  cubic-bezier(.22, 1, .36, 1)
```
`ease` 는 시작이 굼떠 「딱딱 끊긴다」고 느껴진다.

### 4.4 CJK 자간
| 층 | 값 |
|---|---|
| 일본어 큰 제목 | `+0.005em` |
| 일본어 본문 | `+0.02em` |
| 작은 설명 | `+0.01em` |
| 영문 라벨 | `.24em` (WHY 포함 — `.3em` 은 흩어진다) |
| 숫자·라틴 전용 | **음수 유지** (`.num` -0.04 / `.facts__n` -0.05) |

⚠ `.tm__bio` 만 `+0.008em` — 표준(0.02)을 주면 **2행 규칙이 깨져 3행으로 넘친다**

### 4.4-b WORKS 목록 — 제목 1행 고정 (2026-08-24)

```
3열   번호 3rem │ 제목 1fr(nowrap) │ 방향 박스 13rem(고정)
```

| 왜 | |
|---|---|
| 제목이 2행으로 접히면 | 10행이 리듬 없이 뭉친다. 훑는 자리인데 읽는 자리가 된다 |
| `white-space: nowrap` + `clamp(1.3rem, 2.5vw, 2rem)` | 폭이 아니라 **글자 크기**로 1행을 맞춘다 |
| 방향 박스 열을 **고정 13rem** | `auto` 로 두면 박스마다 폭이 달라지고, 긴 박스(ja「キャンペーン設計・実行」193px)가 열(102px)을 넘어 **제목을 침범**한다 |
| 3열 시작을 48rem → **64rem** | 그 아래에서는 1행이 성립하지 않는다. 접히게 두는 게 맞다 |

**실측 여유**(가장 긴 ko 케이스 10번) — 1024px 42px / 1280px 136px / 1920px 104px
⚠ **ko 원고를 늘리면 여기가 먼저 깨진다.** 제목 길이 상한은 계속 ko 기준.

### 4.5 클로징 CTA
`src/components/ClosingCta.astro` — 홈 포함 5페이지 공통.
| 페이지 | CTA |
|---|---|
| 홈 · CAPABILITIES · WORKS · INSIGHT · COMPANY | ● |
| ABOUT | — `.why` 가 이미 검정. 대신 **WHY 안에 `TAG EIGHT →` 버튼**(→ /company) |
| CONTACT | — 페이지 자체가 창구 |

> `CONTACT` → `Connect` 개명안은 **폐기**. 라벨·버튼·내비·페이지 제목 네 곳이 어긋난다.

---

## 5. 기술적 함정 (실제로 밟은 것)

| | |
|---|---|
| **CSS 블록 삭제** | 범위를 넘겨 **13,000자 소실**한 적 있음(`.vpanel` `.svc-brief` `.sector` 등 27개 셀렉터). 삭제 시 시작·끝 마커를 모두 검증하고 **삭제 길이를 assert 로 상한 검사**한다 |
| **`transform: scale()`** | 레이아웃을 밀지 않아 **옆 요소를 덮는다.** `.wcard__meta` gap 을 2rem 으로 올려 해결. 배율 바꾸면 gap 재계산 |
| **`T` 컴포넌트** | `\n` 을 처리하지 않는다(BudouX `<wbr>` 전용). 개행은 `split('\n')` + `<br />` |
| **`ch` 단위** | CJK 에서 절반밖에 못 담는다. 폭 제한에 쓰지 말 것 |
| **한국어가 먼저 넘친다** | 제목 크기 상한은 **ko 기준**으로 잡는다. 현재 홈 WORKS 제목 상한 23.2px 은 **임시값** — ko 원고 확정 후 26px 까지 상향 가능 |
| **`font-size` 호버 변경** | 레이아웃이 밀린다. `transform: scale()` 을 쓴다 |
| **full_page 스크린샷** | lazy 이미지·`.rise` 페이드인이 안 잡힌다. 스크롤 후 섹션별로 찍을 것 |

---

## 6. 카피 확정본 (변경 금지)

### 멤버 소개문 — 5명 확정, 3언어 전부 2줄
| | 축 | 서술어 | 직함 |
|---|---|---|---|
| DONGHYUN LEE | 외국인의 위치 | `探す` | Creative Director & CEO |
| YONGJUN PARK | 20년의 감각 | `動く` | Content Producer |
| JEEHYUN YONG | 매체의 움직임 | `考える` | Media & Social Producer |
| HESTER LIN | 양쪽 목소리 | `いる` | Creative Producer |
| SHISEI AOKI | 사실 | `事実から` | Strategy Producer |

### 페이지 헤드
```
CAPABILITIES  文化の違いを、選ばれる理由に変える。
              韓国・日本・台湾。ブランドの想いと、その市場で暮らす人の感覚。その「間」に立ち、
              戦略からクリエイティブ、実行までをつくります。

홈 CAPABILITIES  考える。つくる。届ける。   ← 세 동사가 3블록과 1:1 대응. 순서 바꾸면 같이 바꿀 것
WORKS            課題の立て方を変えると、答えが変わる。
CONTACT          まだ、選ばれる理由がない。 / そこから始めるのが、私たちの仕事です。
```

### 3블록 리드 — 하나로 이어진다
```
見つける → 形にする → つなげる
```

---

## 7. 대화 스타일

- 한국어로 논의, 일본어는 자연스러운 비즈니스 일본어(직역 금지)
- **결론부터.** 짧고 단정적으로
- 피드백은 감각으로 온다(「올드하다」「없어 보인다」「어색하다」) → **기술적 원인을 진단**해서 답한다
- 시안은 **실제로 만들어서 스크린샷으로 비교**한다. 말로만 설명하지 않는다
- 변경 후 QA 3종 → 패키징 → `present_files` 까지가 한 세트
