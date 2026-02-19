# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🚀 Planned
- Architectures page with detailed model breakdowns
- Challenges page covering edge cases and adversarial examples
- Future Scope page exploring emerging technologies
- Backend integration for real model inference
- Custom image upload for live detection
- 3D point cloud visualization
- Export functionality (PDF/CSV reports)

---

## [0.1.0] - 2026-02-20

### ✨ Added

#### Pages
- **Home Page** — Hero section with animated neural network background, research pipeline walkthrough
- **Techniques Page** — Interactive cards covering object detection, segmentation, 3D detection, and sensor fusion
- **Datasets Page** — Dataset comparison with live simulation and custom method testing
- **Results Dashboard** — Comprehensive analytics with 8 major sections

#### Core Features
- **Navigation System** — Responsive navbar with route detection and mobile menu
- **Neural Network Visualization** — Animated SVG neural network with flowing data
- **Interactive Dataset Cards** — 3D flip animations revealing key statistics
- **Live Comparison Table** — 6-parameter model comparison with real-time updates
- **Detection Preview** — SVG urban scene with dynamic vehicles, buildings, and environmental effects
- **Custom Method Testing** — 10-field input form with radar chart visualization
- **KPI Dashboard** — 5 animated metric cards with color-coded status
- **Visual Output Panel** ⭐ — Premium slider-based before/after comparison with 3 detection modes:
  - Object Detection (bounding boxes)
  - Semantic Segmentation (pixel-level labels)
  - Lane Detection (drivable area highlighting)
- **Real-Time Simulation** — Interactive control panel with model/dataset/scenario selectors
- **Performance Charts** — Bar and line charts comparing architectures across datasets
- **Error Analysis** — False positive/negative breakdown with insights
- **Trade-off Visualization** — Accuracy vs. speed scatter plot
- **AI Insights Generator** — Auto-generated key takeaways

#### Technical Implementation
- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast dev server and optimized builds
- **Tailwind CSS** with custom glassmorphism design system
- **shadcn/ui** component library with Radix UI primitives
- **Framer Motion** for smooth animations and page transitions
- **Chart.js** with react-chartjs-2 for interactive data visualization
- **React Router** for client-side routing
- **Custom SVG renderers** for pixel-perfect visualizations

#### Design System
- Glassmorphism UI with backdrop blur effects
- Dark theme optimized for readability
- Responsive layouts (mobile-first approach)
- Micro-interactions on hover/focus states
- Scroll-triggered reveal animations
- Color-coded metrics (green/yellow/red indicators)

#### Documentation
- Comprehensive README.md with installation guide
- MIT License for open-source distribution
- CONTRIBUTING.md with development guidelines
- CHANGELOG.md for version tracking

### 🎨 Design Highlights
- Professional gradient text effects
- Semi-transparent cards with subtle borders
- Animated counters with smooth transitions
- Interactive sliders with real-time preview
- Custom SVG shapes (vehicles, buildings, pedestrians)
- Night mode with glowing lights and stars

### 📊 Data & Simulation
- 3 model architectures (CNN, PointNet, Transformer)
- 3 datasets (KITTI, Waymo, nuScenes)
- 4 weather scenarios (Clear, Rain, Fog, Night)
- Dynamic metric calculation based on conditions
- Realistic performance penalties for adverse weather

### 🧪 Quality Assurance
- TypeScript for compile-time error detection
- ESLint configuration for code quality
- Zero compilation errors
- Responsive design tested across viewports

---

## Version History

### Version Naming Convention
- **Major (X.0.0)**: Breaking changes, major feature additions
- **Minor (0.X.0)**: New features, backward-compatible
- **Patch (0.0.X)**: Bug fixes, minor improvements

### Release Schedule
- **Alpha**: Internal testing (v0.1.x - v0.5.x)
- **Beta**: Public preview (v0.6.x - v0.9.x)
- **Stable**: Production-ready (v1.0.0+)

---

## Notes

### Types of Changes
- `Added` ✨ — New features
- `Changed` 🔄 — Changes in existing functionality
- `Deprecated` ⚠️ — Soon-to-be removed features
- `Removed` 🗑️ — Removed features
- `Fixed` 🐛 — Bug fixes
- `Security` 🔒 — Vulnerability patches
