import { CATEGORIES } from "../utils/helpers";

export default function AddExpense({ form, setForm, handleAdd, editId, setEditId, setView }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="serif" style={{ fontSize: 28, marginBottom: 24, color: "#f0ede8" }}>
        {editId ? "Edit expense" : "Add new expense"}
      </div>
      <div style={{ background: "#13131a", border: "1px solid #2e2e38", borderRadius: 16, padding: "28px" }}>
        {[
          { label: "Expense name", key: "name", type: "text", placeholder: "e.g. Groceries, Uber ride..." },
          { label: "Amount (₹)", key: "amount", type: "number", placeholder: "0" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 7, letterSpacing: "0.04em" }}>
              {f.label.toUpperCase()}
            </label>
            <input type={f.type} value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder} style={{ width: "100%" }} />
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 7, letterSpacing: "0.04em" }}>CATEGORY</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: "100%" }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 7, letterSpacing: "0.04em" }}>DATE</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: "100%" }} />
          </div>
        </div>
        <button onClick={handleAdd}
          style={{ width: "100%", padding: 13, background: "#c9a96e", border: "none", borderRadius: 10, color: "#0e0e10", fontSize: 15, fontWeight: 600 }}>
          {editId ? "Save changes" : "Add expense"}
        </button>
        {editId && (
          <button onClick={() => { setEditId(null); setView("history"); }}
            style={{ width: "100%", padding: 11, background: "none", border: "1px solid #2e2e38", borderRadius: 10, color: "#888", fontSize: 14, marginTop: 10 }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}