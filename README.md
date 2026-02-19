# 🚗 Deep Learning-Based Computer Vision for Autonomous Vehicles

> An interactive research platform exploring cutting-edge deep learning architectures for autonomous vehicle perception systems

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📖 Overview

This project presents a comprehensive, interactive research platform for exploring deep learning-based computer vision techniques in autonomous vehicles. It combines theoretical knowledge with practical simulations, allowing users to experiment with different architectures, datasets, and environmental conditions.

### 🎯 Key Objectives

- **Education**: Make complex CV/DL concepts accessible through interactive visualizations
- **Research**: Compare performance of CNN, PointNet, and Transformer architectures
- **Experimentation**: Real-time simulation of detection scenarios across weather conditions
- **Analysis**: Deep insights into model trade-offs, error patterns, and performance metrics

---

## ✨ Features

### 🏠 Home & Techniques
- **Hero Section** with animated neural network visualization
- **Research Pipeline** walkthrough (data collection → preprocessing → training → deployment)
- **Interactive Techniques Cards** covering:
  - Object Detection (YOLO, R-CNN, SSD)
  - Semantic Segmentation (U-Net, DeepLab, PSPNet)
  - 3D Object Detection (PointNet, PointPillars, VoxelNet)
  - Multi-Task Learning & Sensor Fusion

### 🗂️ Datasets Page
- **Interactive Dataset Cards** with flip animations (KITTI, Waymo, nuScenes, BDD100K)
- **Live Comparison Table** — adjust parameters (accuracy, FPS, sensor config, weather coverage) and see immediate results
- **Real-time Detection Preview** — SVG-based urban scene with:
  - Dynamic vehicles (cars, trucks, pedestrians, cyclists)
  - Environmental effects (night mode, noise, motion blur)
  - Bounding boxes with confidence scores
- **Try Your Own Method** — custom model input with radar chart comparison against baselines

### 📊 Results Dashboard
- **KPI Cards** — Animated metrics (Accuracy, FPS, Loss, Precision, Recall)
- **Visual Output Panel** 🔥 — Premium slider-based before/after comparison:
  - 🚗 Object Detection mode
  - 🛣️ Semantic Segmentation mode
  - 🚦 Lane Detection mode
- **Model Performance Charts** — Bar & line charts comparing architectures
- **Real-Time Simulation** — Control panel with live metric updates:
  - Model selector (CNN/PointNet/Transformer)
  - Dataset selector (KITTI/Waymo/nuScenes)
  - Scenario testing (Clear/Rain/Fog/Night)
- **Error Analysis** — False positive/negative breakdown
- **Trade-off Visualization** — Accuracy vs. Speed scatter plot
- **AI Insights Generator** — Auto-generated key takeaways

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** — Component-based architecture
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast dev server and build tool

### Styling & UI
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Beautiful, accessible component library
- **Radix UI** — Headless UI primitives
- **Framer Motion** — Smooth animations & transitions

### Data Visualization
- **Chart.js** — Interactive charts (Bar, Line, Radar)
- **react-chartjs-2** — React wrapper for Chart.js
- **Custom SVG** — Hand-crafted visualizations for maximum control

### State & Routing
- **React Router** — Client-side routing
- **TanStack Query** — Server state management (future API integration)
- **React Hooks** — Local state and effects

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/autonomous-vehicle-cv-research.git
   cd autonomous-vehicle-cv-research
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
research-project/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Hero.tsx
│   │   ├── HeroBackground.tsx
│   │   ├── Navbar.tsx
│   │   ├── NeuralVisual.tsx
│   │   ├── PipelineSection.tsx
│   │   └── TechniquesSection.tsx
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Home page
│   │   ├── TechniquesPage.tsx
│   │   ├── DatasetsPage.tsx
│   │   ├── ResultsPage.tsx  # Dashboard
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Design Philosophy

### Glassmorphism UI
- Semi-transparent cards with backdrop blur
- Subtle borders and shadows
- Dark theme optimized for readability

