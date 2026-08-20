#!/usr/bin/env bash
# ============================================================
# update.sh — 새로 받은 zip에서 소스만 뽑아 이 폴더에 덮어쓴다.
#
#   사용법:  ./update.sh
#
#   개발 서버(npm run dev)는 켜둔 채로 실행하면 된다.
#   파일이 바뀌면 브라우저가 알아서 새로고침한다.
#   npm install 은 다시 할 필요 없다 (package.json 이 바뀌었을 때만).
# ============================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOWNLOADS="${HOME}/Downloads"

# 1) 가장 최근에 받은 tag-eight-web*.zip 찾기
ZIP="$(ls -t "${DOWNLOADS}"/tag-eight-web*.zip 2>/dev/null | head -n 1 || true)"
if [ -z "${ZIP}" ]; then
  echo "✗ ${DOWNLOADS} 에서 tag-eight-web*.zip 을 찾지 못했다."
  echo "  브라우저에서 zip 을 먼저 받아라."
  exit 1
fi
echo "▸ 사용할 파일: $(basename "${ZIP}")"

# 2) 임시 폴더에 풀기
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT
unzip -q "${ZIP}" -d "${TMP}"

SRC_ROOT="${TMP}/tag-eight"
if [ ! -d "${SRC_ROOT}/src" ]; then
  echo "✗ zip 안에서 tag-eight/src 를 찾지 못했다. 압축 구조가 다르다."
  exit 1
fi

# 3) src/ 와 public/ 만 통째로 교체 (node_modules 는 건드리지 않는다)
for D in src public; do
  if [ -d "${SRC_ROOT}/${D}" ]; then
    rm -rf "${PROJECT_DIR:?}/${D}"
    cp -R "${SRC_ROOT}/${D}" "${PROJECT_DIR}/${D}"
    echo "  ✓ ${D}/ 갱신"
  fi
done

# 4) 설정 파일은 바뀐 것만 복사
for F in astro.config.mjs tsconfig.json README.md DEPLOY.md PRD.md deploy.sh; do
  if [ -f "${SRC_ROOT}/${F}" ] && ! cmp -s "${SRC_ROOT}/${F}" "${PROJECT_DIR}/${F}"; then
    cp "${SRC_ROOT}/${F}" "${PROJECT_DIR}/${F}"
    [ "${F}" = "deploy.sh" ] && chmod +x "${PROJECT_DIR}/${F}"
    echo "  ✓ ${F} 갱신"
  fi
done

# 5) package.json 이 바뀌었으면 알려준다
if [ -f "${SRC_ROOT}/package.json" ] && ! cmp -s "${SRC_ROOT}/package.json" "${PROJECT_DIR}/package.json"; then
  cp "${SRC_ROOT}/package.json" "${PROJECT_DIR}/package.json"
  echo ""
  echo "⚠ package.json 이 바뀌었다. 이번에는 아래를 실행해라:"
  echo "    npm install"
fi

echo ""
echo "완료. 브라우저가 자동으로 새로고침된다. 서버는 끄지 않아도 된다."
