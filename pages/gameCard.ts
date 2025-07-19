import { Page, Locator } from '@playwright/test';

export class GameCard {
  readonly page: Page;
  readonly gameCardLocator: Locator;
  readonly discountStrLocator: string;
  readonly priceStrLocator: string;
  readonly titleStrLocator: string;

  constructor(page: Page) {
    this.page = page;
    this.gameCardLocator = page.locator('.gASJ2lL_xmVNuZkWGvrWg');
    this.discountStrLocator = '.cnkoFkzVCby40gJ0jGGS4';
    this.priceStrLocator = '._3j4dI1yA7cRfCvK8h406OB:has-text("$")';
    this.titleStrLocator = 'a[href*="/app/"]:has(.StoreSaleWidgetTitle)';
  }

  getGameCard(textContent: string) {
    return this.gameCardLocator.filter({ hasText: textContent }).first();
  }
}
