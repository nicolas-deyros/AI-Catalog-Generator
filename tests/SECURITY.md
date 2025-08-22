# Security Testing Guidelines

## 🔒 Security Principles

This document outlines the security measures implemented in our testing environment to ensure safe and reliable testing practices.

## 🛡️ Test Environment Security

### Unit Tests (Vitest)

- **Process Isolation**: Tests run in isolated processes using `pool: 'forks'`
- **API Mocking**: All external API calls are intercepted with MSW
- **Environment Isolation**: Test environment variables are mocked and isolated
- **File System Security**: FileReader operations are mocked to prevent actual file access
- **XSS Prevention**: Console methods are mocked to prevent information leakage

### E2E Tests (Playwright)

- **Browser Security**: Chromium launched with security flags
- **Network Isolation**: Real API calls are intercepted and mocked
- **Permission Restrictions**: Browser permissions are disabled by default
- **Timeout Protection**: All operations have security timeouts
- **XSS Testing**: Dedicated tests verify XSS prevention mechanisms

## 🔍 Security Test Categories

### 1. Input Validation

- File upload type validation
- File size limits
- Malicious content detection
- XSS prevention in text inputs

### 2. API Security

- Request/response sanitization
- Error handling without information leakage
- Rate limiting simulation
- Authentication token handling

### 3. Data Protection

- Sensitive data masking in logs
- Environment variable protection
- Local storage security
- Session management

### 4. UI Security

- Dialog accessibility and security
- Form validation
- Error message sanitization
- Navigation security

## 🚨 Security Test Failures

If any security test fails:

1. **Stop Development**: Do not proceed until the issue is resolved
2. **Analyze Impact**: Determine the scope of the security vulnerability
3. **Fix Root Cause**: Address the underlying security issue
4. **Re-test**: Verify the fix with additional security tests
5. **Document**: Update security documentation

## 📋 Security Checklist

Before committing code, ensure:

- [ ] All unit tests pass with security mocking
- [ ] E2E tests verify XSS prevention
- [ ] File upload validation works correctly
- [ ] API error handling doesn't leak information
- [ ] Dialog components are accessible and secure
- [ ] Input sanitization is in place
- [ ] No sensitive data in test files or logs

## 🔄 Continuous Security

### Pre-commit Security Checks

1. Spell checking for potential security keywords
2. Unit tests focused on security functions
3. Linting for security anti-patterns
4. Type checking for security interfaces

### CI/CD Security Pipeline

1. Full unit test suite with security coverage
2. E2E tests covering security scenarios
3. Dependency vulnerability scanning
4. Static security analysis

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do not commit** the vulnerable code
2. **Document** the issue privately
3. **Notify** the security team immediately
4. **Wait** for security review before proceeding

## 🧪 Test Data Security

All test data follows these principles:

- **No Real Data**: Only synthetic, safe test data
- **No Credentials**: No real API keys or passwords
- **Minimal Content**: Test files are minimal and safe
- **Public Safe**: All test data can be safely committed to public repositories

Remember: Security is everyone's responsibility! 🛡️
