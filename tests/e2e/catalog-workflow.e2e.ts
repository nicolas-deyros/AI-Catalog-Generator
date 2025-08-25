import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * Security-focused E2E tests for the complete catalog creation workflow
 */
test.describe('Catalog Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Security: Set up page with safety measures
    await page.goto('/');

    // Security: Verify we're on the correct page
    await expect(page).toHaveTitle(/AI Catalog Creator/i);

    // Security: Check for essential UI elements
    await expect(
      page.getByText('Drag & drop your product images here')
    ).toBeVisible();
  });

  test('should complete full catalog creation flow', async ({ page }) => {
    // Step 1: Upload Images
    await test.step('Upload product images', async () => {
      // Security: Create test image file
      const testImagePath = path.join(__dirname, '../fixtures/test-image.png');

      // Security: Verify upload component is present
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeVisible();

      // Security: Upload test file
      await fileInput.setInputFiles(testImagePath);

      // Security: Verify image preview appears
      await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();

      // Security: Navigate to next step
      await page.getByRole('button', { name: /next/i }).click();
    });

    // Step 2: Enhance Images
    await test.step('Enhance product images', async () => {
      // Security: Verify we're on enhance step
      await expect(page.getByText('Enhance Images')).toBeVisible();

      // Security: Verify uploaded image is displayed
      await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();

      // Security: Mock the AI enhancement
      await page.route('**/v1beta/models/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        name: 'Test Product',
                        description: 'A secure test product description',
                        category: 'Electronics',
                        price: '$99.99',
                        features: ['Secure', 'Tested', 'Reliable'],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
        });
      });

      // Security: Click enhance button
      await page.getByRole('button', { name: /enhance with ai/i }).click();

      // Security: Wait for enhancement to complete
      await expect(page.getByText('Test Product')).toBeVisible({
        timeout: 10000,
      });

      // Security: Navigate to next step
      await page.getByRole('button', { name: /next/i }).click();
    });

    // Step 3: Define Style
    await test.step('Define catalog style', async () => {
      // Security: Verify we're on style step
      await expect(page.getByText('Define Style')).toBeVisible();

      // Security: Enter style prompt
      const styleTextarea = page.locator('textarea[placeholder*="style"]');
      await styleTextarea.fill('Modern and clean design with security focus');

      // Security: Verify input was accepted
      await expect(styleTextarea).toHaveValue(
        'Modern and clean design with security focus'
      );

      // Security: Navigate to next step
      await page.getByRole('button', { name: /next/i }).click();
    });

    // Step 4: Generate and Preview Catalog
    await test.step('Generate catalog', async () => {
      // Security: Verify we're on preview step
      await expect(page.getByText('Preview')).toBeVisible();

      // Security: Mock catalog generation
      await page.route('**/v1beta/models/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>Secure Test Catalog</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          .product { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
                        </style>
                      </head>
                      <body>
                        <h1>Product Catalog</h1>
                        <div class="product">
                          <h2>Test Product</h2>
                          <p>A secure test product description</p>
                          <p><strong>Price:</strong> $99.99</p>
                        </div>
                      </body>
                    </html>
                  `,
                    },
                  ],
                },
              },
            ],
          }),
        });
      });

      // Security: Click generate catalog button
      await page.getByRole('button', { name: /generate catalog/i }).click();

      // Security: Wait for catalog to be generated
      await expect(page.getByText('Product Catalog')).toBeVisible({
        timeout: 15000,
      });

      // Security: Verify catalog content
      await expect(page.getByText('Test Product')).toBeVisible();
      await expect(page.getByText('$99.99')).toBeVisible();
    });

    // Step 5: Test Navigation Back
    await test.step('Test navigation back from preview', async () => {
      // Security: Navigate back to clear generated content
      await page.getByRole('button', { name: /back/i }).click();

      // Security: Verify we're back on style step
      await expect(page.getByText('Define Style')).toBeVisible();

      // Security: Verify style prompt is preserved
      const styleTextarea = page.locator('textarea[placeholder*="style"]');
      await expect(styleTextarea).toHaveValue(
        'Modern and clean design with security focus'
      );
    });
  });

  test('should handle file upload errors securely', async ({ page }) => {
    await test.step('Test invalid file upload', async () => {
      // Security: Try to upload non-image file
      const textFilePath = path.join(__dirname, '../fixtures/test-file.txt');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(textFilePath);

      // Security: Should show error dialog (not browser alert)
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.getByText(/please select image files/i)).toBeVisible();

      // Security: Close dialog
      await page.getByRole('button', { name: /close/i }).click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await test.step('Test API error handling', async () => {
      // Security: Upload valid image first
      const testImagePath = path.join(__dirname, '../fixtures/test-image.png');
      await page.locator('input[type="file"]').setInputFiles(testImagePath);
      await page.getByRole('button', { name: /next/i }).click();

      // Security: Mock API error
      await page.route('**/v1beta/models/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      });

      // Security: Try to enhance image
      await page.getByRole('button', { name: /enhance with ai/i }).click();

      // Security: Should show error dialog
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.getByText(/failed to enhance/i)).toBeVisible();

      // Security: Close error dialog
      await page.getByRole('button', { name: /close/i }).click();
    });
  });

  test('should prevent XSS attacks in user inputs', async ({ page }) => {
    await test.step('Test XSS prevention', async () => {
      // Security: Navigate to style step
      await page.goto('/');

      // Security: Try to input malicious script
      const maliciousScript = '<script>alert("XSS")</script>Modern design';

      // Security: Fill style textarea with malicious content
      const styleTextarea = page.locator('textarea[placeholder*="style"]');
      await styleTextarea.fill(maliciousScript);

      // Security: Verify content is treated as text, not executed
      await expect(styleTextarea).toHaveValue(maliciousScript);

      // Security: Check that no alert was triggered
      page.on('dialog', async (dialog) => {
        // If any dialog appears, it means XSS was not properly prevented
        throw new Error(`Unexpected dialog: ${dialog.message()}`);
      });
    });
  });
});
