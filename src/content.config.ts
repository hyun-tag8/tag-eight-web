import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * INSIGHT 기사.
 *
 * 파일 하나 = 기사 하나. 언어는 프런트매터의 lang 으로 구분한다.
 * 언어별 폴더를 나누지 않는 이유 — 관리화면에서 한 목록으로 보여야
 * 「어떤 글이 어느 언어까지 나갔는가」를 한눈에 볼 수 있다.
 *
 * 파일명: YYYY-MM-DD-slug-<lang>.md   예) 2026-09-01-naver-ai-tab-ja.md
 * 같은 글의 다른 언어판은 postId 를 같게 쓴다 → 언어 전환이 이어진다.
 *
 * ⚠️ Astro 6 부터 이 파일은 src/content.config.ts 여야 하고
 *    컬렉션마다 loader 가 필요하다(구 src/content/config.ts 는 오류).
 */
const insight = defineCollection({
  loader: glob({ base: './src/content/insight', pattern: '**/*.md' }),
  schema: z.object({
    lang: z.enum(['ja', 'ko', 'zh-tw']),
    /** 같은 글의 언어판을 잇는 열쇠. 언어가 달라도 같은 값 */
    postId: z.string(),
    title: z.string(),
    /** 목록·메타 설명에 쓰는 한 줄 */
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    /**
     * 분류. 페이지 안에서 자리가 갈린다.
     *   guide  → 상단 「常設」 블록. 검색 착지점이 되는 해설 기사
     *   korea / taiwan / notice → 하단 3열 박스
     *
     * ⚠ 기본값 korea 는 기존 글(분류 없이 쓴 것)을 깨뜨리지 않기 위한 것이다.
     *   새 글은 반드시 관리화면에서 고를 것.
     * ⚠ 값을 늘리면 public/admin/config.yml 의 선택지도 함께 고쳐야 한다.
     */
    category: z.enum(['guide', 'korea', 'taiwan', 'notice']).default('korea'),
    /**
     * 최신 1건이 서는 대형 카드의 배경 이미지(선택).
     * 넣으면 사진 위에 제목이 얹히고, 없으면 검정 판 그대로다.
     * ⚠ 없어도 화면이 깨지지 않아야 한다 — 이미지 제작이 발행 속도를 막으면 안 된다.
     */
    cover: z.string().optional(),
    /** 목록 상단 고정 */
    featured: z.boolean().default(false),
    /** true 면 빌드에서 제외. 관리화면의 「비공개」 */
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { insight };
