import { expect, test, Page } from '@playwright/test';
import { MainPage } from '../pages/mainPage';
import { CategoryPage } from '../pages/categoryPage';
import { GamePage } from '../pages/gamePage';
import { GameCard } from '../pages/gameCard';
import { AgeCheckPage } from '../pages/ageCheckPage';
import { getMaxValue } from '../utils/getMaxValue';
import { timeStamp } from '../utils/timeStamp';
import { InstallSteamPage } from '../pages/installSteamPage';
import path from 'path';
import fs from 'fs';

test('Download most discounted Steam game', async ({ page, context, baseURL }) => {
  const mainPage = new MainPage(page);
  const categoryPage = new CategoryPage(page);
  const gameCard = new GameCard(page);
  const ageCheckPage = new AgeCheckPage(page);

  await test.step('Go to main page', async () => {
    await mainPage.goTo();
  });

  await test.step('Open category', async () => {
    await mainPage.goToMenuCategory('Action');
    await expect(page).toHaveURL(`${baseURL}/category/action/`, { timeout: 20000 });
  });
  await test.step('Open New & Trending tab', async () => {
    await page.waitForLoadState('networkidle');
    await page.mouse.wheel(0, 3000);
    await categoryPage.newAndTrendingTabLocator.click();
  });

  await test.step('Make sure all game cards loaded', async () => {
    await page.mouse.wheel(0, 800);
    await expect(gameCard.gameCardLocator).toHaveCount(12);
  });

  let discount;
  let price;
  let titleLocator;
  let newPage: Page;

  await test.step('Find the max discount', async () => {
    const discountElements = await gameCard.gameCardLocator
      .locator(gameCard.discountStrLocator)
      .all();
    discount = await getMaxValue(discountElements);
  });

  await test.step('Game selection logic', async () => {
    if (discount != null) {
      await test.step('Get the game title locator with max discount & Save its price', async () => {
        const card = gameCard.getGameCard(discount);
        titleLocator = card.locator(gameCard.titleStrLocator);
        price = await card.locator(gameCard.priceStrLocator).textContent();
      });
    } else {
      await test.step('Find the max price & Get the game title locator', async () => {
        const pricesElements = await gameCard.gameCardLocator
          .locator(gameCard.priceStrLocator)
          .all();
        price = await getMaxValue(pricesElements);
        const card = gameCard.getGameCard(price);
        titleLocator = card.locator(gameCard.titleStrLocator);
      });
    }
  });
  await test.step('Go to the game page', async () => {
    [newPage] = await Promise.all([context.waitForEvent('page'), titleLocator.click()]);
    await newPage.waitForLoadState('domcontentloaded');
  });

  await test.step('Process the age check if it appeared', async () => {
    const url = newPage.url();
    if (url.includes('agecheck')) {
      await ageCheckPage.dayBox.selectOption('1');
      await ageCheckPage.monthBox.selectOption('12');
      await ageCheckPage.yearBox.selectOption('2000');
      await ageCheckPage.viewPageButton.click();
    }
    await expect(newPage.locator('#appHubAppName')).toBeVisible();
  });

  const gamePage = new GamePage(newPage!);

  await test.step('Check the price and discount of the selected game', async () => {
    if (discount != null) {
      await expect(gamePage.gameDiscount).toContainText(discount);
      await expect(gamePage.gameFinalPrice).toContainText(price);
    } else {
      await expect(gamePage.gamePrice).toHaveText(price);
    }
  });

  let download;
  const installSteamPage = new InstallSteamPage(newPage!);

  await test.step('Open Install Steam page & Start download', async () => {
    await gamePage.installSteamButton.click();
    const downloadPromise = newPage.waitForEvent('download');
    await installSteamPage.installButton.click();
    download = await downloadPromise;
  });

  let suggestedName;
  let savePath;
  await test.step('Save the file & Check existing', async () => {
    suggestedName = download.suggestedFilename();
    savePath = path.join(process.cwd(), 'downloads', suggestedName);
    await download.saveAs(savePath);
    expect(fs.existsSync(savePath)).toBeTruthy();
  });

  await test.step('Rename downloaded file by adding timestamp', async () => {
    timeStamp(savePath);
  });
});
