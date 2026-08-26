/**
 * GitHub 로그인 창구 (관리화면 전용).
 *
 * Sveltia/Decap CMS 는 브라우저만으로 GitHub 에 커밋하는데,
 * 그러려면 「GitHub 로그인 → 토큰 발급」을 중계할 서버가 하나 필요하다.
 * 그 최소 구현이다. 토큰은 저장하지 않고 관리화면 창에 넘겨주고 끝난다.
 *
 * 필요한 환경변수 (Cloudflare Pages → Settings → Environment variables)
 *   GITHUB_CLIENT_ID      GitHub OAuth App 의 Client ID
 *   GITHUB_CLIENT_SECRET  같은 앱의 Client Secret   ← Secret 으로 등록할 것
 *
 * GitHub OAuth App 의 Authorization callback URL:
 *   도메인 연결 전 → https://tag-eight-web.pages.dev/api/oauth
 *   연결 후        → https://tag-8.com/api/oauth
 */
interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

/** 관리화면이 열려 있는 주소. 도메인 연결 전에는 .pages.dev 다.
 *  연결 후 tag-8.com 으로 바꾸면 되고, 둘 다 허용해 두면 전환 중에도 끊기지 않는다. */
const ALLOWED_ORIGINS = ['https://tag-eight-web.pages.dev', 'https://tag-8.com'];

/** 관리화면 창으로 결과를 돌려주는 페이지. postMessage 로 부모 창에 전달한다 */
function closer(status: 'success' | 'error', payload: unknown, origin: string): Response {
  const target = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  const body = JSON.stringify(payload);
  const html = `<!doctype html><meta charset="utf-8"><title>…</title><script>
(function () {
  function send() {
    window.opener && window.opener.postMessage(
      'authorization:github:${status}:' + ${JSON.stringify(body)},
      '${target}'
    );
  }
  window.addEventListener('message', send, false);
  send();
  setTimeout(function(){ window.close(); }, 800);
})();
</script><p style="font:14px/1.6 system-ui;padding:2rem">この画面は自動で閉じます。</p>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // 어느 값이 비었는지 이름만 돌려준다. 값은 절대 내보내지 않는다.
  // (2026-08-25: 변수명을 ITHUB_CLIENT_SECRET 으로 잘못 넣어 500 만 반복된 적이 있다)
  const missing = [
    !env.GITHUB_CLIENT_ID && 'GITHUB_CLIENT_ID',
    !env.GITHUB_CLIENT_SECRET && 'GITHUB_CLIENT_SECRET',
  ].filter(Boolean);
  if (missing.length) {
    return new Response(
      `OAuth の環境変数が未設定です: ${missing.join(', ')}\n` +
        `Cloudflare Pages → Settings → Variables and secrets で名前を確認し、保存後に再デプロイしてください。`,
      { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }

  // 1단계 — GitHub 인증 화면으로 보낸다
  if (!code) {
    const to = new URL('https://github.com/login/oauth/authorize');
    to.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    to.searchParams.set('scope', 'repo,user');
    to.searchParams.set('redirect_uri', `${url.origin}/api/oauth`);
    to.searchParams.set('state', crypto.randomUUID());
    return Response.redirect(to.toString(), 302);
  }

  // 2단계 — 돌아온 code 를 토큰으로 바꾼다
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };
    if (!data.access_token) {
      return closer('error', { message: data.error ?? 'token_exchange_failed' }, url.origin);
    }
    return closer('success', { token: data.access_token, provider: 'github' }, url.origin);
  } catch (e) {
    return closer('error', { message: String(e) }, url.origin);
  }
};
