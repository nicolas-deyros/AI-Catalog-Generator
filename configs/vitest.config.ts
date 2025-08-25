/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment configuration
    environment: 'jsdom',

    // Security: Isolate test runs
    isolate: true,

    // Setup files
    setupFiles: ['./tests/setup/vitest.setup.ts'],

    // Global test configuration
    globals: true,

    // Coverage configuration for security analysis
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'coverage/',
        // Security: Exclude sensitive files from coverage
        '**/*.env*',
        '**/secrets/**',
      ],
      // Security: Minimum coverage thresholds
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },

    // Security: Timeout configuration to prevent hanging tests
    testTimeout: 10000,
    hookTimeout: 10000,

    // Security: Test file patterns (prevents running arbitrary files as tests)
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],

    // Security: Exclude sensitive directories
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '**/*.env*',
      '**/secrets/**',
      'tests/e2e/**', // E2E tests run separately with Playwright
    ],

    // Security: Restrict test execution environment
    pool: 'forks', // Isolate tests in separate processes
    poolOptions: {
      forks: {
        singleFork: false, // Enable parallel execution for performance
        isolate: true, // Security: Isolate each test file
      },
    },
  },
});
