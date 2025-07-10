/* import fs from 'fs';
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
 */

import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const dirs = ['logs', 'downloads'];

  console.log('⏳ Global setup starting...');
  console.log('Working directory:', process.cwd());

  for (const dir of dirs) {
    const fullPath = path.join(process.cwd(), dir);
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${fullPath}`);
      } else {
        console.log(`ℹ️ Directory already exists: ${fullPath}`);
      }

      // Проверим, можно ли туда записать
      const testFile = path.join(fullPath, 'test.txt');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✍️ Write test passed for: ${fullPath}`);
    } catch (error) {
      console.error(`❌ Error handling directory ${fullPath}:`, error);
    }
  }

  console.log('✅ Global setup complete.');
}

export default globalSetup;
