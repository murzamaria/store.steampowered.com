import { expect, Locator } from '@playwright/test';

export async function getMaxValue(array: Locator[]) {
  let max = 0;
  let maxText: string | null = null;
  for (const el of array) {
    await expect(el).toBeVisible();
    const text = await el.textContent();
    const num = text!.replace(/[^\d.]/g, '');
    if (num) {
      const value = parseFloat(num);
      if (value > max) {
        max = value;
        maxText = text;
      }
    }
  }
  return maxText;
}
