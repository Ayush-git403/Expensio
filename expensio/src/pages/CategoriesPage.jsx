import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useWindowSize } from '../hooks/useWindowSize';
import API from '../api/axios';

const CATEGORY_COLORS = {
  Food: '#e07820', Transport: '#1a6fad', Housing: '#3a6640',
  Health: '#e05050', Entertainment: '#7040a0', Shopping: '#c04830',
  Education: '#0f6e56', Travel: '#ba7517', Utilities: '#4a7a8a',
  Other: '#888888'
};

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Housing: '🏠',
  Health: '💊', Entertainment: '🎬', Shopping: '🛍️',
  Education: '📚', Travel: '✈️', Utilities: '⚡', Other: '📦'
};

export default function CategoriesPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { theme, dark } = useTheme();
  const { isMobile } = useWindowSize();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const { data } = await API.get(`/expenses?year=${year}`);
        setExpenses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [year]);

  // Build category totals
  const categoryMap = {};
  expenses.forEach(exp => {
    if (!categoryMap[exp.category]) {
      categoryMap[exp.category] = { total: 0, count: 0 };
    }
    categoryMap[exp.category].total += exp.amount;
    categoryMap[exp.category].count += 1;
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1].total - a[1].total);
  const maxCat = categories[0]?.[1]?.total || 1;

  const padding = isMobile ? '16px 14px' : '32px 40px';

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      transition: 'background 0.3s'
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 16, marginBottom: 28
        }}>
          <button onClick={() => navigate('/')} style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            color: theme.textPrimary,
            padding: '8px 16px', borderRadius: 10,
            fontSize: 14, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.2s'
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
            onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}>
            ← Back
          </button>
          <div>
            <h2 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: isMobile ? 22 : 28,
              color: theme.textPrimary, fontWeight: 700,
              letterSpacing: '-0.5px', margin: 0
            }}>
              Category Analysis
            </h2>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, color: theme.textMuted,
              marginTop: 4, marginBottom: 0
            }}>
              {year} · {expenses.length} expenses · ₹{totalSpent.toLocaleString('en-IN')} total
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'DM Sans, sans-serif',
            color: theme.textMuted, fontSize: 15
          }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'DM Sans, sans-serif',
            color: theme.textMuted, fontSize: 15
          }}>
            No expenses found for {year}
          </div>
        ) : (
          <>
            {/* Summary row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
              gap: isMobile ? 10 : 14, marginBottom: 24
            }}>
              {[
                { label: 'CATEGORIES USED', value: categories.length },
                { label: 'TOTAL EXPENSES', value: expenses.length },
                { label: 'TOTAL SPENT', value: `₹${totalSpent.toLocaleString('en-IN')}` },
                { label: 'TOP CATEGORY', value: `${CATEGORY_ICONS[categories[0]?.[0]]} ${categories[0]?.[0]}` },
              ].map(c => (
                <div key={c.label} style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 12, padding: '16px 14px'
                }}>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                    color: theme.textMuted, letterSpacing: '0.08em',
                    fontWeight: 500, marginBottom: 8
                  }}>
                    {c.label}
                  </div>
                  <div style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 20,
                    color: theme.textPrimary, fontWeight: 700,
                    letterSpacing: '-0.5px'
                  }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Category cards */}
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              color: theme.textMuted, letterSpacing: '0.08em',
              fontWeight: 500, marginBottom: 14
            }}>
              CATEGORIES — CLICK TO ANALYSE
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.map(([cat, { total, count }]) => {
                const pct     = Math.round((total / totalSpent) * 100);
                const barPct  = Math.round((total / maxCat) * 100);
                const color   = CATEGORY_COLORS[cat] || '#888';
                const icon    = CATEGORY_ICONS[cat] || '📦';

                return (
                  <div key={cat}
                    onClick={() => navigate(`/categories/${year}/${cat}`)}
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: 14, padding: isMobile ? '16px 14px' : '18px 22px',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = theme.cardBorder;
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>

                    <div style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 12
                    }}>
                      {/* Left — icon + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: color + '20',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 20
                        }}>
                          {icon}
                        </div>
                        <div>
                          <div style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 15, fontWeight: 700,
                            color: theme.textPrimary
                          }}>
                            {cat}
                          </div>
                          <div style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 12, color: theme.textMuted, marginTop: 2
                          }}>
                            {count} expense{count > 1 ? 's' : ''} · {pct}% of total
                          </div>
                        </div>
                      </div>

                      {/* Right — amount + arrow */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: isMobile ? 16 : 18,
                          fontWeight: 700, color: color,
                          letterSpacing: '-0.3px'
                        }}>
                          ₹{total.toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          fontSize: 16, color: theme.textMuted
                        }}>→</span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div style={{
                      background: dark ? '#2a2a2a' : '#f0f0f0',
                      borderRadius: 99, height: 6, overflow: 'hidden'
                    }}>
                      <div style={{
                        width: barPct + '%', height: '100%',
                        background: color, borderRadius: 99,
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}