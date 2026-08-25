import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/i18n';

export type Post = CollectionEntry<'insight'>;

/** 공개된 글만. draft 는 빌드에서 제외한다 */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection('insight', (e) => !e.data.draft && e.data.lang === lang);
  return all.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
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
