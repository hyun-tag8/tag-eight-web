# ABOUT — VISION 비주얼 교체 기록

작성 2026-08-21 (Asia/Tokyo)

## Before / After

```
Before   [사진] [사진] [사진]      AI 생성 인물 3명 (한국·일본·대만 여성)
          ↑호버  ↑호버  ↑호버       칸마다 별도 영상 face-kr / face-jp / face-tw.mp4

After    [ ─────── 한 장의 띠 ─────── ]
          위에서 내려다본 군상 + 지나가는 선 다섯 개
          public/img/vision.webp (흑백)
```

## 판단 근거

**1. 모델 컷을 걷어냈다**
포즈를 잡은 인물 사진은 「우리가 이런 사람들과 일한다」로 읽힌다.
시점을 위로 올려 군상(群像)으로 바꾸니 개인이 아니라 **흐름**이 보인다.
사람을 없앤 것이 아니라 **시점을 바꾼 것**이다.

**2. 호버를 세 번 하는 사람은 없다 (대표 지적)**
칸마다 영상을 따로 두면 세 번 스쳐야 전체가 보인다. 실제 방문자는 그러지 않는다.

**3. 홈 히어로와 중복을 피했다**
구 3분할은 「3개국」이었는데, 홈 히어로가 이미 서울·도쿄·타이베이 3영상을 쓰고 있다.
같은 카드를 두 번 쓰는 셈이었다.

## 선 다섯 개의 색

컬러판(`vision-color.webp`)의 선 5색은 **임의 배색이 아니다.**
COMPANY 페이지 멤버 5명의 퍼스널 컬러와 정확히 같다.

| HEX | 멤버 | |
|---|---|---|
| `#F37021` | DONGHYUN LEE | Hermès Orange |
| `#3F8F63` | YONGJUN PARK | Green |
| `#2E6FB7` | JEEHYUN YONG | Blue |
| `#C0417A` | HESTER LIN | Magenta |
| `#6B7043` | SHISEI AOKI | Deep Khaki |

두 페이지를 다 본 사람에게 「저 선이 이 사람들이었구나」가 뒤늦게 걸린다.
「国境を越えるのは、まず私たち自身。」(OUR TEAM 카피)와 직결된다.

**멤버가 바뀌면 컬러판도 다시 만들어야 한다.**

## 흑백 / 컬러 전환

현재는 **흑백**이 걸려 있다.

```
public/img/vision.webp         흑백 (현재)   78KB
public/img/vision-color.webp   컬러 (예비)   83KB
```

전환은 `src/sections/About.astro` 의 `<img src>` 한 줄만 바꾸면 된다.

⚠️ **흑백은 파일에 구워져 있다. CSS `filter: grayscale()` 을 쓰지 않는다.**
다른 효과와 겹치면 충돌하고, 브라우저마다 결과가 갈린다.

## 시도했다가 버린 것 (재논의 방지)

| 시도 | 결과 |
|---|---|
| CJK 타이포 애니메이션 (세 언어 → 心) | 대표 반려 |
| 한지 + 먹 번짐 배경 | 먹이 진해 중앙 대비 1.8:1, 글자가 안 보임 |
| Seedance 영상 (사람이 걷는 모션) | **3회 시도 3회 실패.** 작은 군중을 「질감」으로 인식해 국소적으로만 흔든다. 긴 거리 이동을 만들지 못함 |
| 스프라이트 분리 + CSS 이동 | 기술적으로는 성공. 최종적으로 정지 이미지 채택 |

**Seedance 로 군중 이동을 다시 시도하지 말 것.** 크레딧만 소모된다.

## AI 생성 표기

이 이미지는 AI 로 생성했다. `philosophy.aiNote` 표기를 **지우면 안 된다.**
한국 AI기본법(2026-01-22 시행) 대응.

3개 언어 전부 출력 확인:
```
ja     ※ 本ページのイメージビジュアルはAIで生成しています。
ko     ※ 이 페이지의 이미지 비주얼은 AI로 생성했습니다.
zh-tw  ※ 本頁面的形象視覺為 AI 生成。
```

## 미참조가 된 자산 (합계 396KB)

즉시 지우지 않고 **한 배포 관찰 후** 정리한다.

```
public/img/about-kr.webp      about-kr-sm.webp
public/img/about-jp.webp      about-jp-sm.webp
public/img/about-tw.webp      about-tw-sm.webp
public/video/face-kr.mp4
public/video/face-jp.mp4
public/video/face-tw.mp4
```

CSS 의 `.creed-tiles` 계열 규칙도 제거했다. `.vision-band__note` 만 남아 있다
(구 `.creed-tiles__note` 를 개명한 것, AI 표기용).
