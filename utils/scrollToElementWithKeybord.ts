import { Locator, Page } from '@playwright/test';

export async function scrollToElementWithKeyboard(
  page: Page,
  locator: Locator,
  key: 'PageDown' | 'ArrowDown' = 'PageDown',
  maxScrolls = 15,
  timeout = 300,
) {
  for (let i = 0; i < maxScrolls; i++) {
    const isVisible = await locator.isVisible().catch(() => false);
    if (isVisible) return true;

    await page.keyboard.press(key);
    await page.waitForTimeout(timeout);
  }

  throw new Error('Element not found after scrolling');
}
