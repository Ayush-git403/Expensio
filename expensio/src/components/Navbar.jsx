export default function Navbar({ view, setView, setEditId, setForm, defaultForm }) {
  return (
    <div style={{
      background: "#13131a", borderBottom: "1px solid #2e2e38",
      padding: "0 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 64
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="serif" style={{ fontSize: 26, color: "#c9a96e" }}>Expensio</span>
        <span style={{ fontSize: 12, color: "#666", fontWeight: 300 }}>expense tracker</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["dashboard", "add", "history"].map(v => (
          <button key={v} onClick={() => {
            setView(v);
            setEditId(null);
            if (v !== "add") setForm(defaultForm);
          }}
            style={{
              padding: "7px 16px", borderRadius: 8,
              border: view === v ? "1px solid #c9a96e" : "1px solid #2e2e38",
              background: view === v ? "#1f1a10" : "transparent",
              color: view === v ? "#c9a96e" : "#888",
              fontSize: 13, fontWeight: 500, transition: "all 0.2s"
            }}>
            {v === "dashboard" ? "Dashboard" : v === "add" ? ("+  Add") : "History"}
          </button>
        ))}
      </div>
    </div>
  );
}