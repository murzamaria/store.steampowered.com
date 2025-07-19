import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;
  readonly categoryTitle: Locator;
  readonly allTabLocator: Locator;
  readonly newAndTrendingTabLocator: Locator;
  readonly topSellersTabLocator: Locator;
  readonly topRatedTabLocator: Locator;
  readonly popularDiscountedTabLocator: Locator;
  readonly popularUpcomingTabLocator: Locator;
  readonly showMoreGamecardsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryTitle = page.locator('.ContentHubTitle');
    this.allTabLocator = page.getByRole('button', { name: 'All' });
    this.newAndTrendingTabLocator = page.getByRole('button', { name: 'New & Trending' });
    this.topSellersTabLocator = page.getByRole('button', { name: 'Top Sellers' });
    this.topRatedTabLocator = page.getByRole('button', { name: 'Top Rated' });
    this.popularDiscountedTabLocator = page.getByRole('button', { name: 'Popular Discounted' });
    this.popularUpcomingTabLocator = page.getByRole('button', { name: 'Popular Upcoming' });
    this.showMoreGamecardsButton = page
      .locator('._3EdZTDIisUpowxwm6uJ7Iq')
      .getByRole('button', { name: 'Show more' });
  }
}
