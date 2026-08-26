/**
 * 오피스 좌표 — 지도와 링크가 같은 값을 봐야 하므로 한 곳에서 관리한다.
 *
 * VORT半蔵門plus(東京都千代田区麹町1-6-30) 건물 실측치.
 * Google 지도 우클릭 → 좌표 복사로 취득(2026-08-26).
 * 이전 값(35.684447 / 139.742919)은 麹町一丁目 블록 중심이라 약 100m 벗어나 있었다.
 */
export const OFFICE = {
  lat: 35.6850827,
  lng: 139.7421486,
  /** 17 = 건물 단위. 16 은 가로 약 1.2km 라 건물이 점으로만 보인다 */
  zoom: 17,
} as const;

export const GMAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${OFFICE.lat},${OFFICE.lng}`;
