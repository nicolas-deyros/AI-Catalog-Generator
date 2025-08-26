# Testing Strategy

This document outlines a testing strategy for the AI Catalog Creator application. The goal is to ensure the application is reliable, maintainable, and that new features can be added with confidence.

The testing strategy is divided into three layers:

1.  **Unit Tests:** To test individual functions and logic in isolation.
2.  **Component Tests:** To test React components' rendering and behavior.
3.  **End-to-end (end-to-end) Tests:** To test complete user flows from the user's perspective.

## 1. Recommended Tooling

For a Vite-based React project like this, the following testing libraries are recommended:

- **Test Runner & Assertion Library:** [**Vitest**](https://vitest.dev/) - It's a fast test runner that is designed to work with Vite out-of-the-box. It's compatible with Jest's API, making it easy to learn.
- **Component Testing:** [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/) - A library for testing React components in a way that resembles how users interact with them.
- **API Mocking:** [**Mock Service Worker (MSW)**](https://mswjs.io/) - For mocking API requests in both development and testing environments. This is crucial for testing the `geminiService` without making actual API calls.
- **End-to-end Testing:** [**Playwright**](https://playwright.dev/) or [**Cypress**](https://www.cypress.io/) - Both are excellent choices for end-to-end testing. Playwright offers great cross-browser support, while Cypress is known for its developer-friendly experience.

### Installation

To set up the testing environment, you would run:

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom msw
```

## 2. Unit Tests

Unit tests should focus on the business logic of the application, which is primarily in `services/geminiService.ts`.

### `services/geminiService.ts`

- **`enhanceImage` function:**
  - Test that it calls the `ai.models.generateContent` method with the correctly formatted prompt.
  - Test that it returns a `{ success: true, data: ... }` object when the API call is successful.
  - Test that it returns a `{ success: false, error: ... }` object when the API call fails.
  - Test that it correctly handles invalid JSON responses from the AI.

- **`generateImage` function (nano-banana):**
  - Test image generation with valid prompts and IDs
  - Test error handling for failed generation requests
  - Test proper response structure with GeneratedImage interface

- **`convertGeneratedImageToCatalogItem` function:**
  - Test conversion of GeneratedImage to CatalogItem format
  - Test proper base64 encoding and file object creation
  - Test different MIME types (PNG, JPEG) handling
  - Test metadata preservation (prompt, ID, isGenerated flag)

- **`generateCatalogLayout` function:**
  - Test that it constructs the prompt with the correct product list.
  - Test that it returns a `{ success: true, data: ... }` object on a successful API call.
  - Test that it returns a `{ success: false, error: ... }` object on a failed API call.

### Current Test Coverage

- **28 unit tests** covering all core functionality
- **3 test suites**: hooks, services, components
- **MSW mocking** for secure API testing without real API calls

## 3. Component Tests

Component tests should verify that components render correctly and respond to user interaction as expected.

- **`ImageUploader.tsx`:**
  - Test that it renders the file input.
  - Test that it calls the `onItemsChange` prop with the correct data when files are selected.
  - Test enhanced delete button functionality and accessibility.

- **`ImageEnhancer.tsx`:**
  - Test unified smart preset system (enhancement + generation)
  - Test context-aware button behavior (blue for enhance, purple for generate)
  - Mock the `enhanceImage` and `generateImage` services
  - Test that smart presets work for both enhancement and generation modes
  - Test loading states for both enhancement and generation
  - Test proper error handling and dialog display
  - Test 25 professional photography preset buttons

- **`StylePrompt.tsx`:**
  - Test that the text area's value is controlled by the `prompt` prop.
  - Test that the `setPrompt` function is called on text area input.

- **`Dialog.tsx`:**
  - Test that the dialog renders with the correct content and type styling.
  - Test that clicking the close button calls the `onClose` prop.
  - Test that pressing the ESC key calls the `onClose` prop.
  - Test that the dialog shows/hides based on the `isOpen` prop.
  - Test different dialog types (info, warning, error, success) render with appropriate icons and styling.
  - Test accessibility features like focus management and ARIA attributes.

## 4. End-to-end (end-to-end) Tests

End-to-end tests simulate a real user's journey through the application. A primary end-to-end test case would be:

1.  **The Catalog Creation Flow:**
    - The user visits the application.
    - The user uploads one or more product images.
    - The user navigates to the "Enhance Images" step.
    - The user selects an image and clicks "Enhance with AI". (The AI response should be mocked to return a predefined enhancement).
    - The user navigates to the "Define Style" step.
    - The user enters a style prompt.
    - The user clicks "Generate Catalog". (The AI response should be mocked to return a predefined HTML catalog).
    - The user is taken to the "Preview" step.
    - Verify that the generated catalog content is displayed correctly on the preview page.
    - Verify that navigating back from the preview clears the generated content.
