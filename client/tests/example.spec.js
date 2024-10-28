// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.getByText('Vite + React + Tailwind')).toBeVisible();
});

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/');
  
  // Click the dark mode toggle button
  await page.getByRole('button', { name: 'Toggle Dark Mode' }).click();

  // Verify dark mode is enabled
  const html = page.locator('html');
  await expect(html).toHaveClass(/dark/);
});

test('counter functionality', async ({ page }) => {
  await page.goto('/');

  // Test increment
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.locator('text=1')).toBeVisible();

  // Test decrement
  await page.getByRole('button', { name: '-' }).click();
  await expect(page.locator('text=0')).toBeVisible();

  // Test reset
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('text=0')).toBeVisible();
});