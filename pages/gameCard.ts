import { Page, Locator } from '@playwright/test';

export class GameCard {
  readonly page: Page;
  readonly gameCardLocator: Locator;
  readonly titleLocator: Locator;
  readonly discountLocator: Locator;
  readonly priceLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gameCardLocator = page.locator('.gASJ2lL_xmVNuZkWGvrWg');
    this.titleLocator = this.gameCardLocator.locator('.StoreSaleWidgetTitle');
    this.discountLocator = this.gameCardLocator.locator('.cnkoFkzVCby40gJ0jGGS4');
    this.priceLocator = this.gameCardLocator
      .locator('._3j4dI1yA7cRfCvK8h406OB')
      .filter({ hasText: '$' });
  }

  async returnGameCardLocator(anyLocator: Locator) {
    const gameCardLocator = await anyLocator.locator(
      'xpath=ancestor::div[contains(@class,"gASJ2lL_xmVNuZkWGvrWg")]',
    );
    return gameCardLocator;
  }

  async returnTitleLocatorByDiscount(discount: number) {
    let targetTitle: Locator | undefined;
    const titles = await this.page.locator('.StoreSaleWidgetTitle').all();

    for (const title of titles) {
      const card = await this.returnGameCardLocator(title);
      const cardDiscount = card.getByText(new RegExp(`-${discount}%`));

      if ((await cardDiscount.count()) > 0) {
        targetTitle = title;
        break;
      }
    }

    return targetTitle;
  }

  async returnTitleLocatorByPrice(price: number) {
    let targetTitle: Locator | undefined;

    const titles = await this.page.locator('.StoreSaleWidgetTitle').all();
    for (const title of titles) {
      const card = await this.returnGameCardLocator(title);
      const cardPrice = card.getByText(new RegExp(`\\$${price}`));

      if ((await cardPrice.count()) > 0) {
        targetTitle = title;
        break;
      }
    }

    return targetTitle;
  }

  async getPriceByGameCard(card: Locator) {
    const priceText = await card.locator('._3j4dI1yA7cRfCvK8h406OB').textContent();
    const cleaned = priceText!.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  }
}
