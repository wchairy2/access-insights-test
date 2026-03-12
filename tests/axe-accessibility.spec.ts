import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Automated accessibility scan', () => {
  test('draft page has no critical axe violations', async ({ page }) => {
    await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, results.violations.map((v) => v.id).join(', ')).toEqual([]);
  });
});
