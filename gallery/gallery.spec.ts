import { expect, test } from '@playwright/test';

test('renders the component gallery in both themes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Studio UI' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Foundations' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Primitives' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Workbench' })).toBeVisible();

  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-studio-theme', 'light');
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot('gallery-light-1440.png', { animations: 'disabled', maxDiffPixelRatio: 0.01 });

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-studio-theme', 'dark');
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot('gallery-dark-1440.png', { animations: 'disabled', maxDiffPixelRatio: 0.01 });
});

test('opens modal, confirmation, and toast surfaces', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open modal' }).click();
  await expect(page.getByRole('dialog', { name: 'Component modal' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Open confirmation' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete component?' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.getByRole('button', { name: 'Show toast' }).click();
  await expect(page.getByText('Component saved')).toBeVisible();
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
  test(`keeps gallery usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    if (viewport.width > 1180) {
      await expect(page.getByRole('complementary', { name: 'Details' })).toBeVisible();
    }
    await expect(page).toHaveScreenshot(`gallery-${viewport.width}.png`, { animations: 'disabled', maxDiffPixelRatio: 0.01 });
  });
}
