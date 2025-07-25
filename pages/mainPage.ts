import { Page, Locator } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly baseUrl: string;
  readonly menuCategories: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuCategories = page.getByRole('link', { name: 'Categories' });
  }

  async goTo(path: string = '/') {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async goToMenuCategory(name: string) {
    await this.menuCategories.hover();
    await this.page
      .locator('a.popup_menu_item', { hasText: new RegExp(`^\\s*${name}\\s*$`) })
      .click();
  }
}
