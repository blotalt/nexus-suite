# 🌟 Nexus Suite - All-In-One Modern Web Platform

A production-grade, responsive single-page web application featuring high-performance vanilla engineering, glassmorphism aesthetics, interactive SVG telemetry, and modular architecture.

---

## 🚀 Live Modules Included

### 1. 📊 SaaS Analytics & Telemetry Dashboard
* **Real-Time KPIs**: Live updating telemetry for MRR ($148,290), Active Users (48k), Conversion Rate (3.84%), and SLA Uptime (99.98%).
* **Interactive SVG Area & Line Chart**: Dynamic multi-range filtering (`7D`, `30D`, `90D`, `1Y`) with smooth cubic bezier curves, gradient fills, and data points.
* **Infrastructure Distribution**: Real-time progress bars tracking global cloud cluster bandwidth.
* **Ledger Filter**: Live customer search and status badges (Settled, Processing).

### 2. 🛍️ E-Commerce Showcase & Marketplace
* **Product Catalog**: High-end engineering audio, wearables, and workspace accessories with ratings, reviews, and badges (`HOT`, `NEW`, `SALE`).
* **Filtering & Sorting**: Instant category switching (Audio, Wearables, Gadgets, Accessories) and sorting (Price low-high, high-low, rating).
* **Slide-Over Cart Drawer**:
  - Live quantity adjustment (`+` / `−`), automatic removal at zero.
  - Subtotal calculation with simulated sales tax.
* **Quick View Modal & Checkout Flow**: Full checkout simulation with confirmation notifications.

### 3. 🤖 AI Reasoning & Prompt Playground Studio
* **Multi-Model Selector**: Switch between Gemini 3.8 Pro, Claude 3.5 Sonnet, GPT-4o, and DeepSeek R1 with latency benchmarks.
* **Prompt Template Library**:
  - Code Security & Performance Audit
  - Quantum Superposition Explanation
  - High-traffic SQL Query & Indexing Optimization
  - Modern SaaS Hero Landing Copywriting
* **Simulated Streaming Output**: Realistic typing effect at 60 FPS with styled code snippets and active token counters.

### 4. 📋 Interactive Kanban Sprint Board
* **Workflow Columns**: Backlog, In Progress, Review, and Completed.
* **Drag-and-Drop Interaction**: Native HTML5 Drag and Drop across columns with visual drag-over feedback.
* **Task Management**:
  - Modal to create custom tasks with title, description, priority (`High`, `Medium`, `Low`), and status.
  - Quick task deletion and live keyword filtering.

### 5. 💼 Developer & Creative Agency Portfolio
* **Hero Platform**: Bold typography, gradient accents, experience milestones (10+ Years, 45+ Shipped Products, 1.2M+ Users).
* **Case Study Deep-Dives**: Interactive modal breakdowns for high-throughput WebAssembly systems, AI design tooling, and distributed task orchestrators.
* **Skills Proficiency Radar**: Domain breakdown with visual percentage tracks.
* **Working Inquiry Form**: Full validation, simulated network submission state, and notification toasts.

---

## 🎨 Global Features

* **Dark & Light Mode**: Seamless theme toggle with local storage persistence and WCAG-compliant contrast ratios.
* **Command Palette (`Ctrl+K` / `Cmd+K`)**: Fast keyboard-driven command navigation to jump to any module or execute actions instantly.
* **Toast Notification Engine**: Animated real-time user feedback for actions across the app.
* **Responsive Layout**: Designed for mobile smartphones, tablets, and ultrawide desktops.

---

## 📁 Project Structure

```
nexus-suite/
├── index.html            # Core HTML5 application shell & modals
├── css/
│   └── styles.css        # Master design system tokens & responsive CSS
├── js/
│   ├── app.js            # Orchestrator, theme engine, command palette, toast alerts
│   ├── dashboard.js      # SVG chart renderer & telemetry simulation
│   ├── store.js          # E-Commerce state, cart drawer, checkout modal
│   ├── ai-studio.js      # AI chat simulation, model switching, code formatting
│   ├── kanban.js         # Drag-and-drop Kanban workflow & task manager
│   └── portfolio.js      # Case studies, skill bars & contact form handler
└── README.md             # Complete documentation and user guide
```

---

## ⚡ How to Run Locally

You can open `index.html` directly in any modern web browser or serve it using any standard static file server:

### Option A: Direct Browser Launch
Double-click `index.html` or open it with Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option B: Local Python HTTP Server
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

### Option C: Node.js (npx serve)
```bash
npx -y serve .
```

---

## 🛠️ Customization

- **Change Default Theme**: Modify `data-theme="dark"` on `<html>` in `index.html` to `data-theme="light"`.
- **Add New Products**: Add items to the `products` array in `js/store.js`.
- **Add New AI Models or Prompts**: Update the `models` and `cannedKnowledge` objects in `js/ai-studio.js`.
- **Color Tokens**: Customize `--accent-primary` or background gradients in `css/styles.css`.
