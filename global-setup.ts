import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const dirs = ['logs', 'downloads'];

  for (const dir of dirs) {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  }
}

export default globalSetup;
