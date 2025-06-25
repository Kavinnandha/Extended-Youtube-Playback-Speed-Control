# Contributing to YouTube Speed Extender

Thank you for considering contributing to YouTube Speed Extender! This document provides guidelines for contributing to the project.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before submitting a bug report:
1. **Check existing issues** to avoid duplicates
2. **Test with latest version** to ensure the bug still exists
3. **Disable other extensions** to rule out conflicts

When submitting a bug report, include:
- **Chrome version** and operating system
- **Extension version**
- **Detailed steps to reproduce**
- **Expected vs actual behavior**
- **Console errors** (if any)
- **Screenshots or recordings** (if helpful)

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to [URL]
2. Click on [element]
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Chrome Version: 
- Extension Version: 
- OS: 
- Other extensions: 

## Additional Context
Console errors, screenshots, etc.
```

### 💡 Suggesting Features

Feature requests are welcome! When suggesting features:
1. **Check existing issues** for similar requests
2. **Describe the use case** - why would this be useful?
3. **Provide implementation ideas** if you have them
4. **Consider impact** on performance and user experience

**Feature Request Template:**
```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why would this feature be useful?

## Proposed Implementation
How could this feature work?

## Alternatives Considered
Other ways to solve the same problem

## Additional Context
Mockups, examples, etc.
```

## 🔨 Development Guidelines

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Custom-Youtube-Playback-Speed-Control.git
   cd Custom-Youtube-Playback-Speed-Control
   ```

2. **Load extension in Browser**
   - Open `/extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

3. **Make changes**
   - Edit `content.js` for main functionality
   - Update `manifest.json` for permissions/metadata
   - Add icons in `icons/` folder

4. **Test changes**
   - Reload extension in Chrome
   - Test on YouTube videos
   - Check console for errors

### Code Style Guidelines

#### JavaScript Style
- **ES6+ syntax** where supported
- **Consistent indentation** (2 spaces)
- **Meaningful variable names**
- **JSDoc comments** for functions
- **Error handling** for all operations

**Example:**
```javascript
/**
 * Applies the user's preferred speed to the current video
 * @param {boolean} isNavigation - Whether this is called during navigation
 */
function applyPreferredSpeed(isNavigation = false) {
  const video = document.querySelector('video');
  if (!video) return;
  
  try {
    // Implementation
  } catch (error) {
    console.warn('Failed to apply preferred speed:', error);
  }
}
```

#### Naming Conventions
- **Functions**: camelCase (`applyPreferredSpeed`)
- **Variables**: camelCase (`currentSpeed`)
- **Constants**: UPPER_SNAKE_CASE (`SPEED_STORAGE_KEY`)
- **Event handlers**: descriptive names (`setupModalEventListeners`)

#### Comment Guidelines
- **Function headers** with JSDoc format
- **Complex logic** explanation
- **TODO comments** for future improvements
- **Avoid obvious comments**

### Architecture Principles

#### Separation of Concerns
- **Storage functions**: Handle localStorage operations
- **UI functions**: Manage DOM manipulation
- **Event handlers**: Process user interactions
- **Utility functions**: Provide helper functionality

#### Error Handling
- **Graceful degradation**: Continue working when possible
- **Silent failures**: Don't break YouTube's functionality
- **Console warnings**: Log errors for debugging

#### Performance Considerations
- **Debouncing**: Prevent excessive API calls
- **Event delegation**: Minimize event listeners
- **DOM caching**: Store frequently accessed elements
- **Memory management**: Clean up timeouts and observers

### Testing Guidelines

#### Manual Testing Checklist
- [ ] **Speed changes** work with keyboard shortcuts
- [ ] **Settings modal** opens and saves correctly
- [ ] **Navigation** maintains speed based on mode
- [ ] **YouTube controls** sync properly
- [ ] **Multiple videos** work in sequence
- [ ] **Seeking** maintains preferred speed
- [ ] **No console errors** during normal operation

#### Testing Different Scenarios
1. **Fresh page load**
2. **YouTube navigation** (same tab)
3. **Settings changes** while video playing
4. **Multiple browser tabs**
5. **YouTube's native speed changes**
6. **Video seeking operations**

### Commit Guidelines

#### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```
feat(shortcuts): add customizable keyboard shortcuts

- Allow users to configure increase/decrease speed keys
- Add settings modal for key configuration
- Save preferences to localStorage

Closes #15
```

```
fix(navigation): prevent speed reset on video seeking

- Add seeking event handlers
- Maintain preferred speed after seek operations
- Improve state management during seeking

Fixes #23
```

### Pull Request Guidelines

#### Before Submitting
1. **Test thoroughly** with the manual testing checklist
2. **Update documentation** if needed
3. **Add comments** for complex logic
4. **Check for console errors**
5. **Verify no regression** in existing features

#### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing Done
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Works across different videos

## Screenshots (if applicable)
Before/after screenshots or GIFs

## Related Issues
Closes #[issue number]
```

#### Review Process
1. **Automated checks** (if set up)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Feedback incorporation**
5. **Final approval and merge**

## 📚 Documentation Guidelines

### Code Documentation
- **JSDoc comments** for all public functions
- **Inline comments** for complex logic
- **README updates** for new features
- **API documentation** for public interfaces

### User Documentation
- **Clear instructions** in README
- **Troubleshooting guides** for common issues
- **Feature descriptions** with use cases
- **Installation guides** for different scenarios

## 🏗️ Project Structure

### File Organization
```
Custom-Youtube-Playback-Speed-Control/
├── content.js              # Main content script
├── manifest.json           # Extension manifest
├── icons/                  # Extension icons
├── README.md              # Main documentation
├── API.md                 # API documentation
├── CONTRIBUTING.md        # This file
└── docs/                  # Additional documentation
    ├── INSTALLATION.md
    ├── TROUBLESHOOTING.md
    └── CHANGELOG.md
```

### Adding New Files
- **Minimize file count** when possible
- **Use descriptive names**
- **Update manifest.json** if needed
- **Document new files** in README

## 🎯 Feature Development Workflow

### 1. Planning Phase
- **Create issue** describing the feature
- **Discuss implementation** approach
- **Get approval** from maintainers
- **Plan testing strategy**

### 2. Development Phase
- **Create feature branch** from main
- **Implement core functionality**
- **Add error handling**
- **Write documentation**

### 3. Testing Phase
- **Test manually** with checklist
- **Test edge cases**
- **Verify no regressions**
- **Get feedback** from others

### 4. Review Phase
- **Submit pull request**
- **Address review feedback**
- **Update documentation** if needed
- **Prepare for merge**

## 🚀 Release Process

### Version Numbering
- **Major**: Breaking changes or major features
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes and small improvements

### Release Checklist
- [ ] **All tests passing**
- [ ] **Documentation updated**
- [ ] **CHANGELOG.md updated**
- [ ] **Version bumped** in manifest.json
- [ ] **Tag created** with version number

## 💬 Community Guidelines

### Communication
- **Be respectful** and professional
- **Be constructive** in feedback
- **Help others** when possible
- **Ask questions** when unclear

### Issue Discussion
- **Stay on topic**
- **Provide helpful information**
- **Avoid duplicate discussions**
- **Use appropriate labels**

## 🙋 Getting Help

### Where to Ask Questions
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Code comments**: For implementation-specific questions

### What Information to Include
- **Clear description** of your question
- **Context** about what you're trying to achieve
- **Code examples** if relevant
- **Environment details** if applicable

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to YouTube Speed Extender! Your help makes this extension better for everyone. 🎉
