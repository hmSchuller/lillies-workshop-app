#!/bin/bash
# Sign hermesvm.framework for physical-device installs.
# The pre-built binary shipped with hermes-engine in RN 0.83 is unsigned,
# which causes install failures on iOS 18+ devices.
set -euo pipefail

FRAMEWORK="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/hermesvm.framework"

if [ -d "$FRAMEWORK" ]; then
  echo "Signing hermesvm.framework with identity: ${EXPANDED_CODE_SIGN_IDENTITY:-"-"}"
  /usr/bin/codesign --force --sign "${EXPANDED_CODE_SIGN_IDENTITY:--}" "$FRAMEWORK"
fi
