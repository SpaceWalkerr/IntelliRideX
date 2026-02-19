# Contributing to Deep Learning CV Research Project

First off, thank you for considering contributing to this project! 🎉

## 🌟 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (screenshots, code snippets)
- **Describe the behavior you observed** vs. what you expected
- **Include your environment details** (OS, browser, Node version)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any examples** of how it would work

### 🔧 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the existing code style**
3. **Add tests** if applicable
4. **Update documentation** if you're changing functionality
5. **Ensure the test suite passes** (`npm run test`)
6. **Run linter** (`npm run lint`)
7. **Write a clear commit message**

## 📝 Code Style Guide

### TypeScript
- Use TypeScript for all new files
- Define interfaces for complex objects
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use `memo` for expensive components

### Styling
- Use Tailwind CSS utility classes
- Follow the glassmorphism design pattern
- Ensure responsive design (mobile-first)
- Maintain dark theme consistency

### File Naming
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `PascalCase.tsx` (e.g., `DatasetsPage.tsx`)

## 🏗️ Development Workflow

1. **Clone** your fork
   ```bash
   git clone https://github.com/yourusername/autonomous-vehicle-cv-research.git
   ```

2. **Install** dependencies
   ```bash
   npm install
   ```

3. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make** your changes

5. **Test** locally
   ```bash
   npm run dev
   npm run lint
   npm run test
   ```

6. **Commit** with a clear message
   ```bash
   git commit -m "feat: add new visualization component"
   ```

7. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open** a Pull Request

## 📚 Areas to Contribute

### 🎨 UI/UX Improvements
- Enhanced animations
- Better mobile responsiveness
- Accessibility improvements (ARIA labels, keyboard navigation)
- New visualization components

### 📊 Data & Research
- Add new datasets
- Implement additional architectures
- Improve simulation accuracy
- Add real-world performance metrics

### 🧪 Testing
- Unit tests for components
- Integration tests
- E2E tests with Playwright/Cypress
- Performance benchmarks

### 📖 Documentation
- Improve README
- Add inline code comments
- Create tutorials
- Write API documentation

### 🐛 Bug Fixes
- Fix existing issues
- Improve error handling
- Optimize performance
- Cross-browser compatibility

## 🎯 Priority Areas

We're currently looking for help with:

- [ ] **Architectures Page** — Detailed model breakdowns
- [ ] **3D Point Cloud Visualization** — Interactive LiDAR viewer
- [ ] **Backend Integration** — Real model inference API
- [ ] **Upload Feature** — Custom image detection
- [ ] **Export Reports** — PDF/CSV generation

## ✅ Checklist Before Submitting PR

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] Branch is up to date with main

## 🤝 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

✅ **Positive Behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

❌ **Unacceptable Behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

## 💬 Questions?

Feel free to:
- Open an issue with the `question` label
- Reach out via email
- Join our discussions

---

Thank you for contributing! 🚀
