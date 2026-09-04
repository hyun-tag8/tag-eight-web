// 회사 정보 단일 소스(single source of truth).
// 会社概要 페이지 표시와 JSON-LD 구조화 데이터가 모두 여기를 참조한다.
// 값이 바뀌면 이 파일만 고치면 전 페이지 + 검색엔진 노출이 함께 갱신된다.
//
// ⚠️ TODO(확정 필요): 아래 3개는 현행 홈페이지와 2026 Company Profile PDF가 서로 다르다.
//    등기부 / 인보이스 기준으로 확정한 뒤 이 파일에 반영할 것.
//    1) building  : 「近鉄半蔵門SQUARE」(웹) vs 「VORT半蔵門PLUS」(PDF)
//    2) tel       : 050-3707-8123(웹) vs 03-6272-6190(PDF)
//    3) 대표번호를 하나로 통일할지, 대표/直通을 나눌지

export const company = {
  legalName: 'TAG EIGHT合同会社',
  legalNameEn: 'TAG EIGHT LLC.',
  brand: 'TAG EIGHT',
  mark: '#8',

  founded: '2019-05',
  foundedLabel: '2019年5月',

  ceo: '李 東眩',
  ceoEn: 'DONGHYUN LEE',
  ceoTitle: 'Creative Director',

  capital: 5_500_000,
  capitalLabel: '5,500,000円',   // 2026-08-14 대표 확정 (구 5,000,000円 정정)
  fiscalYearEnd: '4月',

  employees: 5,
  employeesLabel: '5名',
  employeesAsOf: '2026年7月',

  postalCode: '102-0083',
  prefecture: '東京都',
  city: '千代田区',
  street: '麹町1-6-30',
  building: 'VORT半蔵門PLUS 13階', // ← TODO 확인
  addressJa: '〒102-0083 東京都千代田区麹町1-6-30 VORT半蔵門PLUS 13階',

  tel: '03-6272-6190', // ← TODO 확인
  email: 'info@tag-8.com',
  url: 'https://tag-8.com',

  corporateNumber: '3011103008827',
  invoiceNumber: 'T3011103008827',
  invoiceRegisteredOn: '2023-10-01',

  markets: ['KOREA', 'JAPAN', 'TAIWAN'],

  social: {
    facebook: 'https://www.facebook.com/tageight8',
  },
} as const;

/** schema.org Organization — 검색엔진과 LLM이 회사를 식별하는 근거 데이터 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    /* 요미가나·한글 표기 — 2026-09-02 추가.
       Google AI 검색이 SalesNow(법인DB) 한 줄만 인용하고, 말레이시아·한국의 동명 회사와
       섞이는 문제의 대응. 「タグエイト」 표기가 없으면 가나 검색과 엔티티 구분이 안 된다. */
    alternateName: [company.legalNameEn, company.brand, 'タグエイト', 'タグエイト合同会社', '태그에잇'],
    /* 회사가 「무엇을 하는가」 — 이게 없으면 AI 는 등기 정보(주소·법인격)밖에 말할 게 없다.
       문구는 사이트 meta description 확정판과 동일 (L1-J 계열) */
    description:
      '韓国・日本・台湾の3市場をつなぐクリエイティブエージェンシー。市場分析からクリエイティブ制作、クリエイターマーケティング、キャンペーン実行までを一気通貫で設計します。',
    slogan: 'Asia Business Connected Creative Agency',
    logo: `${company.url}/og.jpg`,
    knowsAbout: [
      'インバウンドマーケティング',
      '韓国市場マーケティング',
      '台湾市場マーケティング',
      'NAVER',
      'インフルエンサーマーケティング',
      'クリエイターマーケティング',
    ],
    url: company.url,
    email: company.email,
    telephone: company.tel,
    foundingDate: company.founded,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: company.employees,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      postalCode: company.postalCode,
      addressRegion: company.prefecture,
      addressLocality: company.city,
      streetAddress: `${company.street} ${company.building}`,
    },
    founder: {
      '@type': 'Person',
      name: company.ceoEn,
      alternateName: company.ceo,
      jobTitle: company.ceoTitle,
    },
    identifier: {
      '@type': 'PropertyValue',
      name: '法人番号',
      value: company.corporateNumber,
    },
    areaServed: [
      { '@type': 'Country', name: 'Japan' },
      { '@type': 'Country', name: 'South Korea' },
      { '@type': 'Country', name: 'Taiwan' },
    ],
    sameAs: [company.social.facebook],
  };
}
