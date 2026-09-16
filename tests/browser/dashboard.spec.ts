import { test, expect } from '@playwright/test';
test('dashboard data, panels and filters work without horizontal overflow', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('link', { name: /KALANAG/ }).click();
  await expect(page.getByText('25.6 km', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (info.project.name === 'mobile') await page.getByRole('tab', { name: 'gear', exact: true }).click();
  await page.getByRole('button', { name: 'Expand details' }).click();
  await expect(page.getByText('Garmin Instinct 2X Solar', { exact: true })).toBeVisible();
  await page.screenshot({ path: `test-results/${info.project.name}-expanded.png` });
  await page.getByRole('button', { name: 'clothing', exact: true }).click();
  await expect(page.getByText('Garmin Instinct 2X Solar', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reduce details' }).click();
  await page.getByRole('button', { name: 'Expand details' }).click();
  await expect(page.getByText('Garmin Instinct 2X Solar', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Hide details' }).click();
  await expect(page.getByRole('button', { name: 'Show details' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'clothing', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Show details' }).click();
  if (info.project.name === 'mobile') {
    await page.getByRole('tab', { name: 'route', exact: true }).click();
    await page.getByRole('button', { name: /Kalanag Summit/ }).click();
    await expect(page.getByRole('button', { name: 'Show details' })).toBeVisible();
  }
});

test('invalid data shows a useful error', async ({ page }, info) => {
  await page.route('**/data/kalanag/route-waypoints.json', route => route.fulfill({ json: { waypoints: [] } }));
  await page.goto('/kalanag/');
  await expect(page.getByText(/ROUTE DATA UNAVAILABLE:/)).toBeVisible();
});

test('viewport changes keep details usable', async ({ page }) => {
  await page.goto('/kalanag/');
  for (const size of [{ width: 320, height: 568 }, { width: 844, height: 390 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Hide details' })).toBeInViewport();
  }
});

test('planning route distinguishes the supplied approach from the unknown climb', async ({ page }) => {
  await page.goto('/kalanag/');
  await expect(page.getByText('Planning overview · not for navigation', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Kyarkoti area/ })).toBeVisible();
  await expect(page.getByText('25.6 km', { exact: true })).toBeVisible();
});
