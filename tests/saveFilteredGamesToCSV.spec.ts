import { expect, test } from '@playwright/test';
import { MainPage } from '../pages/mainPage';
import { CategoryPage } from '../pages/categoryPage';
import { scrollToElementWithKeyboard } from '../utils/scrollToElementWithKeybord';
import { FilterMenu } from '../pages/filterMenu';
import { GameCard } from '../pages/gameCard';
import { GamePage } from '../pages/gamePage';
import { escapeCSV } from '../utils/escapeCSV';
import { timeStamp } from '../utils/timeStamp';
import { AgeCheckPage } from '../pages/ageCheckPage';
import * as fs from 'fs';
import * as path from 'path';

test('Filter games & Save Names and Planned Release Dates to CSV', async ({
  page,
  baseURL,
  context,
}) => {
  test.setTimeout(150000);
  const mainPage = new MainPage(page);
  const categoryPage = new CategoryPage(page);
  const filterMenu = new FilterMenu(page);
  const gameCard = new GameCard(page);

  await test.step('Go to main page', async () => {
    await mainPage.goTo();
  });
  await test.step('Open category', async () => {
    await mainPage.goToMenuCategory('Action RPG');
    await expect(page).toHaveURL(`${baseURL}/category/rpg_action/`, { timeout: 20000 });
    await expect(categoryPage.categoryTitle).toBeVisible({ timeout: 15000 });
  });

  await test.step('Open Popular upcoming tab', async () => {
    await scrollToElementWithKeyboard(page, categoryPage.popularUpcomingTabLocator);
    await categoryPage.popularUpcomingTabLocator.click();
  });

  await test.step('Make sure all game cards loaded', async () => {
    await page.mouse.wheel(0, 800);
    await expect(gameCard.gameCardLocator).toHaveCount(12);
  });

  await test.step('Filter by Genre', async () => {
    await filterMenu.setTheFilter('Genres', 'Arcade');
  });
  await test.step('Filter by Players', async () => {
    await filterMenu.setTheFilter('Players', 'Singleplayer');
  });
  await test.step('Check filters', async () => {
    await expect(filterMenu.selectedFilterBox.first()).toContainText('Arcade');
    await expect(filterMenu.selectedFilterBox.nth(1)).toContainText('Singleplayer');
  });
  await test.step('Open games full list with Show more button', async () => {
    await categoryPage.showMoreGamecardsButton.click();
    await expect(gameCard.gameCardLocator.nth(12)).toBeVisible();
  });

  await test.step('Collect Name and Planned Release Date for each game', async () => {
    const data: string[][] = [['game name', 'planned release date']];
    await test.step('Saving data from each game page', async () => {
      const count = await gameCard.gameCardLocator.count();

      let newPage;
      for (let i = 0; i < count; i++) {
        let name;
        let date;
        await test.step('Open game page', async () => {
          const title = gameCard.gameCardLocator.nth(i).locator(gameCard.titleStrLocator);
          await title.scrollIntoViewIfNeeded({ timeout: 10000 });
          try {
            await title.hover({ timeout: 2000 });
          } catch (err) {
            await page.mouse.wheel(0, 500);
            await page.waitForTimeout(500);
            await title.scrollIntoViewIfNeeded();
            await title.hover();
          }

          [newPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 10000 }),
            title.click({ force: true }),
          ]);
          await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
        });

        const gamePage = new GamePage(newPage);

        await test.step('Process the age check if it appeared', async () => {
          const ageCheckPage = new AgeCheckPage(newPage);
          const url = newPage.url();
          if (url.includes('agecheck')) {
            await expect(ageCheckPage.dayBox).toBeVisible({ timeout: 10000 });
            await ageCheckPage.dayBox.selectOption('1');
            await ageCheckPage.monthBox.selectOption('12');
            await ageCheckPage.yearBox.selectOption('2000');
            await ageCheckPage.viewPageButton.click();
          }
        });

        await test.step('Save Name and Planned Release Date', async () => {
          await expect(gamePage.gameName).toBeVisible({ timeout: 10000 });
          name = await gamePage.gameName.textContent();
          if (await gamePage.plannedReleaseDate.isVisible({ timeout: 10000 })) {
            date = await gamePage.plannedReleaseDate.textContent();
          } else if (await gamePage.comingDate.isVisible({ timeout: 10000 })) {
            date = await gamePage.comingDate.textContent();
          }
        });

        await test.step('Add data to array', async () => {
          data.push([name?.trim(), date?.trim()]);
        });

        await newPage.close();
      }
    });
    let savePath;
    await test.step('Prepare CSV & Save file', async () => {
      const csvContent = data.map((row) => row.map(escapeCSV).join(',')).join('\n');
      const filePath = path.resolve(__dirname, '../results/games.csv');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, csvContent, 'utf8');
      savePath = timeStamp(filePath);
    });

    await test.step('Make sure the file saved', async () => {
      expect(fs.existsSync(savePath)).toBeTruthy();
    });
  });
});
