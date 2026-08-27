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
#    ⚠⚠ src/content 는 절대 지우지 않는다.
#      관리화면이 GitHub 에 직접 커밋한 INSIGHT 원고가 여기 있다.
#      zip 에는 이 폴더가 없으므로 src 를 통째로 지우면 원고가 사라진다.
for D in src public functions docs; do
  [ -d "${SRC_ROOT}/${D}" ] || continue
  if [ "${D}" = "src" ]; then
    KEEP="$(mktemp -d)"
    if [ -d "${PROJECT_DIR}/src/content" ]; then
      cp -R "${PROJECT_DIR}/src/content" "${KEEP}/content"
      BEFORE="$(find "${KEEP}/content" -type f | wc -l | tr -d ' ')"
    else
      BEFORE=0
    fi
    rm -rf "${PROJECT_DIR:?}/src"
    cp -R "${SRC_ROOT}/src" "${PROJECT_DIR}/src"
    if [ -d "${KEEP}/content" ]; then
      rm -rf "${PROJECT_DIR}/src/content"
      cp -R "${KEEP}/content" "${PROJECT_DIR}/src/content"
    fi
    AFTER="$(find "${PROJECT_DIR}/src/content" -type f 2>/dev/null | wc -l | tr -d ' ')"
    rm -rf "${KEEP}"
    if [ "${BEFORE}" != "${AFTER}" ]; then
      echo "✗ src/content 파일 수가 ${BEFORE} → ${AFTER} 로 바뀌었다. 커밋하지 말 것."
      exit 1
    fi
    echo "  ✓ src/ 갱신 (content ${AFTER}건 보존)"
  else
    rm -rf "${PROJECT_DIR:?}/${D}"
    cp -R "${SRC_ROOT}/${D}" "${PROJECT_DIR}/${D}"
    echo "  ✓ ${D}/ 갱신"
  fi
done

find "${PROJECT_DIR}/src" -type d -name "* [0-9]" -empty -delete 2>/dev/null || true

# 4) 설정 파일은 바뀐 것만 복사
#
#    ⚠ package-lock.json 을 반드시 포함한다.
#      2026-08-24 까지 이게 빠져 있어서, 맥에서 npm install 할 때마다
#      의존성 버전이 새로 해석됐다. 그 결과 제작 환경과 트리가 어긋나
#      "Tsconfig not found astro/tsconfigs/strict" 로 로컬 빌드가 깨졌다.
#      lock 을 같이 주고 npm ci 로 설치하면 트리가 완전히 동일해진다.
#
#    ⚠ update.sh 자기 자신은 여기서 덮어쓰면 안 된다.
#      실행 중인 스크립트를 갈아치우면 bash 가 남은 부분을 엉뚱한 위치에서 읽어
#      "unexpected EOF" 로 죽는다. 새 버전은 .new 로 받아두고 안내만 한다.
for F in astro.config.mjs tsconfig.json package-lock.json .gitignore README.md DEPLOY.md PRD.md CONTACT_SETUP.md HANDOVER.md deploy.sh; do
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
  echo "    npm ci"
  echo "  (npm install 이 아니라 npm ci 다 — lock 파일 그대로 설치해야"
  echo "   제작 환경과 버전이 완전히 같아진다)"
fi

if [ "${UPDATE_PENDING}" = "1" ]; then
  echo ""
  echo "⚠ update.sh 자체가 갱신됐다. 아래 한 줄을 실행해 두면 다음부터 새 버전이 쓰인다:"
  echo "    mv update.sh.new update.sh"
fi

echo ""
echo "완료. 브라우저가 자동으로 새로고침된다. 서버는 끄지 않아도 된다."
