#!/usr/bin/env bash
# ============================================================
# deploy.sh — 변경사항을 GitHub 에 올린다. Cloudflare 가 자동 배포한다.
#
#   사용법:  ./deploy.sh "무엇을 바꿨는지"
#   예:      ./deploy.sh "히어로 사진 교체"
#
#   인자를 안 주면 날짜로 자동 기록한다.
# ============================================================
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d .git ]; then
  echo "✗ 아직 git 저장소가 아니다. DEPLOY.md 의 '최초 1회' 절차를 먼저 진행해라."
  exit 1
fi

MSG="${1:-update $(date +%Y-%m-%d\ %H:%M)}"

echo "▸ 빌드 확인"
npm run build >/dev/null 2>&1 || { echo "✗ 빌드 실패. 배포를 중단한다."; npm run build; exit 1; }
echo "  ✓ 빌드 통과"

git add -A
if git diff --cached --quiet; then
  echo "변경사항이 없다. 배포하지 않는다."
  exit 0
fi

git commit -m "${MSG}"
git push

echo ""
echo "완료. Cloudflare Pages 가 1~2분 안에 배포한다."
echo "진행 상황: Cloudflare 대시보드 → Workers & Pages → 프로젝트 → Deployments"
