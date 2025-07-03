import { Page, Locator } from '@playwright/test';

export class AgeCheckPage {
  readonly page: Page;
  readonly dayBox: Locator;
  readonly monthBox: Locator;
  readonly yearBox: Locator;
  readonly viewPageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dayBox = page.locator('#ageDay');
    this.monthBox = page.locator('#ageMonth');
    this.yearBox = page.locator('#ageYear');
    this.viewPageButton = page.locator('#view_product_page_btn');
  }
}
