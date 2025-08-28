<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Catalog Creator

Create stunning product catalogs with AI-powered image enhancement and generation using Google's Gemini AI.

## ✨ Features

- **� AI Image Enhancement**: Enhance existing product images with professional photography styles
- **� AI Image Generation**: Generate brand new product images from text descriptions
- **📋 Catalog Creation**: Generate complete HTML catalogs with custom styling
- **🔄 Unified Interface**: Single workflow for both enhancing and generating images

## 🚀 Quick Start

1. **Clone and install**

   ```bash
   git clone https://github.com/nicolas-deyros/AI-Catalog-Generator.git
   cd AI-Catalog-Generator
   npm install
   ```

2. **Add your Gemini API key**

   ```bash
   echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite 6** for fast builds
- **Google Gemini AI** for image processing
- **Tailwind CSS 4** for styling

## 📝 How It Works

1. Upload product images or describe what you want
2. Choose from 20+ professional photography presets
3. Let AI enhance existing images or generate new ones
4. Generate beautiful HTML catalogs

## � Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run all tests
npm run lint         # Check code quality
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see LICENSE file for details.

---

_Powered by Google Gemini AI • Built with ❤️ and TypeScript_

**Framework**: [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**Coverage Areas**:

- **Services** (`tests/unit/services/`): API integration, error handling, input validation
- **Components** (`tests/unit/components/`): Rendering, user interactions, accessibility
- **Hooks** (`tests/unit/hooks/`): State management, step navigation, security validation

**Security Features**:

- Process isolation (`pool: 'forks'`) for secure test execution
- XSS prevention testing with malicious input validation
- API mocking with [MSW](https://mswjs.io/) for controlled test environments
- Input sanitization and timeout protection

```bash
# Run unit tests
npm run test:unit

# Watch mode for development
npm run test:unit:watch

# Coverage report
npm run test:unit:coverage

# Interactive UI
npm run test:unit:ui
```

### 🌐 **End-to-End Testing**

**Framework**: [Playwright](https://playwright.dev/) with multi-browser support

**Test Coverage**:

- Complete user workflows from upload to catalog generation
- Cross-browser compatibility (Chromium, Firefox, WebKit)
- Accessibility validation and keyboard navigation
- Mobile responsiveness testing

**Security Features**:

- Browser security flags and controlled environments
- File upload validation and malicious content protection
- Network request monitoring and validation

```bash
# Run E2E tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Headed mode (visible browser)
npm run test:e2e:headed
```

### 🔒 **Security Testing**

All tests include security-focused validation:

- **XSS Prevention**: Testing against script injection and malicious HTML
- **Input Validation**: File type validation and content sanitization
- **API Security**: Mocked responses prevent actual external calls during testing
- **Environment Isolation**: Tests run in isolated processes with controlled environments

### 📊 **Test Reports**

- **Coverage Reports**: Generated in `coverage/` directory with detailed HTML reports
- **Test Results**: Comprehensive reporting with pass/fail status and performance metrics
- **CI/CD Ready**: All tests designed for automated pipeline integration

## Git Hooks & Code Quality

This project uses Husky and lint-staged to ensure code quality with **intelligent testing integration**. The following Git hooks are automatically set up:

### Pre-commit Hook

- **Intelligent Testing**: Automatically runs unit tests **only for changed source files** to ensure fast, targeted validation
- Runs ESLint and fixes issues automatically on staged `.ts/.tsx` files
- Formats code with Prettier on staged files
- Performs spell checking with cspell on all staged files
- Fixes stylelint issues on CSS files
- Ensures all committed code meets quality standards **and passes tests**

**Testing Integration**: The pre-commit hook includes:

```bash
"src/**/*.{ts,tsx}": [
  "npm run test:unit -- --run --reporter=verbose --passWithNoTests"
]
```

This means every source code change is automatically tested before commit! 🧪

### Commit Message Hook

- Enforces conventional commit message format using commitlint
- Examples of valid commit messages:
  - `feat: add image enhancement feature`
  - `fix: resolve blob URL cleanup issue`
  - `docs: update installation instructions`
  - `refactor: simplify PDF generation logic`
  - `test: add comprehensive component testing`

### Pre-push Hook

- **Type Safety**: Runs TypeScript type checking to catch type errors
- **Build Verification**: Ensures the project builds successfully before push
- **Production Readiness**: Validates that code is ready for deployment
- Prevents pushing broken code to the repository

This creates a **three-layer quality gate**:

1. **Pre-commit**: Code quality + targeted testing
2. **Pre-push**: Type safety + build verification
3. **CI/CD Ready**: Full test suite can run in automated pipelines

**Note:** If you need to skip hooks in emergency situations, use `--no-verify` flag:

```bash
git commit --no-verify -m "emergency fix"
git push --no-verify
```

## Further Development

For details on the proposed testing strategy and recommendations for future improvements, please see:

- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [RECOMMENDATIONS.md](./RECOMMENDATIONS.md)
