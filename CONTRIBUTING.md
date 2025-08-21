# Contributing to AI Catalog Creator

First off, thank you for considering contributing to the AI Catalog Creator! Your help is greatly appreciated.

This document provides guidelines for contributing to the project. Please feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior. (Note: A `CODE_OF_CONDUCT.md` file would need to be added, typically using a template like the Contributor Covenant).

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/your-repo/ai-catalog-creator/issues). If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/your-repo/ai-catalog-creator/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for an enhancement, please open an issue to discuss it. This allows us to coordinate our efforts and prevent duplicated work.

### Pull Requests

We welcome pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Development Setup

To get started with the development environment, please follow the instructions in the [README.md](./README.md) file.

### Development Workflow

1.  Fork the repository and create your branch from `main`.
2.  Make your changes.
3.  Before submitting your changes, please run the code quality checks.

### Code Quality Checks

We use ESLint, stylelint, and Prettier to maintain code quality and a consistent style.

- **To run all linters:**

  ```bash
  npm run lint
  ```

- **To automatically format your code:**
  ```bash
  npm run format
  ```

Please ensure that all checks pass before submitting a pull request.

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This allows for automated changelog generation and makes the project history easier to read.

A commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Example:**

```
feat: Allow users to choose catalog page size
```

```
fix: Correctly handle API errors in image enhancer
```

Common types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`.

Thank you for your contribution!
