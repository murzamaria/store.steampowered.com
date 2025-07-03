import { Locator } from '@playwright/test';

export async function getMaxValue(array: Locator[]) {
  let max = 0;
  for (const el of array) {
    const text = await el.textContent();
    const num = text!.replace(/[^\d.]/g, '');
    if (num) {
      const value = parseFloat(num);
      if (value > max) {
        max = value;
      }
    }
  }
  return max;
}
