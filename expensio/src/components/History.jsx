import { useState } from "react";
import { CATEGORIES, COLORS, formatINR } from "../utils/helpers";

export default function History({ expenses, handleEdit, handleDelete }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? expenses : expenses.filter(e => e.category === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span className="serif" style={{ fontSize: 28, color: "#f0ede8" }}>All expenses</span>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 150 }}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#444", fontSize: 15 }}>No expenses found</div>
      ) : (
        <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 16, overflow: "hidden" }}>
          {filtered.slice().reverse().map((e, i) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #1e1e26" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + "25", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] }}>
                  {e.category[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                    <span style={{ background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + "20", color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length], padding: "2px 8px", borderRadius: 99, fontSize: 11 }}>{e.category}</span>
                    <span style={{ marginLeft: 8 }}>{e.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="serif" style={{ fontSize: 18, color: "#c9a96e" }}>{formatINR(e.amount)}</span>
                <button onClick={() => handleEdit(e)} style={{ background: "none", border: "1px solid #2e2e38", color: "#888", padding: "5px 12px", borderRadius: 7, fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(e.id)} style={{ background: "none", border: "1px solid #3e2020", color: "#e05c5c", padding: "5px 12px", borderRadius: 7, fontSize: 12 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ textAlign: "right", marginTop: 16, color: "#888", fontSize: 13 }}>
        Total: <span className="serif" style={{ color: "#c9a96e", fontSize: 18 }}>{formatINR(filtered.reduce((s, e) => s + e.amount, 0))}</span>
      </div>
    </div>
  );
}