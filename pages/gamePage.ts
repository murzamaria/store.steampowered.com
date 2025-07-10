import { Page, Locator } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly gameName: Locator;
  readonly gameFinalPrice: Locator;
  readonly gamePrice: Locator;
  readonly gameDiscount: Locator;
  readonly installSteamButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gameName = page.locator('#appHubAppName');
    this.gameDiscount = page.locator('.discount_pct').first();
    this.gameFinalPrice = page.locator('.discount_final_price').first();
    this.gamePrice = page.locator('.game_purchase_price price');
    this.installSteamButton = page.getByText('Install Steam');
  }
}
