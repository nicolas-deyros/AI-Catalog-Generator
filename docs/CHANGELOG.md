# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Professional Photography AI Enhancement System**: Revolutionary photography terminology support:
  - **150+ Photography Terms Recognition**: Support for camera angles, lens types, photography styles, lighting conditions, quality modifiers, and camera brands
  - **Intelligent Enhancement Mapping**: Automatically applies appropriate CSS filters based on detected photography terminology
  - **Professional Effects Library**: Cinematic lighting, golden hour effects, vintage film looks, noir styles, blue hour, and high-end photography simulation
  - **Advanced Prompt Analysis**: Context-aware processing that differentiates between professional photography requests and basic enhancements
  - **User Experience Enhancements**: Built-in photography examples and collapsible guidance for users to discover professional enhancement capabilities

- **Repository Organization & Structure Improvements**:
  - **Clean Directory Structure**: Organized configuration files into `configs/`, documentation into `docs/`, and development tools into `tools/`
  - **Modular Configuration**: Separated ESLint, Playwright, TypeScript, Vite, and Vitest configurations for better maintainability
  - **Improved Documentation Structure**: Centralized all documentation files with clear organization and updated project structure guide

- **PDF Generation Fixes & Improvements**:
  - **Modern CSS Color Support**: Fixed html2canvas compatibility issues with `oklch()` and `color-mix()` CSS functions
  - **Comprehensive Color Conversion**: Robust color function parser that converts modern CSS colors to RGB equivalents for PDF generation
  - **Cross-browser PDF Compatibility**: Enhanced PDF generation reliability across different browsers and CSS configurations

- **Comprehensive Testing Framework**: Complete testing environment with security-focused approach:
  - **Unit Testing**: 26 passing tests with Vitest covering services, components, and hooks including new photography features
  - **E2E Testing**: Playwright-based end-to-end testing with browser automation
  - **Component Testing**: React Testing Library with accessibility validation
  - **Service Testing**: API mocking with MSW for secure isolated testing
  - **Security Testing**: XSS prevention, input validation, and malicious content protection

- **Modern Dialog System**: Replaced all browser `alert()` calls with a custom `Dialog` component featuring:
  - Native HTML5 `<dialog>` element with proper backdrop
  - Accessible design with ESC key support and focus management
  - Visual indicators for different dialog types (info, warning, error, success)
  - Centered positioning with smooth animations
- **Comprehensive Linting Pipeline**:
  - `textlint` for documentation quality and terminology consistency
  - `cspell` for spell checking across source code and documentation
  - Enhanced ESLint configuration with spell checking integration
- **Intelligent Git Integration**: Pre-commit testing with selective test execution:
  - Automatic unit tests run only for changed source files
  - Type checking and build verification before push
  - Lint-staged configuration for efficient testing workflow

### Changed

- **Project Architecture**: Major repository reorganization for better maintainability:
  - Moved all configuration files to dedicated `configs/` directory
  - Centralized documentation in `docs/` directory
  - Organized development tools and linting configs in `tools/` directory
  - Updated all build scripts and tooling to reference new organized structure
  - Enhanced project structure documentation in README
- **Photography Enhancement Capabilities**: Upgraded from basic image filters to professional photography expertise:
  - Enhanced Gemini AI service with sophisticated photography terminology recognition
  - Improved prompt processing with context-aware enhancement strategies
  - Added professional photography examples and user guidance
  - Updated UI to showcase advanced enhancement capabilities

- **PDF Generation Reliability**: Improved cross-browser compatibility and error handling:
  - Enhanced html2canvas configuration for better color function support
  - Improved error handling and fallback mechanisms
  - Better CSS processing for modern web standards

- **Testing Implementation**: Moved from testing strategy to full implementation with working test suites
- **Quality Assurance**: Added automated testing pipeline with intelligent git integration
- **Development Workflow**: Enhanced with comprehensive testing at every stage (commit, push, CI/CD ready)
- **UI/UX Modernization**: Migrated from intrusive browser alerts to user-friendly dialog modals
- **Security Posture**: Implemented security-first testing approach with isolated environments

### Fixed

- **PDF Generation Color Support**: Resolved html2canvas errors with modern CSS color functions:
  - Fixed "Attempting to parse an unsupported color function 'oklch'" error
  - Added comprehensive color conversion for `oklch()`, `color-mix()`, and modern CSS color functions
  - Implemented robust onClone function to process all element styles
  - Ensured cross-browser compatibility for PDF generation while maintaining visual fidelity

- **Dialog Positioning**: Resolved initial top-left positioning issues with proper CSS flexbox centering
- **Accessibility**: Improved keyboard navigation and screen reader support in dialog components
- **Close Button Visibility**: Enhanced contrast and styling for better user interaction
- **Image Enhancement Error Handling**: Fixed JSON parsing errors when AI generates extremely long clip paths
  - Added truncation for debug output to prevent console overflow
  - Implemented fallback for overly complex clip paths (>50k characters)
  - Added performance protection against memory issues
- **Professional Photography Prompt Support**: Enhanced image enhancement to support complex photography prompts
  - Removed overly restrictive validation that blocked legitimate enhancement requests
  - Allow cinematic, golden hour, lens, and professional photography terminology
  - Updated AI prompt to better handle professional photography enhancement techniques
  - Distinguished between content generation vs. image enhancement requests

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
