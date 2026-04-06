# Finflow — Finance Dashboard UI

A clean, interactive finance dashboard built for the Zorvyn Frontend Developer Intern screening assignment.

**Live Demo:** [https://financialuidashboard.vercel.app](https://financialuidashboard.vercel.app)

## Live Preview

Open `index.html` in a browser, or run locally:

```bash
npm create vite@latest finflow -- --template react
cd finflow
npm install recharts
# Replace src/App.jsx with FinflowDashboard.jsx
npm run dev
```

---

## 🎯 Features

### Core Requirements (All Implemented)

| Requirement | Status |
|---|---|
| Summary cards (Balance, Income, Expenses, Count) | ✅ |
| Time-based visualization (Balance trend line chart) | ✅ |
| Categorical visualization (Spending breakdown pie + bars) | ✅ |
| Transaction list with Date, Amount, Category, Type | ✅ |
| Search transactions | ✅ |
| Filter by type (income/expense) and category | ✅ |
| Sorting by any column | ✅ |
| Role-based UI (Admin / Viewer) | ✅ |
| Insights section | ✅ |
| State management (React useState/useMemo) | ✅ |
| Responsive design | ✅ |
| Empty / no-data states | ✅ |

### Optional Enhancements

| Enhancement | Status |
|---|---|
| Dark mode (default) + Light mode toggle | ✅ |
| Export to CSV | ✅ |
| Export to JSON | ✅ |
| Animations & transitions (fadeUp, scaleIn, slide) | ✅ |
| Toast notifications | ✅ |

---

## 🏗️ Architecture & Approach

### Component Structure
Single-file React component (`FinflowDashboard.jsx`) with clear logical sections:
- **Data layer** — Static mock data for transactions and monthly summaries
- **State** — `useState` for UI state, `useMemo` for derived/computed values
- **View** — Three tabs: Overview, Transactions, Insights

### State Management
Uses React's built-in hooks — `useState` and `useMemo` — which is well-suited for this scale:
- `transactions` — source of truth for all transaction data
- `filtered` — derived via useMemo from search/filter/sort state
- `theme`, `role`, `tab` — UI state

### Role-Based UI
Simulated on the frontend with a dropdown toggle:
- **Admin**: Can add new transactions (+ Add button), full write access
- **Viewer**: Read-only, no add/edit controls shown

### Charts
Uses `recharts` for:
- **Line chart** — 7-month balance/income/expense trend
- **Pie chart** — Spending breakdown by category
- **Bar chart** — Monthly income vs expenses comparison

---

## 📊 Data

Mock data includes 25 transactions across 3 months (Feb–Apr 2026), covering:
- Multiple income sources (salary, freelance, dividends)
- 9 expense categories (Food, Shopping, Entertainment, Transport, etc.)
- Realistic INR amounts

---

## 🎨 Design Decisions

- **Dark-first aesthetic** — Professional fintech feel, similar to Bloomberg/Zerodha
- **DM Serif Display + DM Mono** — Distinctive typography pairing; serif for numbers/headings, mono for data
- **Color-coded categories** — Each category has a consistent color across all views
- **Subtle animations** — `fadeUp` on card mount, `scaleIn` on modal — purposeful, not decorative

---

## 🔧 Tech Stack

- React 18 (hooks only, no class components)
- Recharts for data visualization
- Pure CSS with CSS variables for theming (no external UI library)
- No backend — all data is static/mock

---

*Built by Vibhuti for Zorvyn FinTech Frontend Developer Intern Assessment, April 2026.*
