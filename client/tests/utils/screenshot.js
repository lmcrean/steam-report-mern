// @ts-check
import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Tailwind breakpoints
export const screens = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

/**
 * Takes screenshots at different viewport widths
 * @param {import('@playwright/test').Page} page
 * @param {string} pageName - Name of the page being tested
 */
export async function takeScreenshots(page, pageName) {
  // Ensure page-specific screenshots directory exists
  const screenshotDir = path.join(process.cwd(), 'screenshots', pageName);
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  } else {
    // Clean existing screenshots in this directory
    const files = fs.readdirSync(screenshotDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(screenshotDir, file));
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Take screenshots at each breakpoint
  for (const [size, width] of Object.entries(screens)) {
    await page.setViewportSize({
      width,
      height: Math.floor(width * 0.8)
    });

    const filename = `${size}-${width}px-${timestamp}.png`;
    await page.screenshot({
      path: path.join(screenshotDir, filename),
      fullPage: true
    });

    console.log(`📸 Captured ${pageName} at ${width}px (${size})`);
  }
}