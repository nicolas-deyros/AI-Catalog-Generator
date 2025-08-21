import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests
 * Handles security configuration and test environment preparation
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Security: Configure browser with security settings
  const browser = await chromium.launch({
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-extensions',
      '--disable-plugins',
    ],
  });

  // Security: Verify test server is available
  const page = await browser.newPage();

  try {
    await page.goto(
      config.projects[0].use?.baseURL || 'http://localhost:5173',
      {
        waitUntil: 'networkidle',
        timeout: 30000,
      }
    );

    console.log('✅ Test server is ready');
  } catch (error) {
    console.error('❌ Failed to connect to test server:', error);
    throw error;
  } finally {
    await page.close();
    await browser.close();
  }

  console.log('✅ Global setup completed');
}

export default globalSetup;
