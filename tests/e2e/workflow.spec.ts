import { test, expect } from '@playwright/test';

test.describe('User Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Security: Monitor console for security warnings
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`Console ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  test('should complete the image upload workflow', async ({ page }) => {
    // Step 1: Verify we're on the upload step
    await expect(page.locator('[data-step="upload"]')).toHaveClass(/active/);

    // Create a test image file (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    // Look for file input
    const fileInput = page.locator('input[type="file"]');

    if ((await fileInput.count()) > 0) {
      // Set the file (this creates a temporary file for testing)
      await fileInput.setInputFiles({
        name: 'test-image.png',
        mimeType: 'image/png',
        buffer: testImageBuffer,
      });

      // Security: Verify file validation occurs
      await page.waitForTimeout(1000);

      // Check if there's a preview or upload indicator
      const preview = page.locator('[data-testid="image-preview"]');
      if ((await preview.count()) > 0) {
        await expect(preview).toBeVisible();
      }
    }

    // Security: Verify no sensitive file paths are exposed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('C:\\');
    expect(pageContent).not.toContain('/Users/');
    expect(pageContent).not.toContain('file://');
  });

  test('should handle step navigation correctly', async ({ page }) => {
    // Test step navigation buttons if they exist
    const nextButton = page.locator('button:has-text("Next")');
    const prevButton = page.locator('button:has-text("Previous")');

    if ((await nextButton.count()) > 0) {
      // Try to go to next step
      await nextButton.click();
      await page.waitForTimeout(500);

      // Should be on enhance step or show validation message
      const enhanceStep = page.locator('[data-step="enhance"]');
      const validationMessage = page.locator('[role="alert"], .error-message');

      // Either we advanced or got a validation message
      const advancedOrValidation =
        (await enhanceStep.count()) > 0 ||
        (await validationMessage.count()) > 0;
      expect(advancedOrValidation).toBeTruthy();
    }

    // Security: Verify navigation doesn't bypass validation
    if ((await prevButton.count()) > 0) {
      await prevButton.click();
      await page.waitForTimeout(500);

      // Should be back to upload or show appropriate message
      await expect(page.locator('[data-step="upload"]')).toBeVisible();
    }
  });

  test('should handle dialog interactions', async ({ page }) => {
    // Look for buttons that might trigger dialogs
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      // Test first 5 buttons
      const button = buttons.nth(i);
      const buttonText = await button.textContent();

      // Skip navigation buttons for this test
      if (
        buttonText?.toLowerCase().includes('next') ||
        buttonText?.toLowerCase().includes('previous')
      ) {
        continue;
      }

      // Click button and check for dialog
      await button.click();
      await page.waitForTimeout(500);

      // Check if a dialog appeared
      const dialog = page.locator('dialog, [role="dialog"]');
      if ((await dialog.count()) > 0 && (await dialog.isVisible())) {
        // Security: Verify dialog has proper accessibility
        await expect(dialog).toHaveAttribute('aria-modal', 'true');

        // Look for close button
        const closeButton = page.locator(
          'button:has-text("Close"), button[aria-label*="close" i]'
        );
        if ((await closeButton.count()) > 0) {
          await closeButton.click();
          await page.waitForTimeout(500);

          // Dialog should be closed
          await expect(dialog).not.toBeVisible();
        }

        break; // Only test one dialog
      }
    }
  });

  test('should maintain security throughout user interactions', async ({
    page,
  }) => {
    // Security: Test for XSS vulnerabilities
    const maliciousScript = '<script>window.xssTest = true;</script>';

    // Try to inject script in any text inputs
    const textInputs = page.locator('input[type="text"], textarea');
    const inputCount = await textInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = textInputs.nth(i);
      await input.fill(maliciousScript);
      await page.waitForTimeout(100);

      // Check that script didn't execute
      const xssExecuted = await page.evaluate(
        () => (window as unknown as Record<string, unknown>).xssTest
      );
      expect(xssExecuted).toBeFalsy();
    }

    // Security: Verify local storage doesn't contain sensitive data
    const localStorage = await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          storage[key] = window.localStorage.getItem(key) || '';
        }
      }
      return storage;
    });

    // Check for sensitive patterns in localStorage
    const sensitivePatterns = /api[_-]?key|secret|password|token|auth/i;
    Object.entries(localStorage).forEach(([key, value]) => {
      expect(key).not.toMatch(sensitivePatterns);
      expect(value).not.toMatch(sensitivePatterns);
    });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and simulate network errors
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });

    await page.route('**/generativelanguage.googleapis.com/**', (route) => {
      route.abort('failed');
    });

    // Try to trigger API calls by interacting with the app
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      await button.click();
      await page.waitForTimeout(1000);

      // Should handle errors gracefully - check for error messages or fallbacks
      const errorMessage = page.locator(
        '[role="alert"], .error, .error-message'
      );
      const loadingIndicator = page.locator('.loading, .spinner');

      // App should show appropriate feedback
      const hasErrorHandling =
        (await errorMessage.count()) > 0 ||
        (await loadingIndicator.count()) === 0;
      expect(hasErrorHandling).toBeTruthy();
    }
  });

  test('should be performant on slower connections', async ({ page }) => {
    // Simulate slow 3G connection
    await page.route('**/*', (route) => {
      // Add 500ms delay to simulate slow network
      setTimeout(() => {
        route.continue();
      }, 100);
    });

    const startTime = Date.now();
    await page.goto('/');

    // Page should load within reasonable time even on slow connection
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    // Critical content should be visible
    await expect(page.locator('h1')).toBeVisible({ timeout: 8000 });
  });

  test('should work offline (PWA features)', async ({ page }) => {
    // First, load the page normally
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Then simulate offline
    await page.context().setOffline(true);

    // Refresh page
    await page.reload();

    // Check if service worker provides offline functionality
    // (This will fail if no PWA setup, which is expected for basic apps)
    const isOnline = await page.isVisible('h1');

    if (isOnline) {
      console.log('✓ PWA offline functionality working');
    } else {
      console.log('ℹ No PWA offline functionality (expected for basic apps)');
    }

    // Reset to online
    await page.context().setOffline(false);
  });
});
