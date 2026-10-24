#!/usr/bin/env node
/**
 * 生成 Intel (x64) 打包用的 electron-builder 配置
 *
 * 以上游 package.json 的 build 字段为基础，只覆盖架构相关项，
 * 这样同步上游后打包配置会自动跟随，无需改动 package.json。
 *
 * 用法：node .github/x64/make-builder-config.cjs <发布版本号> <输出文件>
 */

const fs = require('fs');
const path = require('path');

const [releaseVersion, outFile] = process.argv.slice(2);
if (!releaseVersion || !outFile) {
  console.error('用法: make-builder-config.cjs <发布版本号> <输出文件>');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8'));
const base = pkg.build;

// 上游只打 arm64，会排除 node-pty 的 x64 预编译；这里反过来排除 arm64
const files = base.files
  .filter(pattern => !pattern.includes('node-pty/prebuilds/darwin-x64'))
  .concat('!**/node_modules/node-pty/prebuilds/darwin-arm64/**');

const config = {
  ...base,
  files,
  // CFBundleVersion 带上 fork 的小版本号，CFBundleShortVersionString 保持上游版本
  buildVersion: releaseVersion,
  // CI 在海外运行，使用 Electron 官方源，不走 npmmirror
  electronDownload: { cache: base.electronDownload && base.electronDownload.cache },
  mac: {
    ...base.mac,
    target: base.mac.target.map(target => ({ ...target, arch: ['x64'] })),
    artifactName: `\${productName}-${releaseVersion}-\${arch}.\${ext}`
  },
  dmg: {
    ...base.dmg,
    title: `\${productName} ${releaseVersion}`
  }
};

fs.writeFileSync(outFile, JSON.stringify(config, null, 2));
console.log(`已生成 x64 打包配置: ${outFile} (版本 ${releaseVersion})`);
