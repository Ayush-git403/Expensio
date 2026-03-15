import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import { CATEGORIES, COLORS, formatINR } from '../utils/helpers';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const DEFAULT_FORM = { name: '', amount: '', category: 'Food', note: '' };

export default function MonthView({ month, year, onBack }) {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    date: `${year}-${String(month + 1).padStart(2, '0')}-01`
  });
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
      setForm({
        ...DEFAULT_FORM,
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`
      });
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
    setForm({
      name: exp.name,
      amount: String(exp.amount),
      category: exp.category,
      note: exp.note || '',
      date: exp.date?.split('T')[0]
    });
    setEditId(exp._id);
    setShowForm(true);
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      transition: 'background 0.3s'
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 16, marginBottom: 28
        }}>
          <button onClick={onBack}
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: '8px 16px', borderRadius: 10,
              fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
            onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}>
            ← Back
          </button>

          <div style={{ flex: 1 }}>
            <h2 className="serif" style={{
              fontSize: 30, color: theme.textPrimary,
              fontWeight: 400, letterSpacing: '-0.5px'
            }}>
              {MONTHS[month]} {year}
            </h2>
            <p style={{ color: theme.textPrimary, fontSize: 13, opacity: 0.6, marginTop: 3 }}>
              {expenses.length} expenses · Total:{' '}
              <span style={{ color: theme.accent, opacity: 1 }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setForm({
                ...DEFAULT_FORM,
                date: `${year}-${String(month + 1).padStart(2, '0')}-01`
              });
            }}
            style={{
              background: showForm ? theme.cardBg : theme.accent,
              border: showForm ? `1px solid ${theme.cardBorder}` : 'none',
              color: showForm ? theme.textPrimary : '#ffffff',
              padding: '10px 22px', borderRadius: 10,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 14, padding: 24, marginBottom: 24,
            transition: 'background 0.3s'
          }}>
            {error && (
              <div style={{
                color: theme.highlight, fontSize: 13,
                marginBottom: 14, padding: '8px 12px',
                background: theme.highlight + '18',
                borderRadius: 8, border: `1px solid ${theme.highlight}44`
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'NAME', key: 'name', type: 'text', placeholder: 'Expense name' },
                { label: 'AMOUNT (₹)', key: 'amount', type: 'number', placeholder: '0' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{
                    display: 'block', fontSize: 11,
                    color: theme.textPrimary, opacity: 0.6,
                    marginBottom: 6, letterSpacing: '0.05em', fontWeight: 500
                  }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%',
                      background: theme.inputBg,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{
                  display: 'block', fontSize: 11,
                  color: theme.textPrimary, opacity: 0.6,
                  marginBottom: 6, letterSpacing: '0.05em', fontWeight: 500
                }}>
                  CATEGORY
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{
                    width: '100%',
                    background: theme.inputBg,
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary
                  }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block', fontSize: 11,
                  color: theme.textPrimary, opacity: 0.6,
                  marginBottom: 6, letterSpacing: '0.05em', fontWeight: 500
                }}>
                  DATE
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  style={{
                    width: '100%',
                    background: theme.inputBg,
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{
                display: 'block', fontSize: 11,
                color: theme.textPrimary, opacity: 0.6,
                marginBottom: 6, letterSpacing: '0.05em', fontWeight: 500
              }}>
                NOTE (optional)
              </label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Any extra detail..."
                style={{
                  width: '100%',
                  background: theme.inputBg,
                  borderColor: theme.cardBorder,
                  color: theme.textPrimary
                }}
              />
            </div>

            <button onClick={handleSave}
              style={{
                marginTop: 18, padding: '11px 28px',
                background: theme.accent, border: 'none',
                borderRadius: 10, color: '#ffffff',
                fontWeight: 600, fontSize: 14, cursor: 'pointer'
              }}>
              {editId ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        )}

        {/* Expense List */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: theme.textPrimary, opacity: 0.5, fontSize: 15
          }}>
            Loading...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: theme.textPrimary, opacity: 0.4, fontSize: 15
          }}>
            No expenses for {MONTHS[month]}. Add your first one!
          </div>
        ) : (
          <div style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 14, overflow: 'hidden',
            transition: 'background 0.3s'
          }}>
            {expenses.map((e, i) => (
              <div key={e._id}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < expenses.length - 1
                    ? `1px solid ${theme.cardBorder}`
                    : 'none',
                  transition: 'background 0.15s'
                }}
                onMouseOver={ev => ev.currentTarget.style.background = theme.bg}
                onMouseOut={ev => ev.currentTarget.style.background = 'transparent'}>

                {/* Left — icon + details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + '28',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length],
                    fontWeight: 700, fontSize: 15
                  }}>
                    {e.category[0]}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: theme.textPrimary
                    }}>
                      {e.name}
                    </div>
                    <div style={{
                      fontSize: 12, marginTop: 3,
                      display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <span style={{
                        background: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length] + '22',
                        color: COLORS[CATEGORIES.indexOf(e.category) % COLORS.length],
                        padding: '2px 9px', borderRadius: 99, fontSize: 11,
                        fontWeight: 500
                      }}>
                        {e.category}
                      </span>
                      <span style={{ color: theme.textPrimary, opacity: 0.45 }}>
                        {new Date(e.date).toLocaleDateString('en-IN')}
                      </span>
                      {e.note && (
                        <span style={{ color: theme.textPrimary, opacity: 0.35 }}>
                          · {e.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — amount + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="serif" style={{
                    fontSize: 19, color: theme.accent,
                    letterSpacing: '-0.3px'
                  }}>
                    ₹{e.amount.toLocaleString('en-IN')}
                  </span>
                  <button onClick={() => handleEdit(e)}
                    style={{
                      background: 'none',
                      border: `1px solid ${theme.cardBorder}`,
                      color: theme.textPrimary, opacity: 0.7,
                      padding: '5px 13px', borderRadius: 8,
                      fontSize: 12, cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.target.style.borderColor = theme.accent}
                    onMouseOut={e => e.target.style.borderColor = theme.cardBorder}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(e._id)}
                    style={{
                      background: 'none',
                      border: `1px solid ${theme.highlight}66`,
                      color: theme.highlight,
                      padding: '5px 13px', borderRadius: 8,
                      fontSize: 12, cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={ev => ev.target.style.background = theme.highlight + '18'}
                    onMouseOut={ev => ev.target.style.background = 'none'}>
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}