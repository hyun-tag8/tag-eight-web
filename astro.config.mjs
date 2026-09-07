// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tag-8.com',
  // 전 페이지 정적 생성(SSG). 이게 이번 리뉴얼의 핵심 —
  // 원본 HTML에 본문이 실려야 검색엔진과 LLM이 읽는다.
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // 사이트맵에서 뺀다:
      // · /contact/thanks/ — 송신 완료 페이지. noindex 인데 사이트맵에 실으면 신호가 모순된다.
      // · ko/zh-tw 의 insight 분류 목록 — 현재 번역 기사 0건이라 빈 페이지다.
      //   ⚠ ko/zh 번역 기사를 올리기 시작하면 아래 두 번째 조건을 지울 것. (2026-09-04)
      // · ko/zh-tw 전체 — 전면 수정 전까지 비공개 (2026-09-07 대표 판단, i18n.ts PUBLIC_LANGS 참조).
      //   재공개 시: 아래 (ko|zh-tw) 제외 행을 지우고 i18n 블록 주석을 푼다.
      filter: (page) =>
        !page.includes('/contact/thanks/') &&
        !/\/(ko|zh-tw)\//.test(page),
      // i18n alternates 도 비공개 동안 정지 — ja 항목이 가린 언어를 가리키면 신호가 모순된다.
      // i18n: {
      //   defaultLocale: 'ja',
      //   locales: { ja: 'ja', ko: 'ko', 'zh-tw': 'zh-Hant-TW' },
      // },
    }),
  ],
});
