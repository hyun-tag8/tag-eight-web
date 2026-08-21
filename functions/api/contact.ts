/**
 * 문의 폼 수신 — Cloudflare Pages Function
 * ----------------------------------------------------------------
 * POST /api/contact
 *
 * 2통을 보낸다.
 *   ① 담당자 통지  → info@tag-8.com
 *   ② 자동응답     → 문의자 (reply-to 는 info@tag-8.com)
 *
 * 자동응답이 핵심이다. 일본 B2B 에서는 폼 송신 후 확인 메일이 없으면
 * 담당자가 「보내진 건가?」로 남고, 稟議 회람용 기록도 남지 않는다.
 *
 * 발송사는 2곳을 지원한다. 키가 들어 있는 쪽이 자동으로 쓰인다.
 *
 *   Brevo   BREVO_API_KEY    ← 현재 이쪽
 *   Resend  RESEND_API_KEY
 *
 * 왜 2개인가 (2026-08-21)
 * ----------------------------------------------------------------
 * tag-8.com 의 DNS 는 Cloudflare 가 아니라 eNom(Google Workspace 리셀러)에 있다.
 * eNom 의 Host Records 는 A / AAAA / CNAME / TXT 만 지원하고 **MX 를 만들 수 없다.**
 * Resend 는 Return-Path 용 MX(send.tag-8.com)를 필수로 요구하므로 인증이 불가능했다.
 *
 * → TXT/CNAME 만으로 도메인 인증이 끝나는 발송사(Brevo)로 우회한다.
 * → 나중에 DNS 를 Cloudflare 로 이전하면 RESEND_API_KEY 만 넣어 되돌릴 수 있다.
 *   그때 BREVO_API_KEY 를 지우면 자동으로 Resend 로 전환된다.
 *
 * 필요한 환경변수 (Cloudflare Pages → Settings → Environment variables)
 *   BREVO_API_KEY    Brevo 의 API 키              (또는 RESEND_API_KEY)
 *   MAIL_TO          통지 수신 주소               기본값 info@tag-8.com
 *   MAIL_FROM        발신 주소(도메인 인증 필요)   기본값 TAG EIGHT <no-reply@tag-8.com>
 *
 * ⚠ MAIL_FROM 의 도메인은 발송사에서 DNS 인증을 마쳐야 한다.
 *   인증 전에는 발송이 거부된다.
 */

interface Env {
  BREVO_API_KEY?: string;
  RESEND_API_KEY?: string;
  MAIL_TO?: string;
  MAIL_FROM?: string;
}

/** 발송사에 넘기기 전의 공통 형태 */
interface Mail {
  fromName: string;
  fromEmail: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}

type Lang = 'ja' | 'ko' | 'zh-TW';

const LIMITS = { company: 120, name: 80, email: 160, subject: 120, message: 4000 };

/** 자동응답 문면. 사이트와 같은 3개 언어 */
const REPLY: Record<Lang, { subject: string; greet: (n: string) => string; body: string[]; sign: string[] }> = {
  ja: {
    subject: 'お問い合わせありがとうございます｜TAG EIGHT',
    greet: (n) => `${n} 様`,
    body: [
      'このたびは TAG EIGHT へお問い合わせいただき、誠にありがとうございます。',
      '以下の内容で承りました。担当者より2営業日以内にご連絡いたします。',
      '※ 本メールは自動送信です。ご返信いただいてもお受けできません。',
    ],
    sign: ['TAG EIGHT合同会社', '〒102-0083 東京都千代田区麹町1-6-30 VORT半蔵門PLUS 13階', 'TEL 03-6272-6190 / https://tag-8.com'],
  },
  ko: {
    subject: '문의해 주셔서 감사합니다｜TAG EIGHT',
    greet: (n) => `${n} 님`,
    body: [
      'TAG EIGHT에 문의해 주셔서 감사합니다.',
      '아래 내용으로 접수되었습니다. 담당자가 2영업일 이내에 연락드리겠습니다.',
      '※ 본 메일은 자동 발송입니다. 회신은 받지 않습니다.',
    ],
    sign: ['TAG EIGHT合同会社', '〒102-0083 도쿄도 지요다구 고지마치 1-6-30 VORT半蔵門PLUS 13층', 'TEL 03-6272-6190 / https://tag-8.com'],
  },
  'zh-TW': {
    subject: '感謝您的來信｜TAG EIGHT',
    greet: (n) => `${n} 先生／女士`,
    body: [
      '感謝您與 TAG EIGHT 聯繫。',
      '我們已收到以下內容，將由專人於兩個工作天內與您聯繫。',
      '※ 本信件為系統自動發送，恕不受理回覆。',
    ],
    sign: ['TAG EIGHT合同会社', '〒102-0083 東京都千代田區麹町1-6-30 VORT半蔵門PLUS 13樓', 'TEL 03-6272-6190 / https://tag-8.com'],
  },
};

