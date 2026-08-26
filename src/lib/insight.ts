import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/i18n';

export type Post = CollectionEntry<'insight'>;
export type Category = 'guide' | 'korea' | 'taiwan' | 'notice';

/** 하단 3행에 서는 분류. 순서가 곧 행 순서다 */
export const STREAM: Category[] = ['korea', 'taiwan', 'notice'];

/**
 * 분류별 목록 페이지의 URL 조각. /insight/korea 처럼 쓴다.
 *
 * ⚠ 기사 URL(/insight/<postId>)과 같은 층이다.
 *   postId 로 korea / taiwan / notice 를 쓰면 라우트가 충돌하므로,
 *   아래 isReservedSlug 로 막는다.
 */
export const CAT_SLUG: Record<'korea' | 'taiwan' | 'notice', string> = {
  korea: 'korea',
  taiwan: 'taiwan',
  notice: 'notice',
};

/** 분류 목록 URL 과 겹치는 postId 인지. 겹치면 기사 쪽 라우트를 만들지 않는다 */
export const isReservedSlug = (id: string) => Object.values(CAT_SLUG).includes(id);

const byDate = (a: Post, b: Post) => {
  if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
  return b.data.date.getTime() - a.data.date.getTime();
};

/** 공개된 글만. draft 는 빌드에서 제외한다 */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('insight', (e) => !e.data.draft && e.data.lang === lang);
  return all.sort(byDate);
}

/**
 * 常設 해설 기사.
 * 검색·생성형 엔진에서 들어오는 착지점이라 목록 위쪽에 고정된다.
 */
export async function getGuides(lang: Lang): Promise<Post[]> {
  const all = await getPosts(lang);
  return all.filter((e) => e.data.category === 'guide');
}

/**
 * 3열 박스용. 열이 비어도 키는 남긴다 —
 * 台湾 열이 사라지면 「대만은 안 한다」로 읽히므로, 비어 있으면 준비중을 띄운다.
 */
export async function getStream(lang: Lang): Promise<Record<Category, Post[]>> {
  const all = await getPosts(lang);
  const out = { guide: [], korea: [], taiwan: [], notice: [] } as Record<Category, Post[]>;
  for (const e of all) out[e.data.category as Category].push(e);
  return out;
}

/**
 * 홈에 띄울 3건 — 분류마다 최신 1건씩.
 * 「최신 3건」으로 뽑으면 한국 글만 3개 뜨는 날이 생기고,
 * 그날은 대만을 다룬다는 신호가 사라진다.
 */
export async function getHomePicks(lang: Lang): Promise<{ cat: Category; post: Post }[]> {
  const s = await getStream(lang);
  return STREAM.map((c) => ({ cat: c, post: s[c][0] })).filter((x): x is { cat: Category; post: Post } => !!x.post);
}

/** NEW 배지가 붙는 기간(일). 판정은 브라우저에서 한다 — 아래 isFresh 주석 참조 */
export const NEW_DAYS = 7;

/**
 * INSIGHT 첫 화면의 대형 카드에 설 1건.
 * 3분류를 통틀어 가장 최신 것 — 「지금 이 회사가 무엇을 보고 있나」가 한 장으로 전해진다.
 * ⚠ guide 는 제외한다. 그쪽은 위 블록에 상설되므로 여기서 또 나오면 중복이다.
 */
export async function getLead(lang: Lang): Promise<Post | null> {
  const all = await getPosts(lang);
  return all.find((e) => e.data.category !== 'guide') ?? null;
}

/** 한 분류의 글 전체. 분류별 목록 페이지가 쓴다 */
export async function getByCategory(lang: Lang, cat: Category): Promise<Post[]> {
  const all = await getPosts(lang);
  return all.filter((e) => e.data.category === cat);
}

/** 그 글이 실제로 번역돼 있는 언어만. 없는 언어로 전환하면 404 가 된다 */
export async function langsOfPost(postId: string): Promise<Lang[]> {
  const all = await getCollection('insight', (e) => !e.data.draft && e.data.postId === postId);
  return all.map((e) => e.data.lang);
}

/** ISO 날짜(YYYY-MM-DD). NEW 판정을 브라우저에 넘길 때 쓴다 */
export function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 2026.08.25 형식. 언어와 무관하게 같은 표기를 쓴다 */
export function fmtDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}
