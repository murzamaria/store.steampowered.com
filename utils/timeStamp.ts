import fs from 'fs';
import path from 'path';

export function timeStamp(filePath: string): string {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const timestamp = Date.now();

  const newFileName = `${base}_${timestamp}${ext}`;
  const newFilePath = path.join(dir, newFileName);

  fs.renameSync(filePath, newFilePath);
  return newFilePath;
}
