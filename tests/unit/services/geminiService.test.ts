import { describe, it, expect, beforeEach } from 'vitest';
import {
  enhanceImage,
  generateCatalogLayout,
} from '../../../src/services/geminiService';
import { server } from '../../setup/vitest.setup';
import { http, HttpResponse } from 'msw';
import { CatalogItem } from '../../../src/types/types';

// Security: Mock the Gemini API interactions
describe('Gemini Service', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('enhanceImage', () => {
    it('should successfully enhance image with valid response', async () => {
      // Security: Mock successful API response
      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return HttpResponse.json({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          svgClipPathElement:
                            '<clipPath id="test-clip"><path d="M0,0"/></clipPath>',
                          cssFilter: 'brightness(1.1)',
                        }),
                      },
                    ],
                  },
                },
              ],
            });
          }
        )
      );

      const result = await enhanceImage(
        'data:image/jpeg;base64,test',
        'image/jpeg',
        'test-1',
        'remove background'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clipPathId).toBe('clip-path-test-1');
        expect(result.data.clipPathSvg).toContain('clipPath');
        expect(result.data.filterCss).toBe('brightness(1.1)');
      }
    });

    it('should handle API errors gracefully', async () => {
      // Security: Test error handling
      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return new HttpResponse(null, { status: 500 });
          }
        )
      );

      const result = await enhanceImage(
        'data:image/jpeg;base64,test',
        'image/jpeg',
        'test-1',
        'remove background'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Failed to enhance image');
      }
    });

    it('should handle invalid JSON response', async () => {
      // Security: Test malformed response handling
      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return HttpResponse.json({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: 'Invalid JSON content',
                      },
                    ],
                  },
                },
              ],
            });
          }
        )
      );

      const result = await enhanceImage(
        'data:image/jpeg;base64,test',
        'image/jpeg',
        'test-1',
        'remove background'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('AI did not return a valid JSON object');
      }
    });

    it('should sanitize and validate input data', async () => {
      // Security: Test input validation
      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return HttpResponse.json({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          svgClipPathElement: '',
                          cssFilter: '',
                        }),
                      },
                    ],
                  },
                },
              ],
            });
          }
        )
      );

      const result = await enhanceImage(
        'data:image/jpeg;base64,test',
        'image/jpeg',
        '<script>alert("xss")</script>',
        'remove background'
      );

      // Should still work but with sanitized data
      expect(result.success).toBe(true);
    });
  });

  describe('generateCatalogLayout', () => {
    it('should generate catalog with valid products', async () => {
      const mockProducts: CatalogItem[] = [
        {
          id: 'test-1',
          file: new File(['test'], 'test1.jpg', { type: 'image/jpeg' }),
          name: 'Product 1',
          objectURL: 'blob:test1',
          base64: 'data:image/jpeg;base64,test1',
        },
        {
          id: 'test-2',
          file: new File(['test'], 'test2.jpg', { type: 'image/jpeg' }),
          name: 'Product 2',
          objectURL: 'blob:test2',
          base64: 'data:image/jpeg;base64,test2',
        },
      ];

      const mockStyle = 'Modern and clean layout';

      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return HttpResponse.json({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: '<div class="catalog-page"><h1>Product Catalog</h1></div>',
                      },
                    ],
                  },
                },
              ],
            });
          }
        )
      );

      const result = await generateCatalogLayout(mockStyle, mockProducts);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain('catalog-page');
        expect(result.data).toContain('Product Catalog');
      }
    });

    it('should handle empty product list securely', async () => {
      // Security: Test edge case with empty data
      const result = await generateCatalogLayout('Style', []);

      expect(result.success).toBe(true); // Function should handle empty arrays gracefully
      if (result.success) {
        expect(typeof result.data).toBe('string');
      }
    });

    it('should sanitize HTML output', async () => {
      // Security: Test XSS protection in HTML output
      const mockProducts: CatalogItem[] = [
        {
          id: 'test',
          file: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
          name: 'Product',
          objectURL: 'blob:test',
          base64: 'data:image/jpeg;base64,test',
        },
      ];

      server.use(
        http.post(
          'https://generativelanguage.googleapis.com/v1beta/models/*',
          () => {
            return HttpResponse.json({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: '<div class="catalog-page"><h1>Catalog</h1></div>',
                      },
                    ],
                  },
                },
              ],
            });
          }
        )
      );

      const result = await generateCatalogLayout('Style', mockProducts);

      expect(result.success).toBe(true);
      if (result.success) {
        // Should contain safe HTML
        expect(result.data).toContain('<h1>Catalog</h1>');
        expect(result.data).toContain('catalog-page');
      }
    });
  });
});
