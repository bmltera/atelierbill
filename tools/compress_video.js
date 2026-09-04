const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findFfmpeg() {
  // 1. Try system PATH
  try {
    const cmd = process.platform === 'win32' ? 'where ffmpeg' : 'which ffmpeg';
    const found = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim().split('\r\n')[0];
    if (found && fs.existsSync(found)) return found;
  } catch (e) {}

  // 2. Check WinGet Gyan.FFmpeg location on Windows
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    const wingetPackagesDir = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages');
    if (fs.existsSync(wingetPackagesDir)) {
      const walk = (dir) => {
        try {
          const files = fs.readdirSync(dir, { withFileTypes: true });
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
              const res = walk(fullPath);
              if (res) return res;
            } else if (file.name.toLowerCase() === 'ffmpeg.exe') {
              return fullPath;
            }
          }
        } catch (e) {}
        return null;
      };
      const foundInWinGet = walk(wingetPackagesDir);
      if (foundInWinGet) return foundInWinGet;
    }
  }

  return 'ffmpeg';
}

async function run() {
  const ffmpegPath = findFfmpeg();
  console.log(`[Video Optimizer] Using FFmpeg from: ${ffmpegPath}`);

  const workspaceRoot = path.resolve(__dirname, '..');
  const inputPath = path.join(workspaceRoot, 'frontend', 'public', 'video.mp4');
  const tempOutputPath = path.join(workspaceRoot, 'frontend', 'public', 'video.optimized.mp4');

  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Input video not found at: ${inputPath}`);
    process.exit(1);
  }

  const originalStats = fs.statSync(inputPath);
  const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
  console.log(`[Input] ${inputPath} (${originalSizeMB} MB)`);

  const durationSec = 15;
  const targetHeight = 1080;

  // FFmpeg parameters:
  // -y: overwrite output
  // -ss 0: start at beginning
  // -t 15: duration 15s
  // -i input
  // -vf "scale=-2:1080": 1080p height, preserving aspect ratio and ensuring even width
  // -c:v libx264: H.264
  // -profile:v high -level 4.1: wide web & mobile compatibility
  // -pix_fmt yuv420p: universally supported color format
  // -crf 23: high visual quality for web video background
  // -preset slow: better compression efficiency
  // -movflags +faststart: relocate moov atom to start of file for immediate web streaming
  // -an: remove audio track (hero background is muted)
  const args = [
    '-y',
    '-ss', '00:00:00',
    '-t', String(durationSec),
    '-i', inputPath,
    '-vf', `scale=-2:${targetHeight}`,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.1',
    '-pix_fmt', 'yuv420p',
    '-crf', '23',
    '-preset', 'slow',
    '-movflags', '+faststart',
    '-an',
    tempOutputPath
  ];

  console.log(`[Encoding] Truncating to ${durationSec}s, scaling to ${targetHeight}p, optimizing with libx264 + faststart...`);
  console.log(`Command: ${ffmpegPath} ${args.join(' ')}`);

  const startTime = Date.now();
  const ffmpeg = spawn(ffmpegPath, args);

  ffmpeg.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    const timeMatch = text.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
    const fpsMatch = text.match(/fps=\s*(\d+(\.\d+)?)/);
    const speedMatch = text.match(/speed=\s*(\d+(\.\d+)?x)/);
    if (timeMatch) {
      process.stdout.write(`\rTranscoding progress: time=${timeMatch[1]} fps=${fpsMatch ? fpsMatch[1] : '?'} speed=${speedMatch ? speedMatch[1] : '?'}`);
    }
  });

  ffmpeg.on('close', (code) => {
    console.log('\n');
    if (code !== 0) {
      console.error(`[Error] FFmpeg exited with code ${code}`);
      process.exit(code);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const newStats = fs.statSync(tempOutputPath);
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
    const savingsPercent = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);

    console.log(`[Success] Video optimized in ${elapsed}s!`);
    console.log(`Original size: ${originalSizeMB} MB`);
    console.log(`New size:      ${newSizeMB} MB (${savingsPercent}% reduction)`);

    // Replace original video with optimized video
    fs.renameSync(tempOutputPath, inputPath);
    console.log(`[Updated] Replaced ${inputPath} with the optimized 1080p 15s web video.`);
  });

  ffmpeg.on('error', (err) => {
    console.error('[Error] Failed to launch FFmpeg:', err);
    process.exit(1);
  });
}

run();
