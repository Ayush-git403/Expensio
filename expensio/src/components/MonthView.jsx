import { useState, useEffect } from 'react';
import API from '../api/axios';
import { CATEGORIES, COLORS, formatINR } from '../utils/helpers';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const DEFAULT_FORM = { name: '', amount: '', category: 'Food', note: '' };

export default function MonthView({ month, year, onBack }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...DEFAULT_FORM, date: `${year}-${String(month + 1).padStart(2, '0')}-01` });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchExpenses(); }, [month, year]);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const { data } = await API.get(`/expenses?month=${month + 1}&year=${year}`);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.name || !form.amount) return setError('Name and amount are required');
    setError('');
    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, { ...form, amount: Number(form.amount) });
      } else {
        await API.post('/expenses', { ...form, amount: Number(form.amount) });
      }
      setForm({ ...DEFAULT_FORM, date: `${year}-${String(month + 1).padStart(2, '0')}-01` });
      setEditId(null);
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    }
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(exp) {
    setForm({ name: exp.name, amount: String(exp.amount), category: exp.category, note: exp.note || '', date: exp.date?.split('T')[0] });
    setEditId(exp._id);
    setShowForm(true);
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={onBack}
          style={{ background: '#13131a', border: '1px solid #2e2e38', color: '#888', padding: '8px 14px', borderRadius: 8, fontSize: 14 }}>
          ← Back
        </button>
        <div>
          <h2 className="serif" style={{ fontSize: 28, color: '#f0ede8', fontWeight: 400 }}>{MONTHS[month]} {year}</h2>
          <p style={{ color: '#666', fontSize: 13 }}>{expenses.length} expenses · Total: <span style={{ color: '#c9a96e' }}>₹{total.toLocaleString('en-IN')}</span></p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ ...DEFAULT_FORM, date: `${year}-${String(month + 1).padStart(2, '0')}-01` }); }}
          style={{ marginLeft: 'auto', background: '#c9a96e', border: 'none', color: '#0e0e10', padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: '#13131a', border: '1px solid #2e2e38', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          {error && <div style={{ color: '#e05c5c', fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'NAME', key: 'name', type: 'text', placeholder: 'Expense name' },
              { label: 'AMOUNT (₹)', key: 'amount', type: 'number', placeholder: '0' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, letterSpacing: '0.04em' }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={{ width: '100%' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, letterSpacing: '0.04em' }}>CATEGORY</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, letterSpacing: '0.04em' }}>DATE</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, letterSpacing: '0.04em' }}>NOTE (optional)</label>
            <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Any extra detail..." style={{ width: '100%' }} />
          </div>
          <button onClick={handleSave}
            style={{ marginTop: 18, padding: '11px 28px', background: '#c9a96e', border: 'none', borderRadius: 10, color: '#0e0e10', fontWeight: 600, fontSize: 14 }}>
            {editId ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      )}

      {/* Expense List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>Loading...</div>
      ) : expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#444', fontSize: 15 }}>
          No expenses for {MONTHS[month]}. Add your first one!
        </div>
      ) : (
        <div style={{ background: '#13131a', border: '1px solid #2e2e38', borderRadius: 14, overflow: 'hidden' }}>
          {expenses.map((e, i) => (
            <div key={e._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < expenses.length - 1 ? '1px solid #1e1e26' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length], fontWeight: 600 }}>
                  {e.category[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#f0ede8' }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                    <span style={{ background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + '20', color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length], padding: '2px 8px', borderRadius: 99 }}>{e.category}</span>
                    <span style={{ marginLeft: 8 }}>{new Date(e.date).toLocaleDateString('en-IN')}</span>
                    {e.note && <span style={{ marginLeft: 8, color: '#444' }}>· {e.note}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="serif" style={{ fontSize: 18, color: '#c9a96e' }}>₹{e.amount.toLocaleString('en-IN')}</span>
                <button onClick={() => handleEdit(e)} style={{ background: 'none', border: '1px solid #2e2e38', color: '#888', padding: '5px 12px', borderRadius: 7, fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(e._id)} style={{ background: 'none', border: '1px solid #3e2020', color: '#e05c5c', padding: '5px 12px', borderRadius: 7, fontSize: 12 }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}