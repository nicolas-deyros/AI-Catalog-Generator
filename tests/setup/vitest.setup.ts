import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Security: Mock window.alert and console methods to prevent actual execution
Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
});

// Security: Mock console methods to prevent information leakage
const originalConsole = { ...console };
Object.defineProperty(console, 'warn', {
  writable: true,
  value: vi.fn(),
});
Object.defineProperty(console, 'error', {
  writable: true,
  value: vi.fn(),
});

// Security: Mock HTML5 dialog element methods (not supported in jsdom)
const mockShowModal = vi.fn();
const mockClose = vi.fn();

// Check if HTMLDialogElement exists, if not create it
if (typeof HTMLDialogElement === 'undefined') {
  global.HTMLDialogElement = class MockHTMLDialogElement extends HTMLElement {
    showModal = mockShowModal;
    close = mockClose;
    open = false;
  } as typeof HTMLDialogElement;
} else {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    writable: true,
    value: mockShowModal,
  });

  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    writable: true,
    value: mockClose,
  });
}

// Security: Create MSW server with controlled handlers
export const server = setupServer(
  // Mock Gemini AI API with secure responses
  http.post('https://generativelanguage.googleapis.com/v1beta/models/*', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  success: true,
                  data: 'Mock AI response for testing',
                }),
              },
            ],
          },
        },
      ],
    });
  })
);

// Security: Setup MSW server with error handling
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error', // Security: Fail on unexpected requests
  });
});

// Security: Clean up after each test
afterEach(() => {
  // Clean up React Testing Library
  cleanup();

  // Reset MSW handlers
  server.resetHandlers();

  // Clear all mocks
  vi.clearAllMocks();

  // Reset mock dialog methods
  mockShowModal.mockClear();
  mockClose.mockClear();

  // Security: Reset environment variables
  vi.unstubAllEnvs();
});

// Security: Clean shutdown
afterAll(() => {
  server.close();

  // Restore original console methods
  Object.assign(console, originalConsole);
});

// Security: Mock environment variables safely
vi.mock('../../src/config/env', () => ({
  VITE_GEMINI_API_KEY: 'test-api-key-mock-value',
}));

// Security: Mock file reading capabilities
global.FileReader = class MockFileReader {
  result: string | ArrayBuffer | null = null;
  error: Error | null = null;
  readyState: number = 0;

  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL(): void {
    // Security: Simulate safe file reading
    setTimeout(() => {
      this.readyState = 2;
      this.result =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      this.onload?.({ target: this } as ProgressEvent<FileReader>);
    }, 0);
  }
};

// Security: Mock URL.createObjectURL to prevent actual blob creation
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Security: Prevent actual network requests in tests
vi.mock('fetch', () => vi.fn());
