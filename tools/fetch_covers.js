const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CHANNEL_URL = "https://www.youtube.com/@eclipse_kpop";
const OUTPUT_FILE = path.join(__dirname, '..', 'frontend', 'src', 'content', 'work.ts');
const YT_DLP_PATH = 'C:\\Users\\chrap\\AppData\\Roaming\\Python\\Python313\\Scripts\\yt-dlp.exe'; 

console.log("Fetching video metadata from ECLIPSE Kpop channel...");

const yt = spawn(YT_DLP_PATH, ['--dump-json', '--playlist-end', '150', CHANNEL_URL]);

const rl = readline.createInterface({
  input: yt.stdout,
  terminal: false
});

const videos = [];

rl.on('line', (line) => {
  if (!line) return;
  try {
    const data = JSON.parse(line);
    const desc = data.description || "";
    const year = data.upload_date ? data.upload_date.substring(0, 4) : "";
    
    if (parseInt(year) >= 2023) {
      const lowerDesc = desc.toLowerCase();
      if (lowerDesc.includes('@atelierbill') || lowerDesc.includes('@bill.io88') || lowerDesc.includes('bill.io88')) {
        videos.push(data);
      }
    }
  } catch (e) {
    // ignore parse errors for partial lines
  }
});

yt.on('close', (code) => {
  console.log(`Found ${videos.length} videos matching the criteria.`);

  let tsContent = `export interface Project {
  id: string;
  title: string;
  year: string;
  clientOrArtist: string;
  description?: string;
  youtubeId: string;
  thumbnail: string;
  featured: boolean;
  credits: string[];
}

export const projects: Project[] = [
`;

  videos.forEach((v, index) => {
    tsContent += `  {
    id: "eclipse-cover-${index + 1}",
    title: ${JSON.stringify(v.title)},
    year: ${JSON.stringify(v.upload_date ? v.upload_date.substring(0, 4) : "2023")},
    clientOrArtist: "ECLIPSE",
    youtubeId: "${v.id}",
    thumbnail: "https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg",
    featured: ${index < 4 ? "true" : "false"}, // Feature the most recent 4
    credits: ["Director/Videographer: Bill", "Artist: ECLIPSE"],
  },
`;
  });

  tsContent += `];\n`;

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`Successfully updated ${OUTPUT_FILE}`);
});

yt.on('error', (err) => {
  console.error("Failed to start yt-dlp:", err);
});
