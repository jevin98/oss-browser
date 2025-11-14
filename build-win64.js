/**
 * Windows x64 打包脚本
 *
 * 这个脚本用于在 Windows 系统上打包 OSS Browser 应用
 * 解决了 Makefile 中环境变量设置在 Windows 上不兼容的问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const pkg = require('./package.json');

// 配置信息
const NAME = 'oss-browser';
const VERSION = pkg.version;
const CUSTOM = './custom';
const ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/';
const ELECTRON_VERSION = '1.8.4';

console.log('='.repeat(60));
console.log('开始打包 OSS Browser Win64 版本');
console.log('='.repeat(60));
console.log(`应用名称: ${NAME}`);
console.log(`版本号: ${VERSION}`);
console.log(`Electron 版本: ${ELECTRON_VERSION}`);
console.log('');

// 步骤1: 检查 dist 目录是否存在
console.log('[1/4] 检查 dist 目录...');
if (!fs.existsSync('./dist')) {
  console.error('❌ 错误: dist 目录不存在！');
  console.error('请先运行: pnpm run build');
  process.exit(1);
}
console.log('✅ dist 目录存在\n');

// 步骤2: 使用 electron-packager 打包应用
console.log('[2/4] 打包 Electron 应用...');
console.log('这可能需要几分钟时间，请耐心等待...\n');

try {
  // 设置环境变量并执行打包命令
  const env = {
    ...process.env,
    ELECTRON_MIRROR: ELECTRON_MIRROR
  };

  execSync(
    `node node_modules/electron-packager/cli.js ./dist ${NAME} ` +
    `--asar --asar-unpack *.node --overwrite --out=build ` +
    `--version ${ELECTRON_VERSION} --app-version ${VERSION} ` +
    `--platform=win32 --arch=x64 --icon=${CUSTOM}/icon.ico`,
    {
      env: env,
      stdio: 'inherit' // 显示打包进度
    }
  );
  console.log('✅ Electron 应用打包完成\n');
} catch (error) {
  console.error('❌ 打包失败:', error.message);
  process.exit(1);
}

// 步骤3: 复制自定义资源
console.log('[3/4] 复制自定义资源...');
const buildPath = `./build/${NAME}-win32-x64`;
const resourcesPath = path.join(buildPath, 'resources');

try {
  // 使用递归复制
  copyFolderRecursiveSync(CUSTOM, resourcesPath);
  console.log('✅ 自定义资源复制完成\n');
} catch (error) {
  console.error('❌ 复制资源失败:', error.message);
  process.exit(1);
}

// 步骤4: 创建 zip 压缩包
console.log('[4/4] 创建 zip 压缩包...');
const releasesDir = `./releases/${VERSION}`;
const zipPath = path.join(releasesDir, `${NAME}-win32-x64.zip`);

// 创建 releases 目录
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// 删除旧的 zip 文件（如果存在）
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log(`已删除旧的压缩包: ${zipPath}`);
}

// 创建压缩包
zipDirectory(buildPath, zipPath)
  .then(() => {
    console.log('✅ zip 压缩包创建完成\n');
    console.log('='.repeat(60));
    console.log('🎉 打包完成！');
    console.log('='.repeat(60));
    console.log('📁 应用程序目录:', buildPath);
    console.log('📦 压缩包路径:', zipPath);
    console.log('\n可以直接运行:', path.join(buildPath, `${NAME}.exe`));
  })
  .catch(error => {
    console.error('❌ 创建压缩包失败:', error.message);
    process.exit(1);
  });

/**
 * 递归复制文件夹
 * @param {string} source 源文件夹路径
 * @param {string} target 目标文件夹路径
 */
function copyFolderRecursiveSync(source, target) {
  // 检查源路径是否存在
  if (!fs.existsSync(source)) {
    throw new Error(`源路径不存在: ${source}`);
  }

  // 创建目标文件夹
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // 复制文件和子文件夹
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(targetFolder, file);

      if (fs.lstatSync(curSource).isDirectory()) {
        // 递归复制子文件夹
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        // 复制文件
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

/**
 * 压缩目录为 zip 文件
 * @param {string} sourceDir 源目录路径
 * @param {string} outPath 输出 zip 文件路径
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, path.basename(sourceDir))
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => {
      console.log(`压缩包大小: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      resolve();
    });

    archive.finalize();
  });
}
