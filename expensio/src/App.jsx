import { useState } from "react";
import Navbar from "./components/Navbar";
import AddExpense from "./components/AddExpense";
import Dashboard from "./components/DashboardComp";
import History from "./components/History";
import { INITIAL_EXPENSES } from "./utils/helpers";

const DEFAULT_FORM = { name: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0] };

export default function App() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [view, setView] = useState("dashboard");
  const [editId, setEditId] = useState(null);
  const [budget, setBudget] = useState(20000);
  const [budgetInput, setBudgetInput] = useState("20000");

  function handleAdd() {
    if (!form.name || !form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return;
    if (editId !== null) {
      setExpenses(prev => prev.map(e => e.id === editId ? { ...e, ...form, amount: Number(form.amount) } : e));
      setEditId(null);
    } else {
      setExpenses(prev => [...prev, { ...form, amount: Number(form.amount), id: Date.now() }]);
    }
    setForm(DEFAULT_FORM);
    setView("dashboard");
  }

  function handleEdit(exp) {
    setForm({ name: exp.name, amount: String(exp.amount), category: exp.category, date: exp.date });
    setEditId(exp.id);
    setView("add");
  }

  function handleDelete(id) {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e10" }}>
      <Navbar view={view} setView={setView} setEditId={setEditId} setForm={setForm} defaultForm={DEFAULT_FORM} />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>
        {view === "dashboard" && (
          <Dashboard expenses={expenses} budget={budget} setBudget={setBudget}
            budgetInput={budgetInput} setBudgetInput={setBudgetInput} setView={setView} />
        )}
        {view === "add" && (
          <AddExpense form={form} setForm={setForm} handleAdd={handleAdd}
            editId={editId} setEditId={setEditId} setView={setView} />
        )}
        {view === "history" && (
          <History expenses={expenses} handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}