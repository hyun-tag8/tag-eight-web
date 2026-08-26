// 3개 언어 카피 사전.
// ja가 기준(2026 Company Profile 원문). ko/zh-TW는 직역이 아니라 문맥 번역.
// 새 문장을 추가할 때는 반드시 3개 언어를 함께 채울 것 — 빠지면 빌드 시 타입 에러가 난다.

export const LANGS = ['ja', 'ko', 'zh-tw'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'ja';

/** ja는 접두사 없이 루트(/), 나머지는 /ko, /zh-tw */
export const langMeta: Record<Lang, { label: string; htmlLang: string; prefix: string }> = {
  ja: { label: '日本語', htmlLang: 'ja', prefix: '' },
  ko: { label: '한국어', htmlLang: 'ko', prefix: '/ko' },
  'zh-tw': { label: '繁體中文', htmlLang: 'zh-Hant-TW', prefix: '/zh-tw' },
};

/** 언어 접두사를 붙인 경로를 만든다. path는 항상 '/'로 시작. */
export function localePath(lang: Lang, path: string): string {
  const p = path === '/' ? '' : path;
  return `${langMeta[lang].prefix}${p}` || '/';
}

type Dict = {
  siteTitle: string;
  tagline: string;
  nav: { about: string; service: string; works: string; insight: string; company: string; contact: string };
  meta: Record<'home' | 'about' | 'service' | 'works' | 'insight' | 'company' | 'contact', { title: string; description: string }>;
  hero: { catch: string[]; sub: string; body: string; lead: string[]; statement: string[]; scroll: string };
  philosophy: {
    eyebrow: string;
    /** 인물 비주얼 AI 생성 표기. 한국 AI기본법(2026-01-22 시행) 대응 겸 신뢰 확보 */
    aiNote: string;
    vision: { label: string; head: string; en: string; body: string };
    mission: { label: string; head: string; en: string; body: string };
    values: { label: string; head: string; en: string; body: string };
  };
  /** 공통 UI 문구 */
  common: { viewMore: string };
  whatWeDo: {
    eyebrow: string;
    head: string[];
    headHome: string;
    sub: string;
    body: string;
    /** itemsHome — 홈은 요약이라 3개로 줄인다(CAPABILITIES 는 4개) */
    blocks: { no: string; title: string; ja: string; lead: string; items: string[]; itemsHome: string[] }[];
  };
  /** 대표 메시지. MISSION 이 「회사가 어디에 서는가」라면 이쪽은 「왜 내가 시작했는가」 — 1인칭 */
  message: {
    eyebrow: string;
    /** 팝업 제목. 굵고 크게, 손글씨체 */
    title: string;
    /** 연(stanza) 단위. 안쪽 배열 한 줄이 화면 한 줄 — 원고의 줄바꿈을 그대로 지킨다 */
    /** 편지의 단락. kind 로 강약을 지정한다 — 인덱스에 의존하면 언어별로 어긋난다 */
    stanzas: { kind?: 'believe'; lines: string[] }[];
    /** 서명은 한 줄로 붙인다 */
    signLine: string;
  };
  team: {
    eyebrow: string; head: string; sub: string;
    members: {
      /** 파일 키. /img/member-{key}.webp 를 참조한다 */
      key: string;
      name: string; role: string;
      /** 표시용 거점 라벨. KOREA / JAPAN / TAIWAN */
      base: string;
      /** 명함 뒷면 색. # 마크·선택 바에 쓰는 원색 */
      color: string;
      /** 직함 텍스트용. 흰 배경 대비 4.5:1 이상을 만족하는 변형 */
      ink: string;
      /** 색 이름 표기 (임시 가색이면 그대로 드러낸다) */
      colorName: string;
      bio: string;
    }[];
  };
  companySec: {
    eyebrow: string;
    head: string;
    labels: Record<
      'name' | 'founded' | 'ceo' | 'capital' | 'fiscal' | 'employees' | 'address' | 'tel' | 'url' | 'corpNo' | 'invoiceNo' | 'business',
      string
    >;
    business: string[];
  };
  statement: { body: string; facts: { n: string; label: string }[] };
  sectors: { eyebrow: string; head: string; sub: string; note: string; items: { no: string; ja: string; en: string; body: string }[] };
  works: { eyebrow: string; head: string; sub: string; empty: string; confidential: string; challengeLabel: string; approachLabel: string; designLabel: string; rolloutLabel: string; essenceLabel: string; routeLines: Record<string, string>; requestHead: string; requestBody: string; requestCta: string; backToList: string };
  journal: { eyebrow: string; head: string; sub: string; empty: string; readMore: string; backToList: string };
  /** WHY TAG EIGHT — 사명의 유래. ABOUT 의 클로징 */
  why: { eyebrow: string; lines: string[][] };
  contact: {
    eyebrow: string; kicker: string; head: string[]; sub: string; cta: string;
    directLabel: string; formLabel: string;
    f: {
      company: string; name: string; email: string; subject: string;
      message: string; submit: string; required: string; note: string;
      subjects: string[];
      /** 전송 실패 안내 */
      errInput: string; errServer: string;
      consent: string; consentLink: string; mapLink: string;
      /** 送信完了ページ */
      thanksHead: string; thanksBody: string; thanksBack: string;
    };
  };
  privacy: {
    eyebrow: string; head: string; intro: string; revised: string;
    metaTitle: string; metaDesc: string;
    sections: { h: string; body: string[]; list?: string[] }[];
  };
  footer: { rights: string; langLabel: string };
};

export const t: Record<Lang, Dict> = {
  ja: {
    siteTitle: 'TAG EIGHT',
    tagline: '韓国・日本・台湾をつなぐクリエイティブエージェンシー',
    nav: { about: 'ABOUT', service: 'CAPABILITIES', works: 'WORKS', insight: 'INSIGHT', company: 'COMPANY', contact: 'CONTACT' },
    meta: {
      home: {
        title: 'TAG EIGHT｜韓国・日本・台湾をつなぐクリエイティブエージェンシー',
        description:
          'TAG EIGHT合同会社は、韓国・日本・台湾の3市場をつなぐクリエイティブエージェンシーです。市場分析からクリエイティブ制作、クリエイターマーケティング、キャンペーン実行までを一気通貫で設計します。',
      },
      about: {
        title: 'ABOUT｜TAG EIGHT',
        description: 'TAG EIGHTのビジョン・ミッション・バリュー、および会社概要。東京・麹町を拠点に、韓国・日本・台湾の3市場で事業を行っています。',
      },
      service: {
        title: 'CAPABILITIES｜TAG EIGHT',
        description: 'THINK / CREATE / ACTIVATE の3領域。市場分析、コミュニケーションプランニング、クリエイティブ制作、クリエイターマーケティング、SNS・デジタル広告運用、PR・イベントまで。',
      },
      works: { title: 'WORKS｜TAG EIGHT', description: '韓国・日本・台湾の3市場で手がけたマーケティング・クリエイティブの事例。' },
      insight: { title: 'INSIGHT｜TAG EIGHT', description: '韓国・台湾市場の生活者インサイト、検索行動、クリエイターマーケティングに関する視点。' },
      company: { title: 'COMPANY｜TAG EIGHT', description: '代表メッセージ、メンバー、会社概要。TAG EIGHT合同会社について。' },
      contact: { title: 'CONTACT｜TAG EIGHT', description: 'TAG EIGHTへのお問い合わせ。直接受託、代理店・制作会社様経由、どちらの座組にも対応します。' },
    },
    hero: {
      catch: ['Asia Business Connected', 'Creative Agency'],
      sub: '韓国・日本・台湾の3市場をつなぐ',
      body: 'TAG EIGHTは、韓国・日本・台湾の3市場で\nその瞬間をデザインする\nCreative Agency です。',
      lead: ['国境を越えて、', '人を動かすものは、ただひとつ。'],
      statement: ['心が動く、その瞬間。', 'TAG EIGHTは、その瞬間をデザインする。'],
      scroll: 'SCROLL',
    },
    philosophy: {
      eyebrow: 'VISION',
      aiNote: '※ 本ページのイメージビジュアルはAIで生成しています。',
      vision: {
        label: 'VISION',
        head: '心が動くたびに、アジアはもっと近くなる。',
        en: 'With every heart moved, Asia grows closer.',
        body: '国や言葉が違っても、人の心が動く理由は変わらない。',
      },
      mission: {
        label: 'MISSION',
        head: 'そのあいだに、立つ。',
        en: 'Standing in between.',
        body: '国と国、ブランドと人。想いが伝わる瞬間をつくり、それを確かな影響力と、成長へ変えていく。',
      },
      values: {
        label: 'VALUES',
        head: '「多様性」・「共感」・「感動」',
        en: 'Diversity, Empathy, Emotion.',
        body: '違いから、共感へ。共感から、感動へ。',
      },
    },
    common: { viewMore: 'VIEW MORE' },
    whatWeDo: {
      eyebrow: 'CAPABILITIES',
      head: ['文化の違いを、選ばれる理由に変える。'],
      headHome: '考える。つくる。届ける。',
      sub: 'ブランド戦略から、コンテンツ制作、プロモーション実行まで。\n必要な領域だけでも、すべて一緒でも。',
      body: '韓国・日本・台湾。ブランドの想いと、その市場で暮らす人の感覚。その「間」に立ち、\n戦略からクリエイティブ、実行までをつくります。',
      blocks: [
        {
          no: '01',
          title: 'WE THINK',
          ja: 'ブランド戦略・現地最適化',
          lead: '違いを読み、選ばれる理由と進むべき方向を見つける。',
          items: ['市場・生活者分析', 'ブランド戦略・ポジショニング', 'コミュニケーション戦略', 'ローカライズ'],
          itemsHome: ['市場・生活者分析', 'ブランド・コミュニケーション戦略', 'ローカライズ'],
        },
        {
          no: '02',
          title: 'WE CREATE',
          ja: 'クリエイティブ開発・コンテンツ制作',
          lead: '選ばれる理由を、言葉・デザイン・コンテンツとして形にする。',
          items: ['クリエイティブディレクション', 'ブランドアイデンティティ', 'コピー・デザイン・映像制作', 'コンテンツ企画・制作'],
          itemsHome: ['クリエイティブディレクション', 'ブランドアイデンティティ', 'コンテンツ企画・制作'],
        },
        {
          no: '03',
          title: 'WE ACTIVATE',
          ja: 'プロモーション実行・メディア運用',
          lead: 'アイデアを市場に届け、人の反応を次の動きにつなげる。',
          items: ['クリエイター・インフルエンサーマーケティング', 'メディアリレーション・PR', 'キャンペーン・イベント実行', 'SNS・デジタル広告運用・検証'],
          itemsHome: ['クリエイター・メディアリレーション', 'キャンペーン・イベント実行', 'SNS・デジタル広告運用'],
        },
      ],
    },
    message: {
      eyebrow: 'CEO MESSAGE',
      title: '「違う」は、おもしろい。',
      stanzas: [
        { lines: ['韓国、日本、台湾。', '近いけれど、同じではない。'] },
        { lines: ['私たちは、三つの文化の「間」で', '仕事をしてきました。'] },
        { lines: ['違いをよく見て、', 'そこから、選ばれる理由を見つける。'] },
        { lines: ['その理由を、アイデアに。', 'アイデアを、人の心が動くきっかけに。'] },
        { lines: ['そして、そのきっかけを', 'クライアントの次の成長につなげていく。'] },
        { lines: ['三つの文化の間には、', 'まだ、おもしろいことがたくさんある。'] },
        { lines: ['その「おもしろい」がひとつ見つかるたび、', 'アジアは、少しだけ近くなる。'] },
        { kind: 'believe', lines: ['私たちは、そう信じています。'] },
      ],
      signLine: 'TAG EIGHT合同会社　代表　李 東眩',
    },
    why: {
      eyebrow: 'WHY TAG EIGHT',
      lines: [
        ['つなぐ「#」と、無限の「∞」。', 'TAG EIGHTは、この二つの記号から生まれました。'],
        ['違いをつなぎ、', 'まだ見えていない可能性を見つける。', 'その意志を、名前に込めています。'],
      ],
    },
    team: {
      eyebrow: 'PEOPLE',
      head: '国境を越えるのは、まず私たち自身。',
      sub: '韓国・日本・台湾をつなぐメンバー',
      members: [
        { key: 'kr', name: 'DONGHYUN LEE', role: 'Creative Director & CEO', base: 'KOREA', color: '#F37021', ink: '#B54A15', colorName: 'Hermès Orange', bio: '2004年に来日して、韓国人としてずっと外から日本を見てきました。価値観の違うふたつの間で、伝わる形を探す。相手が地球規模になっても、飽きません。' },
        { key: 'yj', name: 'YONGJUN PARK', role: 'Content Producer', base: 'KOREA', color: '#3F8F63', ink: '#2F6E4A', colorName: 'Green', bio: '20年、韓国の読者に向けて日本のことを書いてきました。ブログで、ガイドブックで、いまは企画で。観光地より、その土地の暮らしのほうが響く。面白いと思ったら、頭より先に手が動きます。' },
        { key: 'jh', name: 'JEEHYUN YONG', role: 'Media & Social Producer', base: 'KOREA', color: '#2E6FB7', ink: '#245A96', colorName: 'Blue', bio: '韓国の放送局でディレクターをしていました。日本で10年、いまは日本と韓国、その「間」で。テレビもSNSも動き方が違う。話題がどこをどう通るのかを見てから、方法を考えます。' },
        { key: 'hl', name: 'HESTER LIN', role: 'Creative Producer', base: 'TAIWAN', color: '#C0417A', ink: '#9B3060', colorName: 'Magenta', bio: '台湾と日本で13年。いまは台湾・韓国・日本、その三つの「間」で。私自身も、インフルエンサーです。ブランドが伝えたいことと、フォロワーが知りたいこと。その両方の声が聞こえる場所にいます。' },
        { key: 'sa', name: 'SHISEI AOKI', role: 'Strategy Producer', base: 'JAPAN', color: '#6B7043', ink: '#4E5230', colorName: 'Deep Khaki', bio: 'ECの現場から、日本の自治体へ。訪日事業とMICEを統括してきました。人がどこから来て、どこで立ち止まり、何を選ぶのか。企画のスタートは、いつも事実からです。' },
      ],
    },
    companySec: {
      eyebrow: 'COMPANY',
      head: '会社概要',
      labels: {
        name: '商号',
        founded: '設立',
        ceo: '代表者',
        capital: '資本金',
        fiscal: '決算期',
        employees: '従業員数',
        address: '所在地',
        tel: 'TEL',
        url: 'URL',
        corpNo: '法人番号',
        invoiceNo: '登録番号',
        business: '事業内容',
      },
      business: [
        'ブランド戦略・現地最適化',
        'クリエイティブ開発・コンテンツ制作',
        'プロモーション実行・メディア運用',
        '訪日インバウンドプロモーション事業',
      ],
    },
    statement: {
      body: '国境や言語が違っても、人の心を動かす本質は変わらない。私たちは韓国・日本・台湾の3市場で、市場の文化と生活者の感情を読み解き、ブランドの想いを「届くかたち」へ変えていきます。',
      facts: [
        { n: '3', label: '市場' },
        { n: '2019', label: '設立' },
        { n: '5', label: 'メンバー' },
        { n: '6', label: '領域' },
      ],
    },
    sectors: {
      eyebrow: 'CLIENTS',
      head: '国と、地域と、ブランドと。',
      sub: '行政・自治体からナショナルブランドまで、3市場でご一緒してきた領域です。',
      note: '※ 守秘義務により、企業名・団体名の記載は控えております。ご相談時に、可能な範囲で個別にご紹介いたします。',
      items: [
        { no: '01', ja: '官公庁・自治体', en: 'Government & Municipality', body: '訪日プロモーション / 地域ブランディング / 海外市場向けの情報発信・効果検証' },
        { no: '02', ja: '観光・宿泊', en: 'Tourism & Hospitality', body: '施設・エリアの集客設計 / OTA連携 / 旅マエから旅ナカまでの導線構築' },
        { no: '03', ja: '航空・交通', en: 'Aviation & Transport', body: '路線・サービスの認知拡大 / 交通パスの利用促進・検索導線最適化' },
        { no: '04', ja: '食品・菓子', en: 'Food & Confectionery', body: '新商品・周年キャンペーン / 参加型コンテンツによるUGC設計' },
        { no: '05', ja: '化粧品・ヘルスケア', en: 'Beauty & Healthcare', body: '検索認知の獲得・ブランド文脈の再構築 / クリエイター施策と店頭販売促進' },
        { no: '06', ja: '文化・エンタメ', en: 'Culture & Entertainment', body: '映画祭・コンテンツの海外展開 / メディアリレーション / PR配信' },
      ],
    },
    works: {
      eyebrow: 'WORKS',
      head: '課題の立て方を変えると、答えが変わる。',
      sub: '韓国・日本・台湾の3市場で、何を課題と捉え、どう組み直したか。',
      empty: '事例は準備中です。ご相談時に、可能な範囲で個別にご紹介いたします。',
      confidential: '※ 一部案件については守秘義務により、企業名・団体名の記載を控えております。',
      challengeLabel: '課題',
      approachLabel: '解決策',
      designLabel: '設計',
      rolloutLabel: '展開',
      essenceLabel: '本質',
      routeLines: {
        'jp-kr': '把日本，帶給韓國的消費者。',
        'tw-kr': '把台灣，帶給韓國的消費者。',
        'jp-tw': '把日本，帶給台灣的消費者。',
      },
      // 「日本 → 韓国」은 내부 표기다. 케이스 머리에서는 무엇을 어디로 옮겼는지 문장으로 읽힌다.
      // ⚠️ 언어별로 단어가 다르다. ja 만 「生活者」, ko·zh-TW 는 「소비자 / 消費者」.
      //    ja 는 덱·사이트 전체가 生活者 로 통일돼 있고(WHAT WE DO 「生活者の感情」 등),
      //    한국어 「생활자」와 중국어 「生活者」는 일상어가 아니라 번역투로 읽힌다.
      routeLines: {
        'jp-kr': '日本を、韓国の生活者へ。',
        'tw-kr': '台湾を、韓国の生活者へ。',
        'jp-tw': '日本を、台湾の生活者へ。',
      },
      requestHead: '詳細事例をPDFでお送りします。',
      requestBody: '実施内容、成果数値、クリエイティブを含む詳細版をご用意しています。お問い合わせいただいた方に個別にお送りします。',
      requestCta: '資料をリクエストする',
      backToList: '事例一覧へ',
    },
    journal: {
      eyebrow: 'INSIGHT',
      readMore: '続きを読む',
      backToList: '記事一覧へ',
      head: '市場を読む、私たちの視点。',
      sub: '韓国・台湾の生活者インサイト、検索行動、クリエイターマーケティングについて。',
      empty: '記事は準備中です。',
    },
    contact: {
      eyebrow: 'CONTACT',
      kicker: 'まだ、選ばれる理由がない。',
      head: ['そこから始めるのが、私たちの仕事です。'],
      sub: 'その理由を、一緒につくりませんか。\n直接のご依頼にも、代理店・制作会社様を通したご相談にも対応します。',
      cta: 'メールで問い合わせる',
      directLabel: '直接のご連絡',
      formLabel: 'お問い合わせ',
      f: {
        company: '会社名・団体名',
        name: 'ご担当者名',
        email: 'メールアドレス',
        subject: 'ご用件',
        message: 'ご相談内容',
        submit: '送信する',
        required: '必須',
        note: 'ご記入内容は、お問い合わせ対応にのみ使用します。',
        subjects: ['韓国のご相談', '台湾のご相談', '日本のご相談', '採用について', 'その他'],
      errInput: '入力内容をご確認ください。',
      errServer: '送信に失敗しました。お手数ですが info@tag-8.com へ直接ご連絡ください。',
      consent: 'に同意のうえ送信します。',
      consentLink: 'プライバシーポリシー',
      mapLink: 'Google マップで見る',
      thanksHead: 'お問い合わせを承りました。',
      thanksBody: '確認のメールをお送りしました。担当者より2営業日以内にご連絡いたします。',
      thanksBack: 'ホームへ戻る',
      },
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      head: 'プライバシーポリシー',
      intro: 'TAG EIGHT合同会社（以下「当社」）は、個人情報の保護に関する法律その他の関係法令を遵守し、お客様の個人情報を適切に取り扱います。',
      revised: '制定日：2026年8月17日',
      metaTitle: 'プライバシーポリシー｜TAG EIGHT',
      metaDesc: 'TAG EIGHT合同会社の個人情報の取り扱いについて。',
      sections: [
        { h: '取得する情報', body: ['当社は、お問い合わせフォームを通じて以下の情報を取得します。'],
          list: ['会社名・団体名', 'お名前', 'メールアドレス', 'ご相談内容・メッセージ本文'] },
        { h: '利用目的', body: ['取得した個人情報は、次の目的の範囲内で利用します。'],
          list: ['お問い合わせへの回答およびご連絡', 'サービスのご提案・お打ち合わせの調整', '契約の締結および履行'] },
        { h: '第三者提供', body: ['当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。'] },
        { h: '外国にある第三者への提供', body: [
            'お問い合わせフォームから送信された情報は、メールの送受信のため、米国に所在する事業者のサーバーを経由します。',
            '当社は、送信の目的の範囲内でのみ当該事業者を利用し、それ以外の目的で情報を提供することはありません。',
            '各事業者のプライバシーポリシーは、それぞれの公式サイトでご確認いただけます。'],
          list: ['メール配信：Google Workspace（米国）', 'ホスティング：Cloudflare（米国）'] },
        { h: '安全管理', body: ['当社は、個人情報の漏えい、滅失または毀損の防止その他の安全管理のために、必要かつ適切な措置を講じます。'] },
        { h: '保有期間', body: ['お問い合わせに関する個人情報は、対応の完了後、必要な期間を経過した時点で速やかに削除します。'] },
        { h: 'アクセス解析', body: ['当社サイトでは、閲覧状況を把握するための解析ツールを利用する場合があります。取得する情報に個人を特定するものは含まれません。'] },
        { h: '開示・訂正・削除', body: ['ご本人からの個人情報の開示、訂正、利用停止または削除のご請求については、下記の窓口へご連絡ください。ご本人であることを確認のうえ、速やかに対応いたします。'] },
        { h: '本ポリシーの変更', body: ['当社は、法令の改正や事業内容の変更に応じて本ポリシーを改定することがあります。改定後の内容は本ページに掲載した時点から適用されます。'] },
        { h: 'お問い合わせ窓口', body: ['個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。'] },
      ],
    },
    footer: { rights: 'All rights reserved.', langLabel: 'LANGUAGE' },
  },

  ko: {
    siteTitle: 'TAG EIGHT',
    tagline: '한국·일본·대만을 잇는 크리에이티브 에이전시',
    nav: { about: 'ABOUT', service: 'CAPABILITIES', works: 'WORKS', insight: 'INSIGHT', company: 'COMPANY', contact: 'CONTACT' },
    meta: {
      home: {
        title: 'TAG EIGHT｜한국·일본·대만을 잇는 크리에이티브 에이전시',
        description:
          'TAG EIGHT는 한국·일본·대만 3개 시장을 잇는 크리에이티브 에이전시입니다. 시장 분석부터 크리에이티브 제작, 크리에이터 마케팅, 캠페인 실행까지 하나의 흐름으로 설계합니다.',
      },
      about: { title: 'ABOUT｜TAG EIGHT', description: 'TAG EIGHT의 비전·미션·밸류와 회사 개요. 도쿄 코지마치를 거점으로 한국·일본·대만 3개 시장에서 사업을 전개합니다.' },
      service: { title: 'CAPABILITIES｜TAG EIGHT', description: 'THINK / CREATE / ACTIVATE 3개 영역. 시장 분석, 커뮤니케이션 플래닝, 크리에이티브 제작, 크리에이터 마케팅, SNS·디지털 광고 운영, PR·이벤트까지.' },
      works: { title: 'WORKS｜TAG EIGHT', description: '한국·일본·대만 3개 시장에서 진행한 마케팅·크리에이티브 사례.' },
      insight: { title: 'INSIGHT｜TAG EIGHT', description: '한국·대만 시장의 소비자 인사이트, 검색 행동, 크리에이터 마케팅에 대한 관점.' },
      company: { title: 'COMPANY｜TAG EIGHT', description: '대표 메시지, 멤버, 회사 개요. TAG EIGHT合同会社에 대하여.' },
      contact: { title: 'CONTACT｜TAG EIGHT', description: 'TAG EIGHT 문의. 직접 수주, 대행사·제작사 경유 어느 쪽 구조에도 대응합니다.' },
    },
    hero: {
      catch: ['Asia Business Connected', 'Creative Agency'],
      sub: '한국·일본·대만 3개 시장을 잇는',
      body: 'TAG EIGHT는 한국·일본·대만 3개 시장에서\n그 순간을 설계하는\nCreative Agency 입니다.',
      lead: ['국경을 넘어,', '사람을 움직이는 건 하나뿐이다.'],
      statement: ['마음이 움직이는, 그 순간.', 'TAG EIGHT는 그 순간을 설계한다.'],
      scroll: 'SCROLL',
    },
    philosophy: {
      eyebrow: 'VISION',
      aiNote: '※ 이 페이지의 이미지 비주얼은 AI로 생성했습니다.',
      vision: {
        label: 'VISION',
        head: '마음이 움직일 때마다, 아시아는 더 가까워진다.',
        en: 'With every heart moved, Asia grows closer.',
        body: '나라도 언어도 달라도, 사람의 마음이 움직이는 이유는 변하지 않는다.',
      },
      mission: {
        label: 'MISSION',
        head: '그 사이에 선다.',
        en: 'Standing in between.',
        body: '나라와 나라, 브랜드와 사람. 마음이 전해지는 순간을 만들고, 그것을 확실한 영향력과 성장으로 바꿔간다.',
      },
      values: {
        label: 'VALUES',
        head: '「다양성」・「공감」・「감동」',
        en: 'Diversity, Empathy, Emotion.',
        body: '다름에서 공감으로. 공감에서 감동으로.',
      },
    },
    common: { viewMore: 'VIEW MORE' },
    whatWeDo: {
      eyebrow: 'CAPABILITIES',
      head: ['문화의 차이를, 선택받는 이유로 바꾼다.'],
      headHome: '생각한다. 만든다. 전한다.',
      sub: '브랜드 전략부터 콘텐츠 제작, 프로모션 실행까지.\n필요한 영역만도, 전부 함께도.',
      body: '한국·일본·대만. 브랜드의 마음과, 그 시장에 사는 사람의 감각. 그 「사이」에 서서,\n전략에서 크리에이티브, 실행까지를 만듭니다.',
      blocks: [
        {
          no: '01',
          title: 'WE THINK',
          ja: '브랜드 전략·현지 최적화',
          lead: '다름을 읽고, 선택받는 이유와 나아갈 방향을 찾는다.',
          items: ['시장·소비자 분석', '브랜드 전략·포지셔닝', '커뮤니케이션 전략', '로컬라이즈'],
          itemsHome: ['시장·소비자 분석', '브랜드·커뮤니케이션 전략', '로컬라이즈'],
        },
        {
          no: '02',
          title: 'WE CREATE',
          ja: '크리에이티브 개발·콘텐츠 제작',
          lead: '선택받는 이유를 말·디자인·콘텐츠로 형태로 만든다.',
          items: ['크리에이티브 디렉션', '브랜드 아이덴티티', '카피·디자인·영상 제작', '콘텐츠 기획·제작'],
          itemsHome: ['크리에이티브 디렉션', '브랜드 아이덴티티', '콘텐츠 기획·제작'],
        },
        {
          no: '03',
          title: 'WE ACTIVATE',
          ja: '프로모션 실행·미디어 운용',
          lead: '아이디어를 시장에 전하고, 사람의 반응을 다음 움직임으로 잇는다.',
          items: ['크리에이터·인플루언서 마케팅', '미디어 릴레이션·PR', '캠페인·이벤트 실행', 'SNS·디지털 광고 운용·검증'],
          itemsHome: ['크리에이터·미디어 릴레이션', '캠페인·이벤트 실행', 'SNS·디지털 광고 운용'],
        },
      ],
    },
    message: {
      eyebrow: 'CEO MESSAGE',
      title: '「다르다」는, 재미있다.',
      stanzas: [
        { lines: ['한국, 일본, 대만.', '가깝지만, 같지는 않다.'] },
        { lines: ['우리는 세 문화의 「사이」에서', '일해왔습니다.'] },
        { lines: ['다름을 잘 들여다보고,', '거기서 선택받는 이유를 찾아낸다.'] },
        { lines: ['그 이유를 아이디어로.', '아이디어를 사람의 마음이 움직이는 계기로.'] },
        { lines: ['그리고 그 계기를', '클라이언트의 다음 성장으로 이어간다.'] },
        { lines: ['세 문화의 사이에는', '아직 재미있는 것이 많이 있다.'] },
        { lines: ['그 「재미있는 것」이 하나 발견될 때마다,', '아시아는 조금 더 가까워진다.'] },
        { kind: 'believe', lines: ['우리는 그렇게 믿습니다.'] },
      ],
      signLine: 'TAG EIGHT合同会社　대표　李 東眩',
    },
    why: {
      eyebrow: 'WHY TAG EIGHT',
      lines: [
        ['잇는 「#」과, 무한의 「∞」.', 'TAG EIGHT는 이 두 기호에서 태어났습니다.'],
        ['다름을 잇고,', '아직 보이지 않는 가능성을 찾아낸다.', '그 의지를 이름에 담고 있습니다.'],
      ],
    },
    team: {
      eyebrow: 'PEOPLE',
      head: '국경을 넘는 건, 우선 우리 자신이다.',
      sub: '한국·일본·대만을 잇는 멤버',
      members: [
        { key: 'kr', name: 'DONGHYUN LEE', role: 'Creative Director & CEO', base: 'KOREA', color: '#F37021', ink: '#B54A15', colorName: 'Hermès Orange', bio: '2004년에 일본에 와서, 한국인으로서 줄곧 밖에서 일본을 봐왔습니다. 가치관이 다른 둘 사이에서 전해지는 형태를 찾는 일. 상대가 지구 규모가 되어도 질리지 않습니다.' },
        { key: 'yj', name: 'YONGJUN PARK', role: 'Content Producer', base: 'KOREA', color: '#3F8F63', ink: '#2F6E4A', colorName: 'Green', bio: '20년간 한국 독자를 향해 일본에 대해 써왔습니다. 블로그로, 가이드북으로, 지금은 기획으로. 관광지보다 그 고장의 삶이 더 통한다. 재미있다 싶으면, 머리보다 손이 먼저 움직입니다.' },
        { key: 'jh', name: 'JEEHYUN YONG', role: 'Media & Social Producer', base: 'KOREA', color: '#2E6FB7', ink: '#245A96', colorName: 'Blue', bio: '한국 방송국에서 디렉터로 일했습니다. 일본에서 10년, 지금은 일본과 한국 그 「사이」에서. TV도 SNS도 움직임이 다릅니다. 화제가 어디를 어떻게 지나는지 보고 나서 방법을 정합니다.' },
        { key: 'hl', name: 'HESTER LIN', role: 'Creative Producer', base: 'TAIWAN', color: '#C0417A', ink: '#9B3060', colorName: 'Magenta', bio: '대만과 일본에서 13년, 지금은 대만·한국·일본 그 셋의 「사이」에서. 저도 인플루언서입니다. 브랜드가 전하고 싶은 것과 팔로워가 알고 싶은 것. 양쪽 목소리가 들리는 자리에 있습니다.' },
        { key: 'sa', name: 'SHISEI AOKI', role: 'Strategy Producer', base: 'JAPAN', color: '#6B7043', ink: '#4E5230', colorName: 'Deep Khaki', bio: 'EC 현장에서 일본 지자체로. 방일 사업과 MICE를 총괄해왔습니다. 사람이 어디서 와서, 어디서 멈추고, 무엇을 고르는가. 기획의 출발은 언제나 사실입니다.' },
      ],
    },
    companySec: {
      eyebrow: 'COMPANY',
      head: '회사 개요',
      labels: {
        name: '상호',
        founded: '설립',
        ceo: '대표자',
        capital: '자본금',
        fiscal: '결산기',
        employees: '임직원 수',
        address: '소재지',
        tel: 'TEL',
        url: 'URL',
        corpNo: '법인번호',
        invoiceNo: '등록번호',
        business: '사업 내용',
      },
      business: ['브랜드 전략·현지 최적화', '크리에이티브 개발·콘텐츠 제작', '프로모션 실행·미디어 운용', '방일 인바운드 프로모션 사업'],
    },
    statement: {
      body: '국경도 언어도 다르지만, 사람의 마음을 움직이는 본질은 달라지지 않는다. 우리는 한국·일본·대만 3개 시장에서 시장의 문화와 소비자의 감정을 읽어내고, 브랜드가 하고 싶은 말을 “닿는 형태”로 바꿉니다.',
      facts: [
        { n: '3', label: '시장' },
        { n: '2019', label: '설립' },
        { n: '5', label: '멤버' },
        { n: '6', label: '영역' },
      ],
    },
    sectors: {
      eyebrow: 'CLIENTS',
      head: '나라와, 지역과, 브랜드와.',
      sub: '행정·지자체부터 내셔널 브랜드까지, 3개 시장에서 함께해온 영역입니다.',
      note: '※ 비밀유지 의무에 따라 기업명·단체명 표기를 생략하고 있습니다. 상담 시 가능한 범위에서 개별적으로 소개드립니다.',
      items: [
        { no: '01', ja: '관공서·지자체', en: 'Government & Municipality', body: '방일 프로모션 / 지역 브랜딩 / 해외 시장 대상 발신·효과 검증' },
        { no: '02', ja: '관광·숙박', en: 'Tourism & Hospitality', body: '시설·지역 집객 설계 / OTA 연계 / 여행 전부터 여행 중까지의 동선 구축' },
        { no: '03', ja: '항공·교통', en: 'Aviation & Transport', body: '노선·서비스 인지 확대 / 교통패스 이용 촉진·검색 동선 최적화' },
        { no: '04', ja: '식품·과자', en: 'Food & Confectionery', body: '신상품·주년 캠페인 / 참여형 콘텐츠를 통한 UGC 설계' },
        { no: '05', ja: '화장품·헬스케어', en: 'Beauty & Healthcare', body: '검색 인지 획득·브랜드 맥락 재구축 / 크리에이터 시책과 매장 판촉' },
        { no: '06', ja: '문화·엔터', en: 'Culture & Entertainment', body: '영화제·콘텐츠 해외 전개 / 미디어 릴레이션 / PR 배포' },
      ],
    },
    works: {
      eyebrow: 'WORKS',
      head: '과제를 다시 세우면, 답이 달라진다.',
      sub: '한국·일본·대만 3개 시장에서 무엇을 과제로 보았고, 어떻게 다시 짰는가.',
      empty: '사례는 준비 중입니다. 상담 시 가능한 범위에서 개별적으로 소개드립니다.',
      confidential: '※ 일부 프로젝트는 비밀유지 의무에 따라 기업명·단체명 표기를 생략하고 있습니다.',
      challengeLabel: '과제',
      approachLabel: '해결책',
      designLabel: '설계',
      rolloutLabel: '전개',
      essenceLabel: '본질',
      routeLines: {
        'jp-kr': '일본을, 한국 소비자에게.',
        'tw-kr': '대만을, 한국 소비자에게.',
        'jp-tw': '일본을, 대만 소비자에게.',
      },
      requestHead: '상세 사례는 PDF로 보내드립니다.',
      requestBody: '실행 내역, 성과 수치, 크리에이티브를 포함한 상세판을 준비해두었습니다. 문의해주신 분께 개별적으로 보내드립니다.',
      requestCta: '자료 요청하기',
      backToList: '사례 목록으로',
    },
    journal: {
      eyebrow: 'INSIGHT',
      readMore: '이어서 읽기',
      backToList: '기사 목록으로',
      head: '시장을 읽는, 우리의 관점.',
      sub: '한국·대만의 소비자 인사이트, 검색 행동, 크리에이터 마케팅에 대하여.',
      empty: '아티클은 준비 중입니다.',
    },
    contact: {
      eyebrow: 'CONTACT',
      kicker: '아직, 선택받을 이유가 없다.',
      head: ['거기서 시작하는 것이, 우리의 일입니다.'],
      sub: '그 이유를 함께 만들지 않겠습니까.\n직접 의뢰도, 대행사·제작사를 통한 상담도 대응합니다.',
      cta: '메일로 문의하기',
      directLabel: '직접 연락',
      formLabel: '문의하기',
      f: {
        company: '회사명·단체명',
        name: '담당자명',
        email: '이메일',
        subject: '용건',
        message: '문의 내용',
        submit: '보내기',
        required: '필수',
        note: '기재하신 내용은 문의 대응에만 사용합니다.',
        subjects: ['한국 관련 상담', '대만 관련 상담', '일본 관련 상담', '채용 문의', '기타'],
      errInput: '입력 내용을 확인해 주세요.',
      errServer: '전송에 실패했습니다. 번거로우시겠지만 info@tag-8.com 으로 직접 연락 주세요.',
      consent: '에 동의하고 전송합니다.',
      consentLink: '개인정보 처리방침',
      mapLink: 'Google 지도에서 보기',
      thanksHead: '문의가 접수되었습니다.',
      thanksBody: '확인 메일을 보내드렸습니다. 담당자가 2영업일 이내에 연락드리겠습니다.',
      thanksBack: '홈으로 돌아가기',
      },
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      head: '개인정보 처리방침',
      intro: 'TAG EIGHT合同会社(이하 「당사」)는 개인정보 보호에 관한 법률 및 관계 법령을 준수하며, 이용자의 개인정보를 적절히 취급합니다.',
      revised: '제정일: 2026년 8월 17일',
      metaTitle: '개인정보 처리방침｜TAG EIGHT',
      metaDesc: 'TAG EIGHT合同会社의 개인정보 취급에 관하여.',
      sections: [
        { h: '수집하는 정보', body: ['당사는 문의 폼을 통해 다음 정보를 수집합니다.'],
          list: ['회사명·단체명', '성함', '이메일 주소', '문의 유형·메시지 본문'] },
        { h: '이용 목적', body: ['수집한 개인정보는 다음 목적의 범위 내에서 이용합니다.'],
          list: ['문의에 대한 답변 및 연락', '서비스 제안 및 미팅 조율', '계약 체결 및 이행'] },
        { h: '제3자 제공', body: ['당사는 법령에 근거한 경우를 제외하고, 본인의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.'] },
        { h: '국외 이전', body: [
            '문의 폼으로 전송된 정보는 메일 송수신을 위해 미국에 소재한 사업자의 서버를 경유합니다.',
            '당사는 전송 목적의 범위 내에서만 해당 사업자를 이용하며, 그 외의 목적으로 정보를 제공하지 않습니다.',
            '각 사업자의 개인정보 처리방침은 각사 공식 사이트에서 확인하실 수 있습니다.'],
          list: ['메일 발송: Google Workspace (미국)', '호스팅: Cloudflare (미국)'] },
        { h: '안전 관리', body: ['당사는 개인정보의 유출, 멸실 또는 훼손 방지 및 기타 안전 관리를 위해 필요하고 적절한 조치를 강구합니다.'] },
        { h: '보유 기간', body: ['문의에 관한 개인정보는 대응 완료 후 필요한 기간이 경과한 시점에 신속히 삭제합니다.'] },
        { h: '접속 분석', body: ['당사 사이트는 열람 상황 파악을 위해 분석 도구를 이용하는 경우가 있습니다. 수집하는 정보에 개인을 특정하는 것은 포함되지 않습니다.'] },
        { h: '열람·정정·삭제', body: ['본인의 개인정보 열람, 정정, 이용 정지 또는 삭제 요청은 아래 창구로 연락 주십시오. 본인 확인 후 신속히 대응합니다.'] },
        { h: '방침 변경', body: ['당사는 법령 개정이나 사업 내용 변경에 따라 본 방침을 개정할 수 있습니다. 개정된 내용은 본 페이지에 게재한 시점부터 적용됩니다.'] },
        { h: '문의 창구', body: ['개인정보 취급에 관한 문의는 아래로 연락 주십시오.'] },
      ],
    },
    footer: { rights: 'All rights reserved.', langLabel: 'LANGUAGE' },
  },

  'zh-tw': {
    siteTitle: 'TAG EIGHT',
    tagline: '連結韓國、日本、台灣的創意代理商',
    nav: { about: 'ABOUT', service: 'CAPABILITIES', works: 'WORKS', insight: 'INSIGHT', company: 'COMPANY', contact: 'CONTACT' },
    meta: {
      home: {
        title: 'TAG EIGHT｜連結韓國、日本、台灣的創意代理商',
        description:
          'TAG EIGHT是連結韓國、日本、台灣三個市場的創意代理商。從市場分析、創意製作、創作者行銷到活動執行，以一條完整的動線進行設計。',
      },
      about: { title: 'ABOUT｜TAG EIGHT', description: 'TAG EIGHT的願景、使命與價值觀，以及公司概要。以東京麹町為據點，在韓國、日本、台灣三個市場展開業務。' },
      service: { title: 'CAPABILITIES｜TAG EIGHT', description: 'THINK / CREATE / ACTIVATE 三大領域。涵蓋市場分析、溝通企劃、創意製作、創作者行銷、社群與數位廣告投放、公關與活動。' },
      works: { title: 'WORKS｜TAG EIGHT', description: '在韓國、日本、台灣三個市場執行的行銷與創意案例。' },
      insight: { title: 'INSIGHT｜TAG EIGHT', description: '關於韓國與台灣市場的消費者洞察、搜尋行為與創作者行銷的觀點。' },
      company: { title: 'COMPANY｜TAG EIGHT', description: '代表訊息、成員、公司概要。關於 TAG EIGHT合同会社。' },
      contact: { title: 'CONTACT｜TAG EIGHT', description: '聯絡TAG EIGHT。無論是直接委託或透過代理商、製作公司，我們都能對應。' },
    },
    hero: {
      catch: ['Asia Business Connected', 'Creative Agency'],
      sub: '連結韓國、日本、台灣三個市場',
      body: 'TAG EIGHT 是在韓國、日本、台灣三個市場中，\n設計那個瞬間的\n創意代理商。',
      lead: ['跨越國境，', '能打動人的，只有一件事。'],
      statement: ['心被觸動的那一刻。', 'TAG EIGHT，設計那一刻。'],
      scroll: 'SCROLL',
    },
    philosophy: {
      eyebrow: 'VISION',
      aiNote: '※ 本頁面的形象視覺為 AI 生成。',
      vision: {
        label: 'VISION',
        head: '每一次心被觸動，亞洲就更靠近一點。',
        en: 'With every heart moved, Asia grows closer.',
        body: '即使國家與語言不同，打動人心的理由並不會改變。',
      },
      mission: {
        label: 'MISSION',
        head: '我們，站在之間。',
        en: 'Standing in between.',
        body: '國與國，品牌與人。我們創造心意被傳達的瞬間，並將它化為確實的影響力與成長。',
      },
      values: {
        label: 'VALUES',
        head: '「多樣性」・「共鳴」・「感動」',
        en: 'Diversity, Empathy, Emotion.',
        body: '從差異到共鳴。從共鳴到感動。',
      },
    },
    common: { viewMore: 'VIEW MORE' },
    whatWeDo: {
      eyebrow: 'CAPABILITIES',
      head: ['把文化的差異，轉化為被選擇的理由。'],
      headHome: '思考。創造。傳遞。',
      sub: '從品牌策略到內容製作、推廣執行。\n可只委託單一領域，也可全程負責。',
      body: '韓國、日本、台灣。品牌的想法，與生活在那個市場的人的感受。站在那個「之間」，\n從策略到創意、到執行。',
      blocks: [
        {
          no: '01',
          title: 'WE THINK',
          ja: '品牌策略・在地最佳化',
          lead: '讀懂差異，找出被選擇的理由與該前進的方向。',
          items: ['市場・消費者分析', '品牌策略・定位', '溝通策略', '在地化'],
          itemsHome: ['市場・消費者分析', '品牌・溝通策略', '在地化'],
        },
        {
          no: '02',
          title: 'WE CREATE',
          ja: '創意開發・內容製作',
          lead: '把被選擇的理由，化為文字、設計與內容。',
          items: ['創意總監', '品牌識別', '文案・設計・影像製作', '內容企劃・製作'],
          itemsHome: ['創意總監', '品牌識別', '內容企劃・製作'],
        },
        {
          no: '03',
          title: 'WE ACTIVATE',
          ja: '推廣執行・媒體投放',
          lead: '把想法送到市場，把人的反應接到下一步。',
          items: ['創作者・網紅行銷', '媒體關係・公關', '活動・企劃執行', '社群・數位廣告投放與成效驗證'],
          itemsHome: ['創作者・媒體關係', '活動・企劃執行', '社群・數位廣告投放'],
        },
      ],
    },
    message: {
      eyebrow: 'CEO MESSAGE',
      title: '「不一樣」，很有意思。',
      stanzas: [
        { lines: ['韓國、日本、台灣。', '很近，卻不相同。'] },
        { lines: ['我們一直在三種文化的「之間」', '工作。'] },
        { lines: ['仔細觀察差異，', '從中找出被選擇的理由。'] },
        { lines: ['把那個理由，化為想法。', '把想法，化為打動人心的契機。'] },
        { lines: ['然後把那個契機，', '連結到客戶的下一次成長。'] },
        { lines: ['三種文化之間，', '還有許多有意思的事。'] },
        { lines: ['每發現一個「有意思」，', '亞洲就更靠近一點。'] },
        { kind: 'believe', lines: ['我們如此相信。'] },
      ],
      signLine: 'TAG EIGHT合同会社　代表　李 東眩',
    },
    why: {
      eyebrow: 'WHY TAG EIGHT',
      lines: [
        ['連結的「#」，與無限的「∞」。', 'TAG EIGHT 誕生自這兩個符號。'],
        ['連結差異，', '找出尚未被看見的可能性。', '我們把這份意志，放進了名字裡。'],
      ],
    },
    team: {
      eyebrow: 'PEOPLE',
      head: '跨越國境的，首先是我們自己。',
      sub: '連結韓國、日本、台灣的成員',
      members: [
        { key: 'kr', name: 'DONGHYUN LEE', role: 'Creative Director & CEO', base: 'KOREA', color: '#F37021', ink: '#B54A15', colorName: 'Hermès Orange', bio: '2004年來到日本，始終以韓國人的視角從外面看日本。在兩種不同價值觀之間，尋找能夠傳達的形式。就算對象變成整個地球，也還是不膩。' },
        { key: 'yj', name: 'YONGJUN PARK', role: 'Content Producer', base: 'KOREA', color: '#3F8F63', ink: '#2F6E4A', colorName: 'Green', bio: '二十年來，我一直為韓國讀者書寫日本。在部落格，在旅遊書，現在則是在企劃裡。比起觀光景點，當地的生活更能打動人。覺得有意思，手就會比腦袋先動起來。' },
        { key: 'jh', name: 'JEEHYUN YONG', role: 'Media & Social Producer', base: 'KOREA', color: '#2E6FB7', ink: '#245A96', colorName: 'Blue', bio: '我曾在韓國電視台擔任導演。在日本十年。現在在日本與韓國，那個「之間」工作。電視和社群，各有各的運作方式。先看清話題會經過哪裡、怎麼走，再決定方法。' },
        { key: 'hl', name: 'HESTER LIN', role: 'Creative Producer', base: 'TAIWAN', color: '#C0417A', ink: '#9B3060', colorName: 'Magenta', bio: '在台灣與日本13年。現在在台灣、韓國、日本，這三者的「之間」。我自己也是一名創作者。品牌想傳達的，與追蹤者想知道的。我就站在能同時聽見兩邊聲音的位置。' },
        { key: 'sa', name: 'SHISEI AOKI', role: 'Strategy Producer', base: 'JAPAN', color: '#6B7043', ink: '#4E5230', colorName: 'Deep Khaki', bio: '從電商現場，到日本地方政府。統籌訪日業務與MICE。人從哪裡來、在哪裡停下、選擇了什麼。企劃的起點，永遠是事實。' },
      ],
    },
    companySec: {
      eyebrow: 'COMPANY',
      head: '公司概要',
      labels: {
        name: '商號',
        founded: '成立',
        ceo: '代表人',
        capital: '資本額',
        fiscal: '結算期',
        employees: '員工人數',
        address: '所在地',
        tel: 'TEL',
        url: 'URL',
        corpNo: '法人番號',
        invoiceNo: '登錄番號',
        business: '營業項目',
      },
      business: ['品牌策略・在地最佳化', '創意開發・內容製作', '推廣執行・媒體投放', '訪日旅遊行銷推廣業務'],
    },
    statement: {
      body: '即使國境與語言不同，打動人心的本質並不會改變。我們在韓國、日本、台灣三個市場中解讀市場文化與消費者情感，將品牌的想法轉化為「能夠抵達」的形式。',
      facts: [
        { n: '3', label: '市場' },
        { n: '2019', label: '成立' },
        { n: '5', label: '成員' },
        { n: '6', label: '領域' },
      ],
    },
    sectors: {
      eyebrow: 'CLIENTS',
      head: '與國家，與地方，與品牌。',
      sub: '從政府機關到全國性品牌，這些是我們在三個市場合作過的領域。',
      note: '※ 因保密義務，恕不記載企業或團體名稱。洽談時將在可公開的範圍內個別介紹。',
      items: [
        { no: '01', ja: '政府機關・地方自治體', en: 'Government & Municipality', body: '訪日推廣 / 地方品牌塑造 / 面向海外市場的資訊發布與成效驗證' },
        { no: '02', ja: '觀光・住宿', en: 'Tourism & Hospitality', body: '設施與區域的集客設計 / OTA串接 / 從行前到行中的動線建構' },
        { no: '03', ja: '航空・交通', en: 'Aviation & Transport', body: '航線與服務的認知擴散 / 交通票券使用促進與搜尋動線最佳化' },
        { no: '04', ja: '食品・零食', en: 'Food & Confectionery', body: '新品與週年活動 / 以參與型內容設計UGC' },
        { no: '05', ja: '美妝・健康', en: 'Beauty & Healthcare', body: '取得搜尋認知與品牌脈絡重構 / 創作者操作與店頭促銷' },
        { no: '06', ja: '文化・娛樂', en: 'Culture & Entertainment', body: '影展與內容的海外拓展 / 媒體關係 / 新聞稿發布' },
      ],
    },
    works: {
      eyebrow: 'WORKS',
      head: '重新定義課題，答案就會不同。',
      sub: '在韓國、日本、台灣三個市場中，我們如何看待課題，又如何重新組織。',
      empty: '案例準備中。洽談時將在可公開的範圍內個別介紹。',
      confidential: '※ 部分專案因保密義務，恕不記載企業或團體名稱。',
      challengeLabel: '課題',
      approachLabel: '解決策',
      designLabel: '設計',
      rolloutLabel: '展開',
      essenceLabel: '本質',
      routeLines: {
        'jp-kr': '把日本，帶給韓國的消費者。',
        'tw-kr': '把台灣，帶給韓國的消費者。',
        'jp-tw': '把日本，帶給台灣的消費者。',
      },
      requestHead: '詳細案例將以PDF寄送。',
      requestBody: '我們備有包含執行內容、成果數據與創意素材的詳細版本，將個別寄送給洽詢者。',
      requestCta: '索取資料',
      backToList: '返回案例列表',
    },
    journal: {
      eyebrow: 'INSIGHT',
      readMore: '繼續閱讀',
      backToList: '返回文章列表',
      head: '解讀市場的，我們的觀點。',
      sub: '關於韓國與台灣的消費者洞察、搜尋行為與創作者行銷。',
      empty: '文章準備中。',
    },
    contact: {
      eyebrow: 'CONTACT',
      kicker: '還沒有被選擇的理由。',
      head: ['從那裡開始，就是我們的工作。'],
      sub: '要不要一起打造那個理由？\n無論是直接委託，或透過代理商、製作公司洽談，我們都能對應。',
      cta: '以電子郵件洽詢',
      directLabel: '直接聯絡',
      formLabel: '聯絡我們',
      f: {
        company: '公司・團體名稱',
        name: '聯絡人姓名',
        email: '電子郵件',
        subject: '洽詢事項',
        message: '洽詢內容',
        submit: '送出',
        required: '必填',
        note: '填寫內容僅用於回覆本次洽詢。',
        subjects: ['韓國相關洽詢', '台灣相關洽詢', '日本相關洽詢', '徵才相關', '其他'],
      errInput: '請確認輸入內容。',
      errServer: '傳送失敗。麻煩您直接來信 info@tag-8.com。',
      consent: '，並同意後送出。',
      consentLink: '隱私權政策',
      mapLink: '在 Google 地圖上查看',
      thanksHead: '已收到您的來信。',
      thanksBody: '我們已寄出確認信件，將由專人於兩個工作天內與您聯繫。',
      thanksBack: '返回首頁',
      },
    },
    privacy: {
      eyebrow: 'PRIVACY POLICY',
      head: '隱私權政策',
      intro: 'TAG EIGHT合同会社（以下稱「本公司」）遵守個人資料保護相關法令，妥善處理您的個人資料。',
      revised: '制定日：2026年8月17日',
      metaTitle: '隱私權政策｜TAG EIGHT',
      metaDesc: '關於 TAG EIGHT合同会社 的個人資料處理。',
      sections: [
        { h: '蒐集的資訊', body: ['本公司透過聯絡表單蒐集以下資訊。'],
          list: ['公司／團體名稱', '姓名', '電子郵件地址', '諮詢類型與訊息內容'] },
        { h: '利用目的', body: ['所蒐集的個人資料，僅在下列目的範圍內使用。'],
          list: ['回覆與聯繫諮詢內容', '服務提案與會議安排', '契約之締結與履行'] },
        { h: '第三方提供', body: ['除法令另有規定外，本公司不會在未經本人同意的情況下，將個人資料提供予第三方。'] },
        { h: '跨境傳輸', body: [
            '透過聯絡表單傳送的資訊，為進行郵件收發，會經由位於美國的服務供應商伺服器。',
            '本公司僅在傳送目的的範圍內使用該等服務，不會為其他目的提供資訊。',
            '各服務供應商的隱私權政策，請於其官方網站確認。'],
          list: ['郵件發送：Google Workspace（美國）', '網站託管：Cloudflare（美國）'] },
        { h: '安全管理', body: ['本公司為防止個人資料外洩、滅失或毀損，並確保其他安全管理事項，採取必要且適當的措施。'] },
        { h: '保存期間', body: ['與諮詢相關的個人資料，於處理完成並經過必要期間後，將迅速刪除。'] },
        { h: '流量分析', body: ['本網站可能使用分析工具以掌握瀏覽狀況。所蒐集的資訊不包含可識別特定個人的內容。'] },
        { h: '查詢・更正・刪除', body: ['關於個人資料的查詢、更正、停止利用或刪除之請求，請與下列窗口聯繫。確認為本人後將迅速處理。'] },
        { h: '政策變更', body: ['本公司得因法令修正或業務內容變更而修訂本政策。修訂後的內容自公布於本頁面時起適用。'] },
        { h: '聯絡窗口', body: ['關於個人資料處理的相關問題，請與下列窗口聯繫。'] },
      ],
    },
    footer: { rights: 'All rights reserved.', langLabel: 'LANGUAGE' },
  },
};
