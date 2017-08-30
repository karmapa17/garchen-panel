#!/bin/bash

set -x

PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ZIP_IOS="${PACKAGE_NAME}-darwin-x64-v${PACKAGE_VERSION}.zip"

if [ "$PLATFORM" == "darwin" ]; then
  gdrive upload --parent 0B-dB2SJOjmDIdEFFVFR2aGxwaGc "./zips/${ZIP_IOS}"
fi
