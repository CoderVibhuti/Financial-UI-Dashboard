import { useState, useMemo, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── DATA ───────────────────────────────────────────────────────────────────
const RAW_TRANSACTIONS = [
  { id: 1,  date: "2026-04-01", description: "Salary Credit",       category: "Income",        type: "income",  amount: 85000 },
  { id: 2,  date: "2026-04-02", description: "Amazon Shopping",     category: "Shopping",      type: "expense", amount: 3200  },
  { id: 3,  date: "2026-04-03", description: "Netflix Subscription",category: "Entertainment", type: "expense", amount: 649   },
  { id: 4,  date: "2026-04-03", description: "Swiggy Order",        category: "Food & Dining", type: "expense", amount: 520   },
  { id: 5,  date: "2026-04-04", description: "Electricity Bill",    category: "Utilities",     type: "expense", amount: 1800  },
  { id: 6,  date: "2026-04-04", description: "Freelance Payment",   category: "Income",        type: "income",  amount: 12000 },
  { id: 7,  date: "2026-04-05", description: "Petrol",              category: "Transport",     type: "expense", amount: 2500  },
  { id: 8,  date: "2026-04-05", description: "Gym Membership",      category: "Health",        type: "expense", amount: 1500  },
  { id: 9,  date: "2026-03-28", description: "Zomato Order",        category: "Food & Dining", type: "expense", amount: 340   },
  { id: 10, date: "2026-03-27", description: "Airtel Recharge",     category: "Utilities",     type: "expense", amount: 299   },
  { id: 11, date: "2026-03-25", description: "Movie Tickets",       category: "Entertainment", type: "expense", amount: 800   },
  { id: 12, date: "2026-03-24", description: "Dividend Income",     category: "Income",        type: "income",  amount: 4500  },
  { id: 13, date: "2026-03-22", description: "Grocery – DMart",     category: "Food & Dining", type: "expense", amount: 2800  },
  { id: 14, date: "2026-03-20", description: "Salary Credit",       category: "Income",        type: "income",  amount: 85000 },
  { id: 15, date: "2026-03-18", description: "Uber Rides",          category: "Transport",     type: "expense", amount: 1200  },
  { id: 16, date: "2026-03-15", description: "Doctor Visit",        category: "Health",        type: "expense", amount: 600   },
  { id: 17, date: "2026-03-12", description: "Online Course",       category: "Education",     type: "expense", amount: 4999  },
  { id: 18, date: "2026-03-10", description: "Spotify Premium",     category: "Entertainment", type: "expense", amount: 119   },
  { id: 19, date: "2026-03-08", description: "Water Bill",          category: "Utilities",     type: "expense", amount: 150   },
  { id: 20, date: "2026-03-05", description: "Consulting Fee",      category: "Income",        type: "income",  amount: 8000  },
  { id: 21, date: "2026-02-28", description: "Salary Credit",       category: "Income",        type: "income",  amount: 85000 },
  { id: 22, date: "2026-02-25", description: "Rent Payment",        category: "Housing",       type: "expense", amount: 18000 },
  { id: 23, date: "2026-02-20", description: "Flight Tickets",      category: "Travel",        type: "expense", amount: 12500 },
  { id: 24, date: "2026-02-15", description: "Restaurant Dinner",   category: "Food & Dining", type: "expense", amount: 1800  },
  { id: 25, date: "2026-02-10", description: "Amazon Prime",        category: "Entertainment", type: "expense", amount: 299   },
];

const MONTHLY_DATA = [
  { month: "Oct", income: 89000, expenses: 34200, balance: 54800 },
  { month: "Nov", income: 92000, expenses: 41000, balance: 51000 },
  { month: "Dec", income: 97000, expenses: 56000, balance: 41000 },
  { month: "Jan", income: 85000, expenses: 38500, balance: 46500 },
  { month: "Feb", income: 93000, expenses: 45600, balance: 47400 },
  { month: "Mar", income: 104500, expenses: 39500, balance: 65000 },
  { month: "Apr", income: 97000, expenses: 10169, balance: 86831 },
];

const CAT_COLORS = {
  "Income":        "#10b981",
  "Food & Dining": "#f59e0b",
  "Shopping":      "#8b5cf6",
  "Entertainment": "#ec4899",
  "Transport":     "#3b82f6",
  "Utilities":     "#6366f1",
  "Health":        "#14b8a6",
  "Housing":       "#ef4444",
  "Travel":        "#f97316",
  "Education":     "#06b6d4",
};

const fmt = (n) => "₹" + n.toLocaleString("en-IN");
const fmtShort = (n) => n >= 100000 ? "₹" + (n / 100000).toFixed(1) + "L" : n >= 1000 ? "₹" + (n / 1000).toFixed(0) + "K" : "₹" + n;

// ─── STYLES (CSS-in-JS via style tag) ────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0a0d14;
      --surface:   #111827;
      --surface2:  #1a2235;
      --border:    #1f2d45;
      --border2:   #243148;
      --text:      #e2e8f0;
      --muted:     #64748b;
      --accent:    #3b82f6;
      --green:     #10b981;
      --red:       #ef4444;
      --amber:     #f59e0b;
    }
    .light {
      --bg:        #f1f5f9;
      --surface:   #ffffff;
      --surface2:  #f8fafc;
      --border:    #e2e8f0;
      --border2:   #cbd5e1;
      --text:      #0f172a;
      --muted:     #94a3b8;
      --accent:    #2563eb;
      --green:     #059669;
      --red:       #dc2626;
      --amber:     #d97706;
    }

    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

    .app { min-height: 100vh; background: var(--bg); }

    /* HEADER */
    .header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex; align-items: center; justify-content: space-between;
      height: 60px;
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(12px);
    }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-mark {
      width: 32px; height: 32px; background: var(--accent);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-family: 'DM Serif Display'; font-size: 18px; color: white; font-weight: bold;
    }
    .logo-text { font-family: 'DM Serif Display'; font-size: 20px; color: var(--text); letter-spacing: -0.5px; }
    .header-right { display: flex; align-items: center; gap: 12px; }

    .role-badge {
      display: flex; align-items: center; gap: 6px;
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; padding: 4px 8px; font-size: 12px;
      font-family: 'DM Mono'; cursor: pointer; color: var(--text);
    }
    .role-select {
      background: transparent; border: none; outline: none;
      color: var(--text); font-family: 'DM Mono'; font-size: 12px; cursor: pointer;
    }
    .theme-btn {
      width: 34px; height: 34px; border-radius: 8px;
      background: var(--surface2); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px; color: var(--text);
      transition: all 0.2s;
    }
    .theme-btn:hover { background: var(--border); }

    /* NAV */
    .nav {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex; gap: 4px;
    }
    .nav-btn {
      padding: 10px 16px; border: none; background: transparent;
      color: var(--muted); font-family: 'DM Sans'; font-size: 13px;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all 0.2s; display: flex; align-items: center; gap: 6px;
    }
    .nav-btn:hover { color: var(--text); }
    .nav-btn.active { color: var(--accent); border-bottom-color: var(--accent); }

    /* MAIN */
    .main { padding: 24px; max-width: 1400px; margin: 0 auto; }

    /* CARDS */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 20px;
      transition: border-color 0.2s;
      animation: fadeUp 0.4s ease both;
    }
    .card:hover { border-color: var(--border2); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .card-label {
      font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px;
      color: var(--muted); font-family: 'DM Mono'; margin-bottom: 8px;
    }
    .card-value {
      font-size: 28px; font-weight: 600; color: var(--text);
      font-family: 'DM Serif Display'; letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .card-sub { font-size: 12px; color: var(--muted); margin-top: 6px; }
    .card-chip {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(16,185,129,0.1); color: var(--green);
      border-radius: 6px; padding: 2px 8px; font-size: 11px;
      font-family: 'DM Mono'; font-weight: 500; margin-top: 6px;
    }
    .card-chip.neg { background: rgba(239,68,68,0.1); color: var(--red); }

    /* GRIDS */
    .summary-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .charts-grid {
      display: grid; grid-template-columns: 2fr 1fr;
      gap: 16px; margin-bottom: 24px;
    }
    @media (max-width: 900px) {
      .charts-grid { grid-template-columns: 1fr; }
      .main { padding: 16px; }
    }

    /* CHART */
    .chart-title {
      font-size: 13px; font-weight: 600; color: var(--text);
      margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;
    }
    .chart-legend { display: flex; gap: 12px; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
    .legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); }

    /* TRANSACTIONS */
    .tx-controls {
      display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;
    }
    .search-box {
      flex: 1; min-width: 180px; background: var(--surface2);
      border: 1px solid var(--border); border-radius: 8px;
      padding: 8px 12px; color: var(--text); font-family: 'DM Sans'; font-size: 13px;
      outline: none; transition: border-color 0.2s;
    }
    .search-box:focus { border-color: var(--accent); }
    .search-box::placeholder { color: var(--muted); }
    .filter-select {
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 12px;
      color: var(--text); font-family: 'DM Sans'; font-size: 13px;
      outline: none; cursor: pointer;
    }
    .export-btn {
      background: var(--accent); color: white; border: none;
      border-radius: 8px; padding: 8px 14px; font-size: 13px;
      font-family: 'DM Sans'; cursor: pointer; display: flex; align-items: center; gap: 6px;
      transition: opacity 0.2s; white-space: nowrap;
    }
    .export-btn:hover { opacity: 0.85; }
    .add-btn {
      background: var(--green); color: white; border: none;
      border-radius: 8px; padding: 8px 14px; font-size: 13px;
      font-family: 'DM Sans'; cursor: pointer; display: flex; align-items: center; gap: 6px;
      transition: opacity 0.2s;
    }
    .add-btn:hover { opacity: 0.85; }

    /* TABLE */
    .tx-table { width: 100%; border-collapse: collapse; }
    .tx-table th {
      text-align: left; font-size: 11px; text-transform: uppercase;
      letter-spacing: 1px; color: var(--muted); padding: 8px 12px;
      border-bottom: 1px solid var(--border); font-family: 'DM Mono';
      cursor: pointer; user-select: none;
    }
    .tx-table th:hover { color: var(--text); }
    .tx-table td {
      padding: 12px 12px; font-size: 13px; border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .tx-table tr:last-child td { border-bottom: none; }
    .tx-table tr { transition: background 0.15s; }
    .tx-table tr:hover td { background: var(--surface2); }

    .cat-pill {
      display: inline-block; padding: 2px 8px; border-radius: 20px;
      font-size: 11px; font-family: 'DM Mono';
    }
    .amount-income { color: var(--green); font-family: 'DM Mono'; font-weight: 500; }
    .amount-expense { color: var(--red); font-family: 'DM Mono'; font-weight: 500; }
    .date-cell { color: var(--muted); font-family: 'DM Mono'; font-size: 12px; }

    /* INSIGHTS */
    .insight-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .insight-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 20px;
      animation: fadeUp 0.4s ease both;
    }
    .insight-title {
      font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px;
      color: var(--muted); font-family: 'DM Mono'; margin-bottom: 12px;
    }
    .insight-value {
      font-size: 22px; font-weight: 600; font-family: 'DM Serif Display';
      color: var(--text); margin-bottom: 4px;
    }
    .insight-sub { font-size: 12px; color: var(--muted); }

    .bar-row {
      display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
    }
    .bar-label { font-size: 12px; width: 90px; color: var(--text); flex-shrink: 0; }
    .bar-track {
      flex: 1; height: 6px; background: var(--surface2);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
    .bar-amount { font-size: 11px; font-family: 'DM Mono'; color: var(--muted); width: 60px; text-align: right; }

    /* MODAL */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center; z-index: 200;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 28px; width: 90%; max-width: 440px;
      animation: scaleIn 0.2s ease;
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-title {
      font-family: 'DM Serif Display'; font-size: 20px; margin-bottom: 20px; color: var(--text);
    }
    .form-group { margin-bottom: 14px; }
    .form-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); display: block; margin-bottom: 6px; font-family: 'DM Mono'; }
    .form-input {
      width: 100%; background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; padding: 9px 12px; color: var(--text);
      font-family: 'DM Sans'; font-size: 13px; outline: none; transition: border-color 0.2s;
    }
    .form-input:focus { border-color: var(--accent); }
    .modal-btns { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
    .btn-cancel {
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; padding: 8px 16px; color: var(--text);
      font-family: 'DM Sans'; font-size: 13px; cursor: pointer;
    }
    .btn-submit {
      background: var(--accent); border: none; border-radius: 8px;
      padding: 8px 16px; color: white; font-family: 'DM Sans'; font-size: 13px; cursor: pointer;
    }

    /* EMPTY */
    .empty { text-align: center; padding: 48px 24px; color: var(--muted); }
    .empty-icon { font-size: 36px; margin-bottom: 12px; }
    .empty-text { font-size: 14px; }

    /* TOAST */
    .toast {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--surface); border: 1px solid var(--green);
      border-radius: 10px; padding: 12px 18px;
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: var(--text); z-index: 300;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* TOOLTIP */
    .recharts-tooltip-wrapper { outline: none; }
    .custom-tooltip {
      background: var(--surface2); border: 1px solid var(--border);
      border-radius: 8px; padding: 10px 14px; font-size: 12px; font-family: 'DM Mono';
    }
    .custom-tooltip .label { color: var(--muted); margin-bottom: 4px; }
    .custom-tooltip .val { color: var(--text); font-weight: 500; }

    /* SCROLLBAR */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

    /* SECTION HEAD */
    .section-head {
      font-family: 'DM Serif Display'; font-size: 17px; color: var(--text);
      margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    }
    .section-head::after {
      content: ''; flex: 1; height: 1px; background: var(--border); margin-left: 8px;
    }

    .tx-scroll { overflow-x: auto; }

    /* Stagger animations */
    .card:nth-child(1) { animation-delay: 0.05s; }
    .card:nth-child(2) { animation-delay: 0.1s; }
    .card:nth-child(3) { animation-delay: 0.15s; }
    .card:nth-child(4) { animation-delay: 0.2s; }
  `}</style>
);

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="val" style={{ color: p.color }}>{p.name}: {fmtShort(p.value)}</div>
      ))}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FinflowDashboard() {
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("overview");
  const [transactions, setTransactions] = useState(RAW_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [newTx, setNewTx] = useState({ description: "", amount: "", category: "Food & Dining", type: "expense", date: "2026-04-05" });

  const isAdmin = role === "admin";

  // Theme toggle
  useEffect(() => {
    document.documentElement.className = theme === "light" ? "light" : "";
  }, [theme]);

  // Summary
  const totalIncome  = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance      = totalIncome - totalExpense;
  const savings      = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Filtered + sorted transactions
  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCat !== "all") list = list.filter(t => t.category === filterCat);
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "amount") { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCat, sortKey, sortDir]);

  const categories = useMemo(() => [...new Set(transactions.map(t => t.category))].sort(), [transactions]);

  // Spending by category (pie)
  const spendByCat = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Insights
  const topCat   = spendByCat[0];
  const lastMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const thisMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const expDelta  = (((thisMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100).toFixed(1);

  // Sort handler
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  // Add transaction
  const handleAdd = () => {
    if (!newTx.description || !newTx.amount) return;
    const tx = { ...newTx, id: Date.now(), amount: Number(newTx.amount) };
    setTransactions(prev => [tx, ...prev]);
    setShowModal(false);
    setNewTx({ description: "", amount: "", category: "Food & Dining", type: "expense", date: "2026-04-05" });
    showToast("✓ Transaction added");
  };

  // Export
  const handleExport = (format) => {
    const data = filtered;
    if (format === "csv") {
      const csv = ["Date,Description,Category,Type,Amount", ...data.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`)].join("\n");
      download("transactions.csv", csv, "text/csv");
    } else {
      download("transactions.json", JSON.stringify(data, null, 2), "application/json");
    }
    showToast(`✓ Exported as ${format.toUpperCase()}`);
  };

  const download = (name, content, type) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name; a.click();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const SortArrow = ({ col }) => sortKey === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ·";

  return (
    <>
      <GlobalStyles />
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <div className="logo-mark">F</div>
            <span className="logo-text">Finflow</span>
          </div>
          <div className="header-right">
            <div className="role-badge">
              <span style={{ color: "var(--muted)", fontSize: 11 }}>Role:</span>
              <select className="role-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button className="theme-btn" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* NAV */}
        <nav className="nav">
          {[
            { id: "overview",      label: "Overview",     icon: "◻" },
            { id: "transactions",  label: "Transactions",  icon: "⇄" },
            { id: "insights",      label: "Insights",      icon: "◑" },
          ].map(n => (
            <button key={n.id} className={`nav-btn ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <span style={{ fontSize: 14 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        <main className="main">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <>
              <div className="summary-grid">
                {[
                  { label: "Total Balance", value: fmt(balance), sub: `${savings}% savings rate`, chip: savings > 20 ? `+${savings}%` : null, neg: savings <= 20 },
                  { label: "Total Income", value: fmt(totalIncome), sub: "All income sources", chip: "+↑ This period", neg: false },
                  { label: "Total Expenses", value: fmt(totalExpense), sub: `${transactions.filter(t => t.type === "expense").length} transactions`, chip: null },
                  { label: "Transactions", value: transactions.length, sub: `${categories.length} categories tracked`, chip: null },
                ].map((c, i) => (
                  <div key={i} className="card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="card-label">{c.label}</div>
                    <div className="card-value">{c.value}</div>
                    {c.chip && <div className={`card-chip ${c.neg ? "neg" : ""}`}>{c.chip}</div>}
                    <div className="card-sub">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="charts-grid">
                {/* Balance Trend */}
                <div className="card">
                  <div className="chart-title">
                    Balance Trend — 7 Months
                    <div className="chart-legend">
                      {[["#3b82f6","Income"],["#ef4444","Expenses"],["#10b981","Balance"]].map(([c,l]) => (
                        <div key={l} className="legend-item"><div className="legend-dot" style={{ background: c }}></div>{l}</div>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={50} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="income"   stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} name="Expenses" />
                      <Line type="monotone" dataKey="balance"  stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} name="Balance" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Spending Breakdown Pie */}
                <div className="card">
                  <div className="chart-title">Spending Breakdown</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={spendByCat} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                        {spendByCat.map((e, i) => (
                          <Cell key={i} fill={CAT_COLORS[e.name] || "#64748b"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: 8 }}>
                    {spendByCat.slice(0, 4).map(c => (
                      <div key={c.name} className="bar-row">
                        <div className="bar-label" style={{ fontSize: 11 }}>{c.name}</div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${(c.value / spendByCat[0].value) * 100}%`, background: CAT_COLORS[c.name] || "#64748b" }} />
                        </div>
                        <div className="bar-amount">{fmtShort(c.value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Bar */}
              <div className="card">
                <div className="chart-title">Monthly Income vs Expenses</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="income"   fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab === "transactions" && (
            <>
              <div className="tx-controls">
                <input className="search-box" placeholder="🔍 Search transactions…" value={search} onChange={e => setSearch(e.target.value)} />
                <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="export-btn" onClick={() => handleExport("csv")}>↓ CSV</button>
                <button className="export-btn" style={{ background: "var(--muted)" }} onClick={() => handleExport("json")}>↓ JSON</button>
                {isAdmin && <button className="add-btn" onClick={() => setShowModal(true)}>+ Add</button>}
              </div>

              <div className="card" style={{ padding: 0 }}>
                {filtered.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-text">No transactions match your filters</div>
                  </div>
                ) : (
                  <div className="tx-scroll">
                    <table className="tx-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("date")}>Date<SortArrow col="date" /></th>
                          <th onClick={() => handleSort("description")}>Description<SortArrow col="description" /></th>
                          <th onClick={() => handleSort("category")}>Category<SortArrow col="category" /></th>
                          <th onClick={() => handleSort("type")}>Type<SortArrow col="type" /></th>
                          <th onClick={() => handleSort("amount")} style={{ textAlign: "right" }}>Amount<SortArrow col="amount" /></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(t => (
                          <tr key={t.id}>
                            <td className="date-cell">{t.date}</td>
                            <td style={{ fontWeight: 500, fontSize: 13 }}>{t.description}</td>
                            <td>
                              <span className="cat-pill" style={{ background: (CAT_COLORS[t.category] || "#64748b") + "22", color: CAT_COLORS[t.category] || "var(--muted)" }}>
                                {t.category}
                              </span>
                            </td>
                            <td>
                              <span className="cat-pill" style={{ background: t.type === "income" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: t.type === "income" ? "var(--green)" : "var(--red)" }}>
                                {t.type}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span className={t.type === "income" ? "amount-income" : "amount-expense"}>
                                {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", fontFamily: "DM Mono" }}>
                Showing {filtered.length} of {transactions.length} transactions
              </div>
            </>
          )}

          {/* ── INSIGHTS ── */}
          {tab === "insights" && (
            <>
              <div className="insight-grid">
                <div className="insight-card">
                  <div className="insight-title">Top Spending Category</div>
                  <div className="insight-value" style={{ color: topCat ? CAT_COLORS[topCat.name] : "var(--text)" }}>
                    {topCat?.name || "—"}
                  </div>
                  <div className="insight-sub">{topCat ? fmt(topCat.value) + " spent in total" : "No data"}</div>
                </div>

                <div className="insight-card">
                  <div className="insight-title">Month-over-Month Expenses</div>
                  <div className="insight-value" style={{ color: Number(expDelta) > 0 ? "var(--red)" : "var(--green)" }}>
                    {expDelta > 0 ? "+" : ""}{expDelta}%
                  </div>
                  <div className="insight-sub">vs last month ({lastMonth.month}: {fmtShort(lastMonth.expenses)})</div>
                </div>

                <div className="insight-card">
                  <div className="insight-title">Savings Rate</div>
                  <div className="insight-value" style={{ color: savings > 30 ? "var(--green)" : savings > 15 ? "var(--amber)" : "var(--red)" }}>
                    {savings}%
                  </div>
                  <div className="insight-sub">{savings > 30 ? "Excellent savings!" : savings > 15 ? "Good, but can improve" : "Consider reducing expenses"}</div>
                </div>

                <div className="insight-card">
                  <div className="insight-title">Avg. Transaction Size</div>
                  <div className="insight-value">
                    {fmt(Math.round(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) / transactions.filter(t => t.type === "expense").length))}
                  </div>
                  <div className="insight-sub">Per expense transaction</div>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="chart-title">Spending by Category</div>
                {spendByCat.map(c => (
                  <div key={c.name} className="bar-row" style={{ marginBottom: 12 }}>
                    <div className="bar-label">{c.name}</div>
                    <div className="bar-track" style={{ height: 8 }}>
                      <div className="bar-fill" style={{ width: `${(c.value / spendByCat[0].value) * 100}%`, background: CAT_COLORS[c.name] || "#64748b" }} />
                    </div>
                    <div className="bar-amount">{fmt(c.value)}</div>
                  </div>
                ))}
              </div>

              {/* Monthly comparison */}
              <div className="card">
                <div className="chart-title">6-Month Income vs Expenses Comparison</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmtShort} tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(v) => <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "DM Mono" }}>{v}</span>} />
                    <Bar dataKey="income"   fill="#3b82f6" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                    <Bar dataKey="balance"  fill="#10b981" radius={[4, 4, 0, 0]} name="Balance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </main>

        {/* ADD TRANSACTION MODAL */}
        {showModal && isAdmin && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div className="modal-title">Add Transaction</div>
              {[
                { label: "Description", key: "description", type: "text", placeholder: "e.g. Grocery Shopping" },
                { label: "Amount (₹)", key: "amount", type: "number", placeholder: "0" },
                { label: "Date", key: "date", type: "date" },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" type={f.type} placeholder={f.placeholder}
                    value={newTx[f.key]} onChange={e => setNewTx(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={newTx.type} onChange={e => setNewTx(p => ({ ...p, type: e.target.value }))}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))}>
                  {Object.keys(CAT_COLORS).filter(c => c !== "Income" || newTx.type === "income").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="modal-btns">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-submit" onClick={handleAdd}>Add Transaction</button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && <div className="toast"><span style={{ color: "var(--green)" }}>●</span> {toast}</div>}
      </div>
    </>
  );
}
