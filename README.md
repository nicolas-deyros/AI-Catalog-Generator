<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Catalog Creator

Create stunning product catalogs with AI-powered image enhancement and generation using Google's Gemini AI.

## ✨ Key Features

- **🍌 Nano-Banana AI Generation**: Generate brand new product images from text descriptions
- **🎨 Smart Enhancement**: AI-powered image enhancement with 25+ professional photography presets
- **📋 Catalog Creation**: Generate complete HTML catalogs with custom styling
- **🔄 Unified Workflow**: Single interface for both enhancing existing images and generating new ones

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone https://github.com/nicolas-deyros/AI-Catalog-Generator.git
   cd AI-Catalog-Generator
   npm install
   ```

2. **Configure API Key**

   ```bash
   # Create .env.local file
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key" > .env.local
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test:unit    # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run lint         # Lint code
```

## 🏗️ Tech Stack

- **React 19** with TypeScript
- **Vite 6** for blazing fast builds
- **Google Gemini AI** for image processing and generation
- **Tailwind CSS 4** for styling
- **Vitest** for testing

## 📝 How It Works

1. **Upload Images** - Drag and drop product images
2. **Smart Presets** - Choose from 25+ professional photography styles
3. **AI Magic** - Enhance existing images or generate new ones with Gemini's nano-banana model
4. **Generate Catalog** - Create beautiful HTML catalogs with AI-generated layouts

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details.

---

_Powered by Google Gemini AI • Built with ❤️ and TypeScript_
├── tools/ # Development tools and linting configs
│ ├── .lintstagedrc.json # Staged files linting configuration
│ ├── .prettierrc # Code formatting rules
│ ├── .stylelintrc.json # CSS linting configuration
│ ├── .textlintrc.json # Documentation linting configuration
│ └── cspell.json # Spell checking configuration
├── public/ # Static assets (favicon, etc.)
├── src/
│ ├── components/ # React components
│ │ ├── CatalogPreview.tsx # PDF generation and preview
│ │ ├── Dialog.tsx # Modern dialog component
│ │ ├── Header.tsx # Application header
│ │ ├── Icon.tsx # Icon component library
│ │ ├── ImageEnhancer.tsx # AI image enhancement with photography support
│ │ ├── ImageUploader.tsx # File upload with drag-and-drop
│ │ ├── Loader.tsx # Loading spinner
│ │ ├── ProgressStepper.tsx # Step navigation
│ │ └── StylePrompt.tsx # Style prompt input
│ ├── hooks/ # Custom React hooks
│ │ └── useAppSteps.ts # Application flow management
│ ├── services/ # External API services
│ │ └── geminiService.ts # Google Gemini AI with photography terminology
│ ├── types/ # TypeScript type definitions
│ │ └── types.ts # Shared type definitions
│ ├── App.tsx # Main application component
│ └── index.tsx # Application entry point
├── tests/ # Test suites
│ ├── e2e/ # End-to-end tests
│ ├── setup/ # Test configuration and setup
│ └── unit/ # Unit tests organized by feature
├── .env # Environment variables (ignored by git)
├── .env.example # Environment variable template
├── .gitignore # Git ignore patterns
├── .husky/ # Git hooks configuration
├── index.html # HTML entry point
├── package.json # Project dependencies and scripts
└── README.md # This file

````

## Technologies Used

- **Frontend:** [React](https://react.dev/) 19.1.1, [TypeScript](https://www.typescriptlang.org/) ~5.8.2, [Vite](https://vitejs.dev/) 6+ with Rolldown
- **AI:** [Google Gemini](https://ai.google.dev/) via the `@google/genai` SDK
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) 4.1.12
- **Testing & Quality:**
  - [Vitest](https://vitest.dev/) 3.2.4 for unit testing with security isolation
  - [Playwright](https://playwright.dev/) 1.55.0 for end-to-end testing
  - [React Testing Library](https://testing-library.com/) 16.3.0 for component testing
  - [MSW](https://mswjs.io/) 2.10.5 for API mocking and secure test environments
- **Linting & Code Quality:**
  - [ESLint](https://eslint.org/) 9.33.0 with TypeScript support
  - [stylelint](https://stylelint.io/) for CSS-in-JS linting
  - [textlint](https://textlint.github.io/) for documentation quality
  - [cspell](https://cspell.org/) for comprehensive spell checking
- **Formatting:** [Prettier](https://prettier.io/) with consistent code style
- **Git Hooks:** [Husky](https://typicode.github.io/husky/) 9.1.7 with lint-staged for pre-commit quality checks
- **Commit Standards:** [Commitlint](https://commitlint.js.org/) for conventional commit messages

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- An API key for the Gemini API. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    - Create a `.env.local` file in the root of the project by copying the `.env` template.
    - Open the `.env.local` file and add your Gemini API key:
      ```
      VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

This project includes several scripts to help with development and code quality.

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs both unit and E2E tests.
- `npm run test:unit`: Runs unit tests with Vitest.
- `npm run test:unit:watch`: Runs unit tests in watch mode.
- `npm run test:unit:ui`: Opens Vitest UI for interactive testing.
- `npm run test:unit:coverage`: Runs unit tests with coverage reporting.
- `npm run test:e2e`: Runs end-to-end tests with Playwright.
- `npm run test:e2e:ui`: Opens Playwright UI for interactive E2E testing.
- `npm run test:e2e:headed`: Runs E2E tests in headed mode (visible browser).
- `npm run test:e2e:debug`: Runs E2E tests in debug mode.
- `npm run lint`: Runs both ESLint and stylelint to check for code quality issues.
- `npm run lint:fix`: Automatically fixes linting issues where possible.
- `npm run format`: Formats all files with Prettier.
- `npm run format:check`: Checks for formatting issues without modifying files.
- `npm run type-check`: Runs TypeScript type checking without emitting files.
- `npm run quality`: Runs linting, type checking, and unit tests together.
- `npm run pre-commit`: Manually runs the pre-commit hooks (lint-staged).

## Testing Framework

This project implements a comprehensive, security-focused testing strategy with multiple layers of validation:

### 🧪 **Unit Testing** (22 Tests ✅)

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
````

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
