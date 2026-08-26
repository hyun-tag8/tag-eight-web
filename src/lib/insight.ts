import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/i18n';

export type Post = CollectionEntry<'insight'>;
export type Category = 'guide' | 'korea' | 'taiwan' | 'notice';

/** 하단 3열 박스에 서는 분류. 순서가 곧 열 순서다 */
export const STREAM: Category[] = ['korea', 'taiwan', 'notice'];

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

/** 그 글이 실제로 번역돼 있는 언어만. 없는 언어로 전환하면 404 가 된다 */
export async function langsOfPost(postId: string): Promise<Lang[]> {
  const all = await getCollection('insight', (e) => !e.data.draft && e.data.postId === postId);
  return all.map((e) => e.data.lang);
}

/** 2026.08.25 형식. 언어와 무관하게 같은 표기를 쓴다 */
export function fmtDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
}
