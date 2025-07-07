import { Page, Locator } from '@playwright/test';

export class GameCard {
  readonly page: Page;
  readonly gameCardLocator: Locator;
  readonly discountLocator: Locator;
  readonly priceLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gameCardLocator = page.locator('.gASJ2lL_xmVNuZkWGvrWg');
    this.discountLocator = this.gameCardLocator.locator('.cnkoFkzVCby40gJ0jGGS4');
    this.priceLocator = this.gameCardLocator
      .locator('._3j4dI1yA7cRfCvK8h406OB')
      .filter({ hasText: '$' });
  }

  getGameCard(textContent: string) {
    return this.gameCardLocator.filter({ hasText: textContent }).first();
  }

  getTitle(card: Locator) {
    return card.locator('.StoreSaleWidgetTitle');
  }
  getPrice(card: Locator) {
    return card.locator('._3j4dI1yA7cRfCvK8h406OB').filter({ hasText: '$' });
  }
}
