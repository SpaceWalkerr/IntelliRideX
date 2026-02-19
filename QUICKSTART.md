# ⚡ Quick Start Guide

Get the Deep Learning CV Research Project running in **under 2 minutes**!

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed ([Download](https://git-scm.com/downloads))

### Step 1: Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/autonomous-vehicle-cv-research.git
cd autonomous-vehicle-cv-research

# Install dependencies (choose one)
npm install        # npm
yarn install       # yarn
pnpm install       # pnpm
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:5173
```

**That's it!** 🎉 The project is now running locally.

---

## 📱 Available Commands

```bash
# Development
npm run dev          # Start dev server (hot reload enabled)

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Quality Checks
npm run lint         # Run ESLint
npm run test         # Run tests (Vitest)

# Type Checking
npm run type-check   # Check TypeScript types (if configured)
```

---

## 🎯 First-Time User Guide

### What to Explore First

1. **🏠 Home Page** (`/`)
   - Scroll down to see the neural network animation
   - Check out the research pipeline section
   
2. **🔬 Techniques Page** (`/techniques`)
   - Hover over technique cards
   - Click to expand accordion sections
   
3. **📊 Datasets Page** (`/datasets`)
   - Flip the dataset cards
   - Adjust comparison sliders
   - Try the simulation controls
   - Add your own custom method
   
4. **📈 Results Dashboard** (`/dashboard`)
   - Drag the visual output slider
   - Switch between detection modes
   - Change model/dataset/scenario
   - Watch metrics update in real-time

---

## 🎨 Customization Quick Tips

### Change Color Theme
Edit `src/index.css` (lines 8-20) to modify HSL color values:
```css
--primary: 210 100% 56%;      /* Blue */
--secondary: 250 80% 62%;     /* Purple */
--accent: 142 76% 54%;        /* Green */
```

### Add New Page
1. Create `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/your-page" element={<YourPage />} />
   ```
3. Add nav item in `src/components/Navbar.tsx`:
   ```tsx
   { label: "Your Page", path: "/your-page", ready: true }
   ```

### Modify Simulation Data
Edit `src/pages/ResultsPage.tsx` (lines 30-60) to adjust:
- Model architectures
- Dataset metrics
- Scenario penalties

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts
server: { port: 3000 }
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run lint

# Clean build
rm -rf dist
npm run build
```

### "Module not found" Error
```bash
# Verify all dependencies are installed
npm install

# Check import paths (should use @ alias)
import Component from "@/components/Component"
```

---

## 🌐 Deployment

### Vercel (Recommended - Free)
```bash
npm i -g vercel
vercel login
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### GitHub Pages
```bash
# Add to vite.config.ts
base: '/repository-name/'

# Build and deploy
npm run build
npx gh-pages -d dist
```

---

## 📚 Learn More

- **React Docs**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/
- **Framer Motion**: https://www.framer.com/motion/

---

## 🆘 Need Help?

- Open an issue on GitHub
- Check the [CONTRIBUTING.md](CONTRIBUTING.md) guide
- Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for detailed info

---

## ⚡ Pro Tips

1. **Fast Refresh**: Save files to see instant updates (no page reload!)
2. **DevTools**: Open browser console to see any errors
3. **Mobile View**: Use browser DevTools responsive mode (Cmd+Shift+M / F12)
4. **Lighthouse**: Run audit in Chrome DevTools for performance insights
5. **Git Commits**: Commit often with clear messages (e.g., "feat: add new chart")

---

**Happy Coding!** 🚀
