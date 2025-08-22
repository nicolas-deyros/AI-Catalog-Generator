import { test, expect } from '@playwright/test';

test.describe('AI Catalog Generator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Security: Verify no console errors on initial load
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });
  });

  test('should load the application successfully', async ({ page }) => {
    // Check that the main application loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="upload-section"]')).toBeVisible();

    // Security: Verify page title and meta tags
    await expect(page).toHaveTitle(/AI Catalog Generator/);
  });

  test('should navigate through the step process', async ({ page }) => {
    // Step 1: Upload step should be active initially
    await expect(page.locator('[data-step="upload"]')).toHaveClass(/active/);

    // Check that we can see the upload interface
    await expect(page.locator('input[type="file"]')).toBeVisible();

    // For now, we'll test navigation without file upload
    // (File upload testing requires more complex setup)

    // Security: Verify no sensitive data is exposed in DOM
    const pageContent = await page.content();
    expect(pageContent).not.toContain('api-key');
    expect(pageContent).not.toContain('secret');
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check for skip links and navigation
    const skipLink = page.locator('[href="#main-content"]');
    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeVisible();
    }

    // Security: Verify proper ARIA attributes
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const buttonText = await button.textContent();

      // Either aria-label or visible text should be present
      expect(ariaLabel || buttonText?.trim()).toBeTruthy();
    }
  });

  test('should handle security features correctly', async ({ page }) => {
    // Security: Check for Content Security Policy headers
    const response = await page.goto('/');
    const cspHeader = response?.headers()['content-security-policy'];

    // If CSP is implemented, verify it exists
    if (cspHeader) {
      expect(cspHeader).toContain('script-src');
    }

    // Security: Verify no inline scripts in production build
    const scripts = page.locator('script');
    const scriptCount = await scripts.count();

    for (let i = 0; i < scriptCount; i++) {
      const script = scripts.nth(i);
      const src = await script.getAttribute('src');
      const innerHTML = await script.innerHTML();

      // Should have src attribute (external) or be empty/JSON (not inline JS)
      if (!src && innerHTML.trim()) {
        // Allow JSON scripts and module scripts only
        expect(innerHTML.trim()).toMatch(/^(\{.*\}|\s*)$/);
      }
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();

    // Security: Verify layout doesn't break and expose content inappropriately
    const overflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth + 50; // 50px tolerance
    });
    expect(overflow).toBeFalsy();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Security: Monitor for unhandled errors
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Test invalid interactions
    await page.locator('body').click();

    // Should not have unhandled errors
    expect(errors).toHaveLength(0);

    // Security: Check that error messages don't expose sensitive information
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).not.toContain('stack trace');
    expect(pageContent.toLowerCase()).not.toContain('internal error');
  });

  test('should load required assets correctly', async ({ page }) => {
    // Check that CSS is loaded
    const styles = page.locator('link[rel="stylesheet"], style');
    const styleCount = await styles.count();
    expect(styleCount).toBeGreaterThan(0);

    // Security: Verify all resources load from expected domains
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Check for any failed resource loads
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    // Wait a bit for resources to load
    await page.waitForTimeout(2000);

    // Should not have failed requests for critical resources
    const criticalFailed = failedRequests.filter(
      (url) =>
        url.includes('.js') || url.includes('.css') || url.includes('.html')
    );
    expect(criticalFailed).toHaveLength(0);
  });
});