### Micro-interactions
- Smooth hover states
- Page transition animations
- Scroll-triggered reveals
- Interactive sliders and toggles

### Responsive Design
- Mobile-first approach
- Adaptive layouts (grid → stack)
- Touch-friendly controls

---

## 📊 Datasets Covered

| Dataset | Frames | Sensors | Weather | Urban/Highway |
|---------|--------|---------|---------|---------------|
| **KITTI** | 15K | Camera + LiDAR | Clear ☀️ | Urban |
| **Waymo Open** | 230K | Multi-sensor | Multi-condition 🌧️ | Both |
| **nuScenes** | 40K | Camera + Radar + LiDAR | Day/Night 🌙 | Urban |
| **BDD100K** | 100K | Camera | All weather ⛈️ | Diverse |

---

## 🧠 Architectures Explored

### 1. CNN-based
- **YOLO** (v3-v8) — Real-time object detection
- **Faster R-CNN** — Two-stage detection
- **U-Net** — Semantic segmentation

### 2. Transformer-based
- **DETR** — End-to-end detection
- **Swin Transformer** — Hierarchical vision
- **SegFormer** — Efficient segmentation

### 3. Point Cloud
- **PointNet / PointNet++** — 3D feature learning
- **PointPillars** — Fast 3D detection
- **VoxelNet** — Voxel-based detection

---

## 🔬 Research Insights

### Key Findings (from Simulation)

1. **Accuracy vs Speed Trade-off**
   - Transformers achieve 91% accuracy but run at 18 FPS
   - CNNs balance speed (45 FPS) with 76% accuracy
   - PointNet offers middle ground (86% / 25 FPS)

2. **Dataset Impact**
   - Waymo's multi-sensor data improves accuracy by 8-15%
   - KITTI's smaller size enables faster training/inference
   - nuScenes excels in night/rain scenarios

3. **Error Patterns**
   - False positives peak in dense traffic (12%)
   - False negatives common for distant objects (16%)
   - Night conditions reduce accuracy by 15%

4. **Weather Robustness**
   - Rain: -8% accuracy penalty
   - Fog: -12% accuracy drop
   - Night: -15% with standard models

---

## 🛣️ Roadmap

### ✅ Completed
- [x] Home page with neural network visualization
- [x] Techniques overview page
- [x] Dataset comparison page with live simulation
- [x] Results dashboard with 8 analysis sections
- [x] Interactive slider-based before/after visualization
- [x] Real-time scenario testing

### 🚧 In Progress
- [ ] Architectures page (detailed model breakdowns)
- [ ] Challenges page (edge cases, adversarial examples)
- [ ] Future Scope page (trends, emerging tech)

### 🔮 Future Enhancements
- [ ] Backend integration (real model inference)
- [ ] Upload custom images for detection
- [ ] Export comparison reports (PDF/CSV)
- [ ] 3D visualization of point clouds
- [ ] Model training playground
- [ ] Community contributions (share custom models)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code style (ESLint configured)
- Add comments for complex logic
- Test across browsers (Chrome, Firefox, Safari)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Datasets
- [KITTI Vision Benchmark](http://www.cvlibs.net/datasets/kitti/)
- [Waymo Open Dataset](https://waymo.com/open/)
- [nuScenes Dataset](https://www.nuscenes.org/)
- [BDD100K Dataset](https://bdd-data.berkeley.edu/)

### Inspirations
- YOLO (Redmon et al.)
- PointNet (Qi et al.)
- DETR (Carion et al.)
- Various computer vision research papers

### Tools & Libraries
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Chart.js](https://www.chartjs.org/) — Charting library
- [Lucide Icons](https://lucide.dev/) — Icon set

---

## 📧 Contact

**Project Maintainer**: Suraj Nandan
**Email**: surajnandan782gmail.com
**GitHub**: [@SpaceWalkerr](https://github.com/SpaceWalkerr)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐️

---

<div align="center">
  <p>Built with ❤️ for the autonomous vehicle research community</p>
  <p>© 2026 Deep Learning CV Research Project</p>
</div>
