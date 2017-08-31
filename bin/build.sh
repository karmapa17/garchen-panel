#!/bin/bash

set -x

PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ELECTRON_VERSION=1.7.6
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ROOT_DIR=$(cd $(dirname $0)/..; pwd)
ZIP_IOS="${PACKAGE_NAME}-darwin-x64-v${PACKAGE_VERSION}.zip"
ZIP_WIN="${PACKAGE_NAME}-win32-ia32-v${PACKAGE_VERSION}.zip"

cd $ROOT_DIR
rm -r dist
mkdir -p dist/src/assets/fonts
mkdir -p zips
NODE_ENV=production webpack
sed -i '' -e 's/http:\/\/localhost:3000\///g' dist/index.html
mv dist/index.html dist/bundle.js dist/src/
cp src/splash.html src/splash.mp4 dist/src/
cp -r assets/images/*.ico assets/images/*.icns .babelrc package.json index.js dist/
cp -r assets/fonts/* dist/src/assets/fonts
cp -r src/main dist/src

cd dist
npm i --prod

if [ "$PLATFORM" == "win32-ia32" ]; then
  npm run rebuild-ia32
  electron-packager ./ ${PACKAGE_NAME} --platform=win32 --arch=ia32\
  --electron-version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=garchen-logo.ico --no-prune
  7z a -tzip -r "./../zips/${ZIP_WIN}" "${PACKAGE_NAME}-win32-ia32"
  rm -r "${PACKAGE_NAME}-win32-ia32"
fi

if [ "$PLATFORM" == "win32-x64" ]; then
  npm run rebuild
  electron-packager ./ ${PACKAGE_NAME} --platform=win32 --arch=x64\
  --electron-version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=garchen-logo.ico --no-prune
  7z a -tzip -r "./../zips/${ZIP_WIN}" "${PACKAGE_NAME}-win32-x64"
  rm -r "${PACKAGE_NAME}-win32-x64"
fi

if [ "$PLATFORM" == "darwin" ]; then
  npm run rebuild
  electron-packager ./ ${PACKAGE_NAME} --platform=darwin --arch=x64\
    --electron-version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=garchen-logo.icns --no-prune
  zip -r "./../zips/${ZIP_IOS}" "${PACKAGE_NAME}-darwin-x64" > /dev/null
  rm -r "${PACKAGE_NAME}-darwin-x64"
fi
