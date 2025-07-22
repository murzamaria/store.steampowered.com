import { Page, Locator } from '@playwright/test';

export class FilterMenu {
  readonly page: Page;
  readonly filterName: Locator;
  readonly filterOption: Locator;
  readonly showMoreButton: Locator;
  readonly filterContainer: Locator;
  readonly selectedFilterBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterContainer = page.locator('.Qa8BXBnhFcu7QgSy5RqD');
    this.filterName = page.locator('._3Jg7mwjxVKjnATI6MUQiGK');
    this.filterOption = page.locator('._2uSEnLjFPyX4-yugJ6ZaEt');
    this.showMoreButton = page.locator('._2b0ptP1NNBI0nXI0jsLlSO', { hasText: 'Show More' });
    this.selectedFilterBox = page.locator('._2XgkK2m_01lZYUuqv34NBt');
  }

  async setTheFilter(filter: string, option: string) {
    const filterLocator = this.filterName.getByText(filter, { exact: true });
    const container = await this.filterContainer.filter({ has: filterLocator });
    await filterLocator.click();
    await container.locator(this.showMoreButton).click();
    await container.locator(this.filterOption).getByText(option, { exact: true }).click();
  }
}
