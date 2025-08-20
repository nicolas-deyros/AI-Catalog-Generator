<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Catalog Creator

The AI Catalog Creator is a web application that leverages the power of Google's Gemini AI to help users create stunning, multi-page product catalogs. Users can upload product images, enhance them with AI-powered background removal and color correction, and then generate a complete HTML catalog based on a style prompt.

View your app in AI Studio: https://ai.studio/apps/drive/1vaHU_8IzgJUte_Kj2P6vXVEPk-aFhMwu

## Features

- **Multi-Step Catalog Creation:** A guided workflow to take you from product images to a finished catalog.
- **Image Upload:** Upload multiple product images at once.
- **AI-Powered Image Enhancement:**
  - Remove backgrounds from product images.
  - Apply color corrections and other filters using natural language prompts.
- **AI-Powered Content Generation:**
  - Generate a complete, multi-page HTML catalog with Tailwind CSS.
  - Provide a style prompt to guide the AI in creating a design that matches your brand.
- **Live Preview:** Instantly preview the generated catalog within the application.

## Project Structure

The project is a standard Vite-based React application with the following structure:

```
.
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Services for interacting with external APIs (e.g., Gemini)
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Application entry point
│   ├── types.ts          # TypeScript type definitions
│   └── ...
├── .env                  # Environment variable template
├── eslint.config.js      # ESLint configuration
├── package.json          # Project dependencies and scripts
└── ...
```

## Technologies Used

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **AI:** [Google Gemini](https://ai.google.dev/) via the `@google/genai` SDK
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Linting:** [ESLint](https://eslint.org/), [Stylelint](https://stylelint.io/)
- **Formatting:** [Prettier](https://prettier.io/)

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
- `npm run lint`: Runs both ESLint and Stylelint to check for code quality issues.
- `npm run format`: Formats all files with Prettier.
- `npm run format:check`: Checks for formatting issues without modifying files.

## Further Development

For details on the proposed testing strategy and recommendations for future improvements, please see:

- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [RECOMMENDATIONS.md](./RECOMMENDATIONS.md)
