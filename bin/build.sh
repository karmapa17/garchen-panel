#!/bin/bash

set -x

PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ELECTRON_VERSION=1.6.1
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ROOT_DIR=$(cd $(dirname $0)/..; pwd)
ZIP_IOS="${PACKAGE_NAME}-darwin-x64-v${PACKAGE_VERSION}.zip"
ZIP_WIN="${PACKAGE_NAME}-win32-ia32-v${PACKAGE_VERSION}.zip"

cd $ROOT_DIR
rm -r dist zips
mkdir -p dist/src
mkdir -p zips
NODE_ENV=production webpack
sed -i '' -e 's/http:\/\/localhost:3000\///g' dist/index.html
mv dist/index.html dist/bundle.js dist/src/
cp -r assets/images/*.ico assets/images/*.icns .babelrc package.json index.js dist/
cp -r src/main dist/src

cd dist;
npm install --production > /dev/null;

electron-packager ./ ${PACKAGE_NAME} --platform=win32 --arch=ia32\
  --version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=treasure_logo.ico
zip -r "./../zips/${ZIP_WIN}" "${PACKAGE_NAME}-win32-ia32" > /dev/null
rm -r "${PACKAGE_NAME}-win32-ia32"

electron-packager ./ ${PACKAGE_NAME} --platform=darwin --arch=x64\
  --version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=treasure_logo.icns
zip -r "./../zips/${ZIP_IOS}" "${PACKAGE_NAME}-darwin-x64" > /dev/null
rm -r "${PACKAGE_NAME}-darwin-x64"
