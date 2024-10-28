// @ts-check
import { test } from '@playwright/test';
import { takeScreenshots } from './utils/screenshot';

test('capture homepage at all screen sizes', async ({ page }) => {
  await page.goto('/');
  await takeScreenshots(page, 'homepage');
});