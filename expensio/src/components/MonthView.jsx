import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useWindowSize } from "../hooks/useWindowSize";
import API from "../api/axios";
import EditDialog from "./EditDialog";
import { CATEGORIES, COLORS, formatINR } from "../utils/helpers";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const DEFAULT_FORM = { name: "", amount: "", category: "Food", note: "" };

export default function MonthView({ month, year, onBack }) {
  const { dark, theme } = useTheme();
  const { isMobile } = useWindowSize();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    date: `${year}-${String(month + 1).padStart(2, "0")}-01`,
  });
  const [error, setError] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogForm, setDialogForm] = useState({ ...DEFAULT_FORM });
  const [dialogEditId, setDialogEditId] = useState(null);
  const [dialogError, setDialogError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [month, year]);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const { data } = await API.get(
        `/expenses?month=${month + 1}&year=${year}`
      );
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Add expense
  async function handleSave() {
    if (!form.name || !form.amount)
      return setError("Name and amount are required");
    setError("");
    try {
      await API.post("/expenses", { ...form, amount: Number(form.amount) });
      setForm({
        ...DEFAULT_FORM,
        date: `${year}-${String(month + 1).padStart(2, "0")}-01`,
      });
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      console.error("handleSave error:", err);
      setError(err.response?.data?.message || "Failed to save");
    }
  }

  // Edit expense via dialog
  async function handleDialogSave() {
    if (!dialogForm.name || !dialogForm.amount) {
      return setDialogError("Name and amount are required");
    }
    setDialogError("");
    try {
      await API.put(`/expenses/${dialogEditId}`, {
        ...dialogForm,
        amount: Number(dialogForm.amount),
      });
      setDialogOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      setDialogError(err.response?.data?.message || "Failed to save");
    }
  }

  // Open dialog with expense data
  function openEditDialog(exp) {
    setDialogForm({
      name: exp.name,
      amount: String(exp.amount),
      category: exp.category,
      note: exp.note || "",
      date: exp.date?.split("T")[0],
    });
    setDialogEditId(exp._id);
    setDialogError("");
    setDialogOpen(true);
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const inputStyle = {
    width: "100%",
    background: theme.inputBg,
    border: `1px solid ${theme.cardBorder}`,
    color: theme.textPrimary,
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    colorScheme: dark ? "dark" : "light",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    color: theme.textPrimary,
    opacity: 0.6,
    marginBottom: 6,
    letterSpacing: "0.05em",
    fontWeight: 500,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      transition: "background 0.3s",
    }}>
      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: isMobile ? "16px 14px" : "28px 20px",
      }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}>
            {/* Back button */}
            <button
              onClick={onBack}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.textPrimary,
                padding: isMobile ? "7px 12px" : "8px 16px",
                borderRadius: 10, fontSize: 14,
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "DM Sans, sans-serif",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
              onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}
            >
              ← Back
            </button>

            {/* Add Expense toggle */}
            <button
              onClick={() => {
                setShowForm(!showForm);
                setForm({
                  ...DEFAULT_FORM,
                  date: `${year}-${String(month + 1).padStart(2, "0")}-01`,
                });
                setError("");
              }}
              style={{
                background: showForm ? theme.cardBg : theme.accent,
                border: showForm ? `1px solid ${theme.cardBorder}` : "none",
                color: showForm
                  ? theme.textPrimary
                  : dark ? "#000000" : "#ffffff",
                padding: isMobile ? "9px 16px" : "10px 22px",
                borderRadius: 10, fontWeight: 600,
                fontSize: isMobile ? 13 : 14,
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {showForm ? "Cancel" : "+ Add Expense"}
            </button>
          </div>

          {/* Title */}
          <div>
            <h2 style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: isMobile ? 26 : 30,
              color: theme.textPrimary,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              margin: 0
            }}>
              {MONTHS[month]} {year}
            </h2>
            <p style={{
              color: theme.textPrimary, fontSize: 13,
              opacity: 0.6, marginTop: 4, marginBottom: 0
            }}>
              {expenses.length} expenses · Total:{" "}
              <span style={{ color: theme.accent, opacity: 1 }}>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </p>
          </div>
        </div>

        {/* ── Add Form ── */}
        {showForm && (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 14,
            padding: isMobile ? 16 : 24,
            marginBottom: 24,
            transition: "background 0.3s",
          }}>
            {error && (
              <div style={{
                color: theme.highlight, fontSize: 13,
                marginBottom: 14, padding: "8px 12px",
                background: theme.highlight + "18",
                borderRadius: 8,
                border: `1px solid ${theme.highlight}44`,
              }}>
                {error}
              </div>
            )}

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 14,
            }}>
              <div>
                <label style={labelStyle}>NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Expense name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>AMOUNT (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={inputStyle}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>DATE</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>NOTE (optional)</label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Any extra detail..."
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleSave}
              style={{
                marginTop: 18,
                padding: isMobile ? "12px 20px" : "11px 28px",
                background: theme.accent,
                border: "none", borderRadius: 10,
                color: dark ? "#000000" : "#ffffff",
                fontWeight: 600, fontSize: 14,
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "DM Sans, sans-serif",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Add Expense
            </button>
          </div>
        )}

        {/* ── Expense List ── */}
        {loading ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
            color: theme.textPrimary, opacity: 0.5, fontSize: 15,
            fontFamily: "DM Sans, sans-serif"
          }}>
            Loading...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
            color: theme.textPrimary, opacity: 0.4, fontSize: 15,
            fontFamily: "DM Sans, sans-serif"
          }}>
            No expenses for {MONTHS[month]}. Add your first one!
          </div>
        ) : (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 14, overflow: "hidden",
            transition: "background 0.3s",
          }}>
            {expenses.map((exp, i) => (
              <div
                key={exp._id}
                style={{
                  padding: isMobile ? "12px 14px" : "14px 20px",
                  borderBottom: i < expenses.length - 1
                    ? `1px solid ${theme.cardBorder}`
                    : "none",
                  transition: "background 0.15s",
                }}
                onMouseOver={ev => ev.currentTarget.style.background = theme.bg}
                onMouseOut={ev => ev.currentTarget.style.background = "transparent"}
              >

                {/* ── Mobile layout ── */}
                {isMobile ? (
                  <div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length] + "28",
                          display: "flex", alignItems: "center",
                          justifyContent: "center",
                          color: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length],
                          fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {exp.category[0]}
                        </div>
                        <div>
                          <div style={{
                            fontSize: 14, fontWeight: 600,
                            color: theme.textPrimary
                          }}>
                            {exp.name}
                          </div>
                          <div style={{
                            fontSize: 11, color: theme.textPrimary,
                            opacity: 0.45, marginTop: 2
                          }}>
                            {new Date(exp.date).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 17, fontWeight: 700,
                        color: theme.accent, letterSpacing: "-0.3px",
                        flexShrink: 0,
                      }}>
                        ₹{exp.amount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <span style={{
                        background: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length] + "22",
                        color: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length],
                        padding: "2px 9px", borderRadius: 99,
                        fontSize: 11, fontWeight: 500,
                      }}>
                        {exp.category}
                      </span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={ev => {
                            ev.stopPropagation();
                            openEditDialog(exp);
                          }}
                          style={{
                            background: "none",
                            border: `1px solid ${theme.cardBorder}`,
                            color: theme.textPrimary,
                            padding: "4px 12px", borderRadius: 7,
                            fontSize: 12, cursor: "pointer",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={ev => {
                            ev.stopPropagation();
                            handleDelete(exp._id);
                          }}
                          style={{
                            background: "none",
                            border: `1px solid ${theme.highlight}66`,
                            color: theme.highlight,
                            padding: "4px 12px", borderRadius: 7,
                            fontSize: 12, cursor: "pointer",
                            fontFamily: "DM Sans, sans-serif",
                          }}
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>

                ) : (
                  /* ── Desktop layout ── */
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      gap: 12, flex: 1,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 11,
                        background: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length] + "28",
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        color: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length],
                        fontWeight: 700, fontSize: 15,
                      }}>
                        {exp.category[0]}
                      </div>
                      <div>
                        <div style={{
                          fontSize: 14, fontWeight: 600,
                          color: theme.textPrimary
                        }}>
                          {exp.name}
                        </div>
                        <div style={{
                          fontSize: 12, marginTop: 3,
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <span style={{
                            background: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length] + "22",
                            color: COLORS[CATEGORIES.indexOf(exp.category) % COLORS.length],
                            padding: "2px 9px", borderRadius: 99,
                            fontSize: 11, fontWeight: 500,
                          }}>
                            {exp.category}
                          </span>
                          <span style={{ color: theme.textPrimary, opacity: 0.45 }}>
                            {new Date(exp.date).toLocaleDateString("en-IN")}
                          </span>
                          {exp.note && (
                            <span style={{ color: theme.textPrimary, opacity: 0.35 }}>
                              · {exp.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 19, fontWeight: 700,
                        color: theme.accent, letterSpacing: "-0.3px",
                      }}>
                        ₹{exp.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={ev => {
                          ev.stopPropagation();
                          openEditDialog(exp);
                        }}
                        style={{
                          background: "none",
                          border: `1px solid ${theme.cardBorder}`,
                          color: theme.textPrimary,
                          padding: "5px 13px", borderRadius: 8,
                          fontSize: 12, cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                        onMouseOver={ev => ev.currentTarget.style.borderColor = theme.accent}
                        onMouseOut={ev => ev.currentTarget.style.borderColor = theme.cardBorder}
                      >
                        Edit
                      </button>
                      <button
                        onClick={ev => {
                          ev.stopPropagation();
                          handleDelete(exp._id);
                        }}
                        style={{
                          background: "none",
                          border: `1px solid ${theme.highlight}66`,
                          color: theme.highlight,
                          padding: "5px 13px", borderRadius: 8,
                          fontSize: 12, cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "DM Sans, sans-serif",
                        }}
                        onMouseOver={ev => ev.currentTarget.style.background = theme.highlight + "18"}
                        onMouseOut={ev => ev.currentTarget.style.background = "none"}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Dialog ── */}
      <EditDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        form={dialogForm}
        setForm={setDialogForm}
        onSave={handleDialogSave}
        error={dialogError}
        month={month}
        year={year}
      />
    </div>
  );
}