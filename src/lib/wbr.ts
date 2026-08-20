/**
 * CJK 줄바꿈 처리
 * ------------------------------------------------------------
 * 문제: 브라우저는 일본어·중국어를 어디서든 끊는다.
 *       「人を動かすもの／は、ただひとつ。」처럼 어절 중간에서 잘린다.
 *
 * 해결: 두 가지를 같이 쓴다.
 *   1) CSS  word-break: keep-all   → 임의 위치에서 끊지 않는다
 *   2) 본문  <wbr>                  → 문절 경계에만 끊을 자리를 만든다
 *
 * 문절 판정은 BudouX(구글)를 쓴다. 규칙 기반이 아니라 학습 모델이라
 * 「動かす本質は」같은 복합어도 통째로 유지한다.
 *
 * 한국어는 띄어쓰기가 있어 keep-all 만으로 충분하므로 그대로 둔다.
 */
import {
  loadDefaultJapaneseParser,
  loadDefaultTraditionalChineseParser,
} from 'budoux';
import type { Lang } from '../data/i18n';

const parsers = {
  ja: loadDefaultJapaneseParser(),
  'zh-tw': loadDefaultTraditionalChineseParser(),
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * BudouX 가 나눈 문절을 다시 붙여야 하는 경우가 있다.
 *
 * 「韓国・日本・台湾」은 BudouX 가 「韓国・日本・」 / 「台湾の」 로 가르는데,
 * 나라 나열은 하나의 덩어리라 중간에서 줄이 끊기면 안 된다.
 * 중점(・)으로 끝나는 조각은 다음 조각과 무조건 합친다.
 */
function mergeChunks(chunks: string[]): string[] {
  const out: string[] = [];
  for (const c of chunks) {
    const prev = out[out.length - 1];
    // 앞 조각이 중점·중괄점으로 끝나면 이어 붙인다
    if (prev !== undefined && /[・･／/]$/.test(prev)) {
      out[out.length - 1] = prev + c;
      continue;
    }
    // 조각이 닫는 괄호·구두점으로 시작하면 앞에 붙인다
    if (prev !== undefined && /^[」』）\)。、，,？！?!]/.test(c)) {
      out[out.length - 1] = prev + c;
      continue;
    }
    out.push(c);
  }
  return out;
}

/**
 * 문장을 문절 단위로 나누고 그 사이에 <wbr> 를 넣은 HTML 을 돌려준다.
 * 반환값은 set:html 로 렌더해야 한다.
 */
export function wbr(text: string, lang: Lang): string {
  const raw = String(text ?? '');
  if (lang === 'ko') return escapeHtml(raw);

  const parser = parsers[lang as 'ja' | 'zh-tw'];
  if (!parser) return escapeHtml(raw);

  // 줄바꿈 문자는 그대로 살린다
  return raw
    .split('\n')
    .map((line) => mergeChunks(parser.parse(line)).map(escapeHtml).map(noBreakDots).join('<wbr>'))
    .join('\n');
}

/**
 * 중점(・)은 <wbr> 이 없어도 브라우저가 그 뒤에서 줄을 끊는다.
 * word-break: keep-all 로도 막히지 않으므로, 중점을 word-joiner(U+2060) 로 감싼다.
 * 화면에는 아무것도 보이지 않고 끊김만 막힌다.
 */
function noBreakDots(chunk: string): string {
  return chunk.replace(/・/g, '\u2060・\u2060');
}

/**
 * 본문을 문장 단위로 쪼갠다.
 *
 * 왜 필요한가 — 긴 단락을 그대로 흘리면 줄바꿈이 문장 한가운데,
 * 특히 「私たちは、」 같은 주어 뒤에서 떨어져 흐름이 끊긴다.
 * 한 문장을 한 줄(.jp-line)로 세우면 그 사고가 구조적으로 사라진다.
 * 문장이 컨테이너보다 길 때만 문절 경계(<wbr>)에서 접힌다.
 *
 * 대응 문말 — 일본어·번체중문 「。」 / 한국어 「. 」
 */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=。)|(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
