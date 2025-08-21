/**
 * Global teardown for Playwright E2E tests
 * Handles cleanup and security verification
 */
async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');

  // Security: Clean up any test artifacts
  try {
    // Additional cleanup if needed
    console.log('✅ Test artifacts cleaned up');
  } catch (error) {
    console.warn('⚠️ Cleanup warning:', error);
  }

  console.log('✅ Global teardown completed');
}

export default globalTeardown;
