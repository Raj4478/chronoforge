import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/time-card-calculator',
  '/work-hours-calculator',
  '/time-clock-calculator',
  '/overtime-hours-calculator',
  '/guides',
];

test.describe('ChronoForge smoke tests', () => {
  for (const route of routes) {
    test(`${route} loads without a server error`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `No response for ${route}`).not.toBeNull();
      expect(response!.status(), `${route} returned ${response!.status()}`).toBeLessThan(400);
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('homepage has a usable document title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ChronoForge/i);
  });
});
