# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Enhancement-2 Branch

### Added

- **Comprehensive Testing Framework**: Complete testing environment with security-focused approach:
  - **Unit Testing**: 22 passing tests with Vitest covering services, components, and hooks
  - **E2E Testing**: Playwright-based end-to-end testing with browser automation
  - **Component Testing**: React Testing Library with accessibility validation
  - **Service Testing**: API mocking with MSW for secure isolated testing
  - **Security Testing**: XSS prevention, input validation, and malicious content protection
- **Intelligent Git Integration**: Pre-commit testing with selective test execution:
  - Automatic unit tests run only for changed source files
  - Type checking and build verification before push
  - Lint-staged configuration for efficient testing workflow
- **Testing Infrastructure**:
  - Vitest configuration with coverage reporting and security isolation
  - Playwright configuration with browser security settings
  - MSW (Mock Service Worker) for controlled API testing
  - Test fixtures and utilities for consistent testing
- **Modern Dialog System**: Replaced all browser `alert()` calls with a custom `Dialog` component featuring:
  - Native HTML5 `<dialog>` element with proper backdrop
  - Accessible design with ESC key support and focus management
  - Visual indicators for different dialog types (info, warning, error, success)
  - Centered positioning with smooth animations
- **Comprehensive Linting Pipeline**:
  - `textlint` for documentation quality and terminology consistency
  - `cspell` for spell checking across source code and documentation
  - Enhanced ESLint configuration with spell checking integration
  - Pre-commit hooks for automated quality checks
- **Enhanced Project Structure**:
  - Organized `src/` directory with dedicated folders for assets, components, hooks, services, styles, and types
  - Added comprehensive `tests/` directory with unit, E2E, and fixture organization
  - Moved styles folder inside `src/` for better organization
  - Added `public/` folder for static assets
- **Security Improvements**:
  - Secure `.env` file setup with Git protection
  - Updated `.gitignore` to prevent environment file commits
  - Process isolation in testing environment
  - Timeout protection and XSS prevention in tests
- **Extended Icon Library**: Added icons for close button, alerts, info, and success states

### Changed

- **Testing Implementation**: Moved from testing strategy to full implementation with working test suites
- **Quality Assurance**: Added automated testing pipeline with intelligent git integration
- **Development Workflow**: Enhanced with comprehensive testing at every stage (commit, push, CI/CD ready)
- **UI/UX Modernization**: Migrated from intrusive browser alerts to user-friendly dialog modals
- **Code Organization**: Restructured project with cleaner separation of concerns and dedicated testing
- **Security Posture**: Implemented security-first testing approach with isolated environments

### Fixed

- **Dialog Positioning**: Resolved initial top-left positioning issues with proper CSS flexbox centering
- **Accessibility**: Improved keyboard navigation and screen reader support in dialog components
- **Close Button Visibility**: Enhanced contrast and styling for better user interaction

## [1.0.0] - 2025-08-20

### Added

- Initial version of the AI Catalog Creator application.
- Core features: image upload, AI-powered image enhancement, and AI-powered catalog generation.
- Comprehensive error handling and a global error boundary.
- ESLint, stylelint, and Prettier for code quality and consistent formatting.
- Npm scripts for running linters and formatters.
- `TESTING_STRATEGY.md` with a detailed proposal for testing.
- `RECOMMENDATIONS.md` with suggestions for future improvements.

### Changed

- Refactored the main `App.tsx` component to improve maintainability by extracting step logic into a custom `useAppSteps` hook.
- Improved the error handling in the AI services to return structured responses.

### Fixed

- Corrected the environment variable handling for the Gemini API key to work with Vite.
- Fixed a potential memory leak in the main `App` component's `useEffect` hook.
