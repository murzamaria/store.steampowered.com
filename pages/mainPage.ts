import { Page, Locator } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly menuCategories: Locator;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = process.env.BASE_URL!;
    this.menuCategories = page.getByRole('link', { name: 'Categories' });
  }

  async goTo(path: string = '/') {
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  async goToMenuCategory(name: string) {
    await this.menuCategories.hover();
    await this.page
      .locator('a.popup_menu_item', { hasText: new RegExp(`^\\s*${name}\\s*$`) })
      .click();
  }
}
