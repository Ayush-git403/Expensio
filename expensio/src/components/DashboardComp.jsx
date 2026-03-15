import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CATEGORIES, COLORS, MONTHS, formatINR } from "../utils/helpers";

export default function Dashboard({ expenses, budget, setBudget, budgetInput, setBudgetInput, setView }) {
  const total = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount), 0), [expenses]);

  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const byMonth = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const m = MONTHS[new Date(e.date).getMonth()];
      map[m] = (map[m] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([month, amount]) => ({ month, amount }));
  }, [expenses]);

  const budgetPct = Math.min(100, Math.round((total / budget) * 100));
  const budgetColor = budgetPct >= 90 ? "#e05c5c" : budgetPct >= 70 ? "#c9a96e" : "#7ec97e";

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Spent", val: formatINR(total), sub: `${expenses.length} transactions` },
          { label: "Monthly Budget", val: formatINR(budget), sub: <span style={{ color: budgetColor }}>{budgetPct}% used</span> },
          { label: "Remaining", val: formatINR(Math.max(0, budget - total)), sub: budget - total < 0 ? <span style={{ color: "#e05c5c" }}>Over budget!</span> : "available" },
          { label: "Avg per Expense", val: expenses.length ? formatINR(Math.round(total / expenses.length)) : "₹0", sub: "per entry" },
        ].map(c => (
          <div key={c.label} style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{c.label}</div>
            <div className="serif" style={{ fontSize: 22, color: "#f0ede8" }}>{c.val}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "#888" }}>Budget progress</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
              onBlur={() => { const v = Number(budgetInput); if (v > 0) setBudget(v); }}
              style={{ width: 100, padding: "5px 10px", fontSize: 13 }} placeholder="Set budget" />
            <span style={{ fontSize: 12, color: "#555" }}>/ month</span>
          </div>
        </div>
        <div style={{ background: "#1a1a1f", borderRadius: 99, height: 10, overflow: "hidden" }}>
          <div style={{ width: budgetPct + "%", height: "100%", background: budgetColor, borderRadius: 99, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: budgetColor }}>{budgetPct}% of {formatINR(budget)}</span>
          <span style={{ fontSize: 12, color: "#555" }}>{formatINR(total)} spent</span>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>Spending by category</div>
          {byCategory.length ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={byCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[CATEGORIES.indexOf(_.name) % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ background: "#1a1a1f", border: "1px solid #2e2e38", borderRadius: 8, color: "#f0ede8", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 13 }}>No data</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 6 }}>
            {byCategory.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[CATEGORIES.indexOf(c.name) % COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>Monthly trend</div>
          {byMonth.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e38" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)} />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ background: "#1a1a1f", border: "1px solid #2e2e38", borderRadius: 8, color: "#f0ede8", fontSize: 12 }} />
                <Bar dataKey="amount" fill="#c9a96e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 13 }}>No data</div>}
        </div>
      </div>

      {/* Recent */}
      <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: "#888" }}>Recent expenses</span>
          <button onClick={() => setView("history")} style={{ fontSize: 12, color: "#c9a96e", background: "none", border: "none", padding: 0 }}>View all →</button>
        </div>
        {expenses.slice(-5).reverse().map(e => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e1e26" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {e.category[0]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{e.category} · {e.date}</div>
              </div>
            </div>
            <span className="serif" style={{ fontSize: 17, color: "#c9a96e" }}>{formatINR(e.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}