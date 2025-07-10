import { Page, Locator } from '@playwright/test';

export class InstallSteamPage {
  readonly page: Page;
  readonly installButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.installButton = page.locator('.about_install_steam_link').nth(0);
  }
}