const FIELD: Record<Lang, Record<string, string>> = {
  ja: { company: '会社名・団体名', name: 'お名前', email: 'メールアドレス', subject: 'ご相談内容', message: 'メッセージ' },
  ko: { company: '회사명·단체명', name: '성함', email: '이메일', subject: '문의 유형', message: '메시지' },
  'zh-TW': { company: '公司／團體名稱', name: '姓名', email: '電子郵件', subject: '諮詢類型', message: '訊息' },
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** 헤더 인젝션 방지 — 개행이 들어간 값은 잘라낸다 */
const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

const pickLang = (v: string): Lang =>
  v === 'ko' ? 'ko' : v === 'zh-TW' || v === 'zh-Hant' ? 'zh-TW' : 'ja';

/**
 * "TAG EIGHT <no-reply@tag-8.com>" → { name, email }
 * Brevo 는 이름과 주소를 분리해서 받는다. 꺾쇠가 없으면 전체를 주소로 본다.
 */
function parseFrom(v: string): { name: string; email: string } {
  const m = v.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { name: m[1] || 'TAG EIGHT', email: m[2].trim() } : { name: 'TAG EIGHT', email: v.trim() };
}

async function sendViaBrevo(key: string, m: Mail) {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: m.fromName, email: m.fromEmail },
      to: [{ email: m.to }],
      replyTo: { email: m.replyTo },
      subject: m.subject,
      htmlContent: m.html,
    }),
  });
  if (!r.ok) throw new Error(`brevo ${r.status}: ${await r.text()}`);
}

async function sendViaResend(key: string, m: Mail) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${m.fromName} <${m.fromEmail}>`,
      to: [m.to],
      reply_to: m.replyTo,
      subject: m.subject,
      html: m.html,
    }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}: ${await r.text()}`);
}

/** 키가 들어 있는 쪽으로 보낸다. Brevo 우선. */
function makeSender(env: Env): (m: Mail) => Promise<void> {
  if (env.BREVO_API_KEY) return (m) => sendViaBrevo(env.BREVO_API_KEY!, m);
  if (env.RESEND_API_KEY) return (m) => sendViaResend(env.RESEND_API_KEY!, m);
  throw new Error('BREVO_API_KEY / RESEND_API_KEY 둘 다 미설정');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const back = (path: string) => Response.redirect(new URL(path, request.url).toString(), 303);

  try {
    const form = await request.formData();

    // 봇 트랩. 사람에게는 보이지 않는 항목이라 값이 있으면 봇이다.
    // 봇에게는 성공한 것처럼 보여주고 실제로는 보내지 않는다.
    if (clean(form.get('_gotcha'), 50)) return back('/contact/thanks/');

    const lang = pickLang(clean(form.get('_lang'), 10));
    const company = clean(form.get('company'), LIMITS.company);
    const name = clean(form.get('name'), LIMITS.name);
    const email = clean(form.get('email'), LIMITS.email);
    const subject = clean(form.get('subject'), LIMITS.subject);
    const message = String(form.get('message') ?? '').trim().slice(0, LIMITS.message);

    if (!company || !name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return back('/contact/?e=1');

    const send = makeSender(env);
    const to = env.MAIL_TO || 'info@tag-8.com';
    const { name: fromName, email: fromEmail } = parseFrom(env.MAIL_FROM || 'TAG EIGHT <no-reply@tag-8.com>');

    const L = FIELD[lang];
    const rows = [
      [L.company, company],
      [L.name, name],
      [L.email, email],
      [L.subject, subject || '—'],
      [L.message, message || '—'],
    ];
    const table = rows
      .map(
        ([k, v]) =>
          `<tr><th align="left" style="padding:8px 16px 8px 0;vertical-align:top;color:#6b6b6a;font-weight:400;white-space:nowrap">${esc(
            k
          )}</th><td style="padding:8px 0;color:#0b0b0a">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('');

    // ① 담당자 통지 — 답장하면 문의자에게 바로 가도록 reply_to 지정
    await send({
      fromName,
      fromEmail,
      to,
      replyTo: email,
      subject: `【サイト問い合わせ】${company} / ${name}`,
      html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.8"><table>${table}</table>
        <p style="margin-top:24px;color:#adadad;font-size:12px">lang: ${lang} / ${new Date().toISOString()}</p></div>`,
    });

    // ② 자동응답
    const R = REPLY[lang];
    await send({
      fromName,
      fromEmail,
      to: email,
      replyTo: to,
      subject: R.subject,
      html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.9;color:#333">
        <p>${esc(R.greet(name))}</p>
        ${R.body.map((p) => `<p>${esc(p)}</p>`).join('')}
        <table style="margin:24px 0;border-top:1px solid #e6e6e6;padding-top:16px">${table}</table>
        <p style="color:#6b6b6a;font-size:12px;line-height:1.8;border-top:1px solid #e6e6e6;padding-top:16px">
          ${R.sign.map(esc).join('<br>')}
        </p></div>`,
    });

    return back('/contact/thanks/');
  } catch (err) {
    console.error('[contact]', err);
    return back('/contact/?e=2');
  }
};

/** POST 외에는 받지 않는다 */
export const onRequest: PagesFunction<Env> = async ({ request, next }) =>
  request.method === 'POST' ? next() : new Response('Method Not Allowed', { status: 405 });
