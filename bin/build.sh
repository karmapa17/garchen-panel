#!/bin/bash

PACKAGE_NAME=$(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ELECTRON_VERSION=1.6.1
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | xargs)
ROOT_DIR=$(cd $(dirname $0)/..; pwd)
ZIP_IOS="${PACKAGE_NAME}-darwin-x64-v${PACKAGE_VERSION}.zip"
ZIP_WIN="${PACKAGE_NAME}-ia32-v${PACKAGE_VERSION}.zip"

cd $ROOT_DIR
mkdir -p dist/src
mkdir -p zips
NODE_ENV=production webpack
sed -i '' -e 's/http:\/\/localhost:3000\///g' dist/index.html
mv dist/index.html dist/bundle.js dist/src/
cp -r assets/images/*.ico assets/images/*.icns .babelrc package.json index.js dist/
cp -r src/main.js src/main dist/src

cd dist;
npm install --verbose --production;


electron-packager ./ ${PACKAGE_NAME} --platform=win32 --arch=ia32\
  --version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=treasure_logo.ico
zip -r "${ZIP_WIN}" "${PACKAGE_NAME}-win32-ia32"
cp ${ZIP_WIN} ./../zips/
rm -rv "${PACKAGE_NAME}-win32-ia32*"

electron-packager ./ ${PACKAGE_NAME} --platform=darwin --arch=x64\
  --version="${ELECTRON_VERSION}" --app-version="${PACKAGE_VERSION}" --icon=treasure_logo.icns
zip -r "${ZIP_IOS}" "${PACKAGE_NAME}-darwin-x64"
cp ${ZIP_IOS} ./../zips/
rm -rv "${PACKAGE_NAME}-darwin-x64*"
