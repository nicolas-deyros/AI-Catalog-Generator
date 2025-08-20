# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-20

### Added

- Initial version of the AI Catalog Creator application.
- Core features: image upload, AI-powered image enhancement, and AI-powered catalog generation.
- Comprehensive error handling and a global error boundary.
- ESLint, Stylelint, and Prettier for code quality and consistent formatting.
- NPM scripts for running linters and formatters.
- `TESTING_STRATEGY.md` with a detailed proposal for testing.
- `RECOMMENDATIONS.md` with suggestions for future improvements.

### Changed

- Refactored the main `App.tsx` component to improve maintainability by extracting step logic into a custom `useAppSteps` hook.
- Improved the error handling in the AI services to return structured responses.

### Fixed

- Corrected the environment variable handling for the Gemini API key to work with Vite.
- Fixed a potential memory leak in the main `App` component's `useEffect` hook.
