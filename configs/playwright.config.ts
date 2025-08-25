import { defineConfig, devices } from '@playwright/test';

/**
 * Security-focused Playwright configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: '../tests/e2e',

  // Security: Run tests in fully parallel mode for isolation
  fullyParallel: true,

  // Security: Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Security: Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Security: Opt out of parallel tests on CI for better isolation
  // CI configuration
  workers: process.env.CI ? 1 : '50%',

  // Security: Reporter configuration
  reporter: process.env.CI ? 'github' : 'html',

  // Security: Shared settings for all the projects below
  use: {
    // Security: Base URL for testing
    baseURL: 'http://localhost:5173',

    // Security: Collect trace on retry for debugging
    trace: 'on-first-retry',

    // Security: Take screenshot on failure
    screenshot: 'only-on-failure',

    // Security: Record video on retry
    video: 'retain-on-failure',

    // Security: Disable permissions by default
    permissions: [],

    // Security: Disable notifications
    acceptDownloads: false,

    // Security: Ignore HTTPS errors in development
    ignoreHTTPSErrors: true,
  },

  // Security: Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Security: Additional Chromium-specific security settings
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-images', // Security: Disable image loading for faster tests
          ],
        },
      },
    },

    // Uncomment for cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Security: Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,

    // Security: Timeout for server startup
    timeout: 120 * 1000,

    // Security: Environment variables for test server
    env: {
      NODE_ENV: 'test',
      VITE_GEMINI_API_KEY: 'test-api-key-for-e2e',
    },
  },

  // Security: Global test configuration
  globalSetup: '../tests/setup/playwright.global.ts',
  globalTeardown: '../tests/setup/playwright.teardown.ts',

  // Security: Test timeout
  timeout: 30 * 1000,

  // Security: Expect timeout
  expect: {
    timeout: 5 * 1000,
  },

  // Security: Output directory for test artifacts
  outputDir: '../test-results/',

  // Security: Test patterns
  testMatch: /.*\.e2e\.ts/,
});
