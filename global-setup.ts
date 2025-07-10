import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const downloadsDir = path.join(process.cwd(), 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
    console.log(`Created directory: ${downloadsDir}`);
  }
}

export default globalSetup;
