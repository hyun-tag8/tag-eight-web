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
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja', ko: 'ko', 'zh-tw': 'zh-Hant-TW' },
      },
    }),
  ],
});
