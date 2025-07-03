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

test('Select most discounted game and verify Steam download', async ({ page, context }) => {
  const mainPage = new MainPage(page);
  const categoryPage = new CategoryPage(page);
  const gameCard = new GameCard(page);
  const ageCheckPage = new AgeCheckPage(page);

  await test.step('Go to main page', async () => {
    await mainPage.goTo();
  });

  await test.step('Open category', async () => {
    await mainPage.goToMenuCategory('Action');
    await expect(page).toHaveURL(`${mainPage.baseUrl}/category/action/`, { timeout: 20000 });
  });
  await test.step('Open New & Trending tab', async () => {
    await page.waitForLoadState('networkidle');
    if (test.info().project.name === 'firefox') {
      await page.evaluate(() => {
        window.scrollBy(0, 4000);
      });
    } else {
      await page.mouse.wheel(0, 3000);
    }
    await categoryPage.newAndTrendingTabLocator.click();
    await page.waitForTimeout(5000);
  });

  let discount: number;
  let price: number;
  let titleLocator;
  let card;
  let newPage: Page; //страница с игрой открывается в новой вкладке браузера

  await test.step('Find the max discount', async () => {
    const discountElements = await gameCard.discountLocator.all();
    discount = await getMaxValue(discountElements);
  });

  await test.step('Game selection logic', async () => {
    if (discount != 0) {
      await test.step('Get the game title locator with max discount & Save its price', async () => {
        titleLocator = await gameCard.returnTitleLocatorByDiscount(discount);
        card = await gameCard.returnGameCardLocator(titleLocator);
        price = await gameCard.getPriceByGameCard(card);
      });

      await test.step('Go to the game page', async () => {
        [newPage] = await Promise.all([context.waitForEvent('page'), titleLocator.click()]);
        await newPage.waitForLoadState('domcontentloaded');
      });
    } else {
      await test.step('Find the max price & Get the game title locator', async () => {
        const pricesElements = await gameCard.priceLocator.all();
        price = await getMaxValue(pricesElements);
        titleLocator = await gameCard.returnTitleLocatorByPrice(price);
      });
      await test.step('Go to the game page', async () => {
        [newPage] = await Promise.all([context.waitForEvent('page'), titleLocator.click()]);
        await newPage.waitForLoadState('domcontentloaded');
      });
    }
  });

  await test.step('Process the age check if it appeared', async () => {
    const url = page.url();
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
    if (discount != 0) {
      await expect(gamePage.gameDiscount).toContainText(`-${discount}%`);
      await expect(gamePage.gameFinalPrice).toContainText(`$${price}`);
    } else {
      await expect(gamePage.gamePrice).toHaveText(`$${price}`);
    }
  });

  let download;
  const installSteamPage = new InstallSteamPage(newPage!);

  await test.step('Open Install Steam page & Start download', async () => {
    await gamePage.installSteamButton.click({ timeout: 5000 });
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
