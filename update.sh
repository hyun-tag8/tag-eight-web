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

# 3) 소스 디렉토리를 통째로 교체 (node_modules 는 건드리지 않는다)
#
#    ⚠ functions/ 를 빠뜨리면 안 된다.
#      Cloudflare Pages Function(문의 폼 API)이 여기 있는데,
#      2026-08-21 까지 이 목록에서 누락돼 있어 폼 코드 수정이 반영되지 않았다.
for D in src public functions docs; do
  if [ -d "${SRC_ROOT}/${D}" ]; then
    rm -rf "${PROJECT_DIR:?}/${D}"
    cp -R "${SRC_ROOT}/${D}" "${PROJECT_DIR}/${D}"
    echo "  ✓ ${D}/ 갱신"
  fi
done

# 4) 설정 파일은 바뀐 것만 복사
#
#    ⚠ update.sh 자기 자신은 여기서 덮어쓰면 안 된다.
#      실행 중인 스크립트를 갈아치우면 bash 가 남은 부분을 엉뚱한 위치에서 읽어
#      "unexpected EOF" 로 죽는다. 새 버전은 .new 로 받아두고 안내만 한다.
for F in astro.config.mjs tsconfig.json .gitignore README.md DEPLOY.md PRD.md CONTACT_SETUP.md HANDOVER.md deploy.sh; do
  if [ -f "${SRC_ROOT}/${F}" ] && ! cmp -s "${SRC_ROOT}/${F}" "${PROJECT_DIR}/${F}"; then
    cp "${SRC_ROOT}/${F}" "${PROJECT_DIR}/${F}"
    [ "${F}" = "deploy.sh" ] && chmod +x "${PROJECT_DIR}/${F}"
    echo "  ✓ ${F} 갱신"
  fi
done

# 4-b) update.sh 자체가 바뀌었으면 다음 실행부터 적용되도록 예약한다
UPDATE_PENDING=0
if [ -f "${SRC_ROOT}/update.sh" ] && ! cmp -s "${SRC_ROOT}/update.sh" "${PROJECT_DIR}/update.sh"; then
  cp "${SRC_ROOT}/update.sh" "${PROJECT_DIR}/update.sh.new"
  chmod +x "${PROJECT_DIR}/update.sh.new"
  UPDATE_PENDING=1
fi

# 5) package.json 이 바뀌었으면 알려준다
if [ -f "${SRC_ROOT}/package.json" ] && ! cmp -s "${SRC_ROOT}/package.json" "${PROJECT_DIR}/package.json"; then
  cp "${SRC_ROOT}/package.json" "${PROJECT_DIR}/package.json"
  echo ""
  echo "⚠ package.json 이 바뀌었다. 이번에는 아래를 실행해라:"
  echo "    npm install"
fi

if [ "${UPDATE_PENDING}" = "1" ]; then
  echo ""
  echo "⚠ update.sh 자체가 갱신됐다. 아래 한 줄을 실행해 두면 다음부터 새 버전이 쓰인다:"
  echo "    mv update.sh.new update.sh"
fi

echo ""
echo "완료. 브라우저가 자동으로 새로고침된다. 서버는 끄지 않아도 된다."
