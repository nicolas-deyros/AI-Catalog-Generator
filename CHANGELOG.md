# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-26

### Added

- **🍌 Nano-Banana AI Image Generation**: Integrated Gemini 2.5 Flash Image Preview model for generating brand new product images from text descriptions
- **Smart Preset System**: 25 professional photography preset buttons that intelligently enhance existing images or generate new ones based on context
- **Unified AI Image Studio**: Single interface that seamlessly combines image enhancement and generation workflows
- **Professional Photography Presets**: Added 5 specialized presets including Cinematic, Golden Hour, Professional, Vintage, and High-End styles
- **AI Generated Image Badges**: Purple badges to distinguish AI-generated images from enhanced images
- **Enhanced Test Coverage**: Added comprehensive unit tests for nano-banana image generation and conversion functionality

### Changed

- **ImageEnhancer Component**: Completely redesigned with unified smart interface replacing separate enhancement and generation sections
- **Enhanced Delete Button**: Improved to 32px circular design with better accessibility and hover effects
- **Service Architecture**: Extended geminiService with `generateImage()` and `convertGeneratedImageToCatalogItem()` functions
- **TypeScript Types**: Added `GeneratedImage` interface and `isGenerated` flag to support new generation workflow

### Technical Details

- **Model**: Uses Gemini 2.5 Flash Image Preview (`gemini-2.5-flash-image-preview`) for image generation
- **Workflow**: Smart preset buttons analyze context - blue buttons enhance selected images, purple buttons generate new images when no image is selected
- **Integration**: Seamless conversion of generated images to catalog items with proper metadata and file handling

### Improved

- **User Experience**: Context-aware interface eliminates confusion between enhancement and generation features
- **Performance**: Optimized image processing pipeline with better error handling and validation
- **Developer Experience**: Enhanced debugging with improved console logging and error messages

---

## [1.0.0] - 2025-08-25

### Added

- Initial release of AI Catalog Generator
- Image upload and management functionality
- AI-powered image enhancement using Gemini API
- Catalog layout generation with HTML/CSS output
- Professional photography enhancement presets
- TypeScript support with comprehensive type definitions
- Vite build system with hot module replacement
- Comprehensive test suite with Vitest
- Modern React 19 with hooks-based architecture

### Features

- **Image Enhancement**: Professional AI-powered image improvements
- **Catalog Generation**: Automated HTML catalog creation
- **File Management**: Drag-and-drop image upload with preview
- **Export Functionality**: Generated catalogs with downloadable assets
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Error Handling**: Robust error management with user feedback
