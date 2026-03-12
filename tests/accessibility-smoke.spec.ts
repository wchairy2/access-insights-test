import { expect, test, type Page } from '@playwright/test';

async function gotoIndex(page: Page): Promise<void> {
  // Keep smoke tests focused on DOM/accessibility semantics and avoid waiting on full subresource load.
  await page.goto('/test/index.html', { waitUntil: 'domcontentloaded' });
}

test.describe('Accessibility smoke checks', () => {
  test('heading hierarchy is valid and sequential', async ({ page }) => {
    await gotoIndex(page);

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((els) =>
      els.map((el) => Number(el.tagName.slice(1)))
    );

    const h1Count = headings.filter((level) => level === 1).length;
    expect(h1Count).toBeGreaterThan(0);

    for (let i = 1; i < headings.length; i += 1) {
      expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('header navigation links point to real section anchors', async ({ page }) => {
    await gotoIndex(page);

    const navHrefs = await page.locator('#nav-menu a[href^="#"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')).filter(Boolean)
    );

    for (const href of navHrefs) {
      const id = href.slice(1);
      const target = page.locator(`[id="${id}"]`);
      await expect(target, `Missing anchor target for ${href}`).toHaveCount(1);
    }
  });

  test('keyboard users can skip to main content', async ({ page }) => {
    await gotoIndex(page);

    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('mobile menu supports keyboard open, loop, and escape close', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoIndex(page);

    const hamburger = page.locator('#hamburger');
    const menu = page.locator('#nav-menu');

    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press('Tab');
      if (await hamburger.evaluate((el) => el === document.activeElement)) break;
    }
    await expect(hamburger).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#nav-menu a').first()).toBeFocused();

    const linkCount = await page.locator('#nav-menu a').count();
    for (let i = 0; i < linkCount; i += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(page.locator('#nav-menu a').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
    await expect(hamburger).toBeFocused();
  });

  test('invalid form submission focuses first invalid input and shows messages', async ({ page }) => {
    await gotoIndex(page);

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('button.btn-submit').click();

    const firstName = page.locator('#fname');
    await expect(firstName).toBeFocused();
    await expect(firstName).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#fname-err')).toBeVisible();
    await expect(page.locator('#form-status')).toContainText('Please fix the highlighted fields');
  });
});
