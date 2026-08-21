/**
 * TAG EIGHT 문의 폼 — 메일 발송기 (Google Apps Script)
 * ================================================================
 * 이 파일은 사이트에 배포되지 않는다. script.google.com 에 붙여넣어 쓰는 원본이다.
 * 여기 두는 이유: 나중에 누가 봐도 "이런 부품이 있다" 를 알 수 있게 하기 위함.
 *
 * 하는 일
 *   Cloudflare Function 이 HTTPS 로 호출하면, Gmail 로 메일 1통을 보낸다.
 *   발신자는 이 스크립트를 배포한 Google 계정이 된다(= info@tag-8.com).
 *
 * 왜 이 방식인가
 *   tag-8.com 의 DNS 가 eNom 에 있어 MX 를 만들 수 없다.
 *   외부 발송사(Resend·Brevo)는 도메인 인증에 DNS 를 요구한다.
 *   이미 쓰고 있는 Workspace 로 보내면 DNS 작업이 0 이 된다.
 *
 * ────────────────────────────────────────────────────────────────
 * 설정 절차 (자세한 내용은 CONTACT_SETUP.md)
 * ────────────────────────────────────────────────────────────────
 *  1. info@tag-8.com 으로 로그인한 상태에서 https://script.google.com/home 접속
 *  2. 새 프로젝트 → 이름 "TAG EIGHT Contact Mailer"
 *  3. 기본 코드를 전부 지우고 이 파일 내용을 붙여넣는다
 *  4. 아래 TOKEN 을 길고 무작위한 문자열로 바꾼다 (같은 값을 Cloudflare 에도 넣는다)
 *  5. 배포 → 새 배포 → 유형 "웹 앱"
 *       실행 사용자        : 나 (info@tag-8.com)
 *       액세스 권한이 있는 사용자 : 모든 사용자        ← 반드시 이것
 *  6. 처음 배포 시 권한 승인 화면이 뜬다
 *       "고급" → "TAG EIGHT Contact Mailer(안전하지 않음)으로 이동" → 허용
 *       ※ 본인이 만든 스크립트라 정상이다
 *  7. 발급된 웹앱 URL(.../exec)을 복사 → Cloudflare 환경변수 GAS_URL 에 넣는다
 *
 * ⚠ 코드를 고친 뒤에는 "배포 관리 → 편집(연필) → 버전: 새 버전 → 배포" 를 해야
 *   반영된다. 저장만 해서는 웹앱이 갱신되지 않는다.
 */

// ⚠ 반드시 바꿀 것. Cloudflare 의 GAS_TOKEN 과 같은 값이어야 한다.
//   아무나 이 URL 로 메일을 보내지 못하게 막는 유일한 장치다.
const TOKEN = 'CHANGE_ME_긴무작위문자열로바꿀것';

/** 하루 발송 상한 경보용. Workspace 는 1,500통/일. */
const DAILY_WARN = 1000;

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'no body' });
    }

    const p = JSON.parse(e.postData.contents);

    // 토큰 대조. 길이가 달라도 즉시 실패시키지 않고 전체를 비교한다.
    if (!p.token || p.token !== TOKEN) {
      return json({ ok: false, error: 'bad token' });
    }

    // 필수값
    const to = String(p.to || '').trim();
    const subject = String(p.subject || '').trim();
    const html = String(p.html || '');
    if (!to || !subject || !html) {
      return json({ ok: false, error: 'missing to/subject/html' });
    }

    // 남은 할당량 확인. 0 이면 보내지 말고 명확히 실패시킨다.
    const left = MailApp.getRemainingDailyQuota();
    if (left <= 0) {
      return json({ ok: false, error: 'daily quota exhausted' });
    }
    if (left < DAILY_WARN) {
      console.warn('[contact] 남은 발송 할당량이 적다: ' + left);
    }

    GmailApp.sendEmail(to, subject, htmlToText(html), {
      htmlBody: html,
      name: String(p.fromName || 'TAG EIGHT'),
      replyTo: String(p.replyTo || to),
    });

    return json({ ok: true });
  } catch (err) {
    console.error('[contact] ' + err);
    return json({ ok: false, error: String(err) });
  }
}

/**
 * GET 은 받지 않는다.
 * 브라우저로 URL 을 열었을 때 이 JSON 이 보이면 배포가 정상이라는 뜻이다.
 * 로그인 화면이 뜨면 "액세스 권한이 있는 사용자" 가 "모든 사용자" 가 아니다.
 */
function doGet() {
  return json({ ok: false, error: 'POST only' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** HTML 을 읽을 수 있는 평문으로. 텍스트 메일 클라이언트 대응. */
function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|h[1-6])>/gi, '\n')
    .replace(/<th[^>]*>/gi, '')
    .replace(/<\/th>/gi, ': ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * 설정 확인용. 에디터에서 이 함수를 직접 실행하면
 * info@tag-8.com 으로 테스트 메일이 1통 온다.
 * 배포 전에 권한 승인을 미리 끝내는 용도로도 쓴다.
 */
function testSend() {
  GmailApp.sendEmail('info@tag-8.com', '[테스트] TAG EIGHT Contact Mailer', '평문 본문', {
    htmlBody: '<p>정상 동작합니다.</p><p>남은 할당량: ' + MailApp.getRemainingDailyQuota() + '</p>',
    name: 'TAG EIGHT',
  });
}
