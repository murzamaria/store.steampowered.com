import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;
  readonly allTabLocator: Locator;
  readonly newAndTrendingTabLocator: Locator;
  readonly topSellersTabLocator: Locator;
  readonly topRatedTabLocator: Locator;
  readonly popularDiscountedTabLocator: Locator;
  readonly popularUpcomingTabLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allTabLocator = page.getByRole('button', { name: 'All' });
    this.newAndTrendingTabLocator = page.getByRole('button', { name: 'New & Trending' });
    this.topSellersTabLocator = page.getByRole('button', { name: 'Top Sellers' });
    this.topRatedTabLocator = page.getByRole('button', { name: 'Top Rated' });
    this.popularDiscountedTabLocator = page.getByRole('button', { name: 'Popular Discounted' });
    this.popularUpcomingTabLocator = page.getByRole('button', { name: 'Popular Upcoming' });
  }
}
