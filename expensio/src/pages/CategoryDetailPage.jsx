import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import API from '../api/axios';

const MONTHS_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec'];

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

export default function CategoryDetailPage() {
  const { year, category } = useParams();
  const navigate = useNavigate();
  const { theme, dark } = useTheme();
  const { isMobile } = useWindowSize();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const color = CATEGORY_COLORS[category] || '#888';
  const icon  = CATEGORY_ICONS[category] || '📦';

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const { data } = await API.get(`/expenses?year=${year}`);
        // Filter only this category
        setExpenses(data.filter(e => e.category === category));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [year, category]);

  const total   = expenses.reduce((s, e) => s + e.amount, 0);
  const highest = Math.max(...expenses.map(e => e.amount), 0);
  const avg     = expenses.length
    ? Math.round(total / expenses.length)
    : 0;

  // Month-wise totals for chart
  const monthlyTotals = Array(12).fill(0);
  expenses.forEach(exp => {
    const m = new Date(exp.date).getMonth();
    monthlyTotals[m] += exp.amount;
  });

  const chartData = SHORT.map((m, i) => ({
    month: m, amount: monthlyTotals[i]
  }));

  const activeMonths = monthlyTotals.filter(v => v > 0).length;
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
          <button
            onClick={() => navigate(`/categories/${year}`)}
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: '8px 16px', borderRadius: 10,
              fontSize: 14, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = color}
            onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}>
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: color + '22',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 24
            }}>
              {icon}
            </div>
            <div>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: isMobile ? 22 : 28,
                color: theme.textPrimary, fontWeight: 700,
                letterSpacing: '-0.5px', margin: 0
              }}>
                {category}
              </h2>
              <p style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13, color: theme.textMuted,
                marginTop: 4, marginBottom: 0
              }}>
                {year} · {expenses.length} expenses
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'DM Sans, sans-serif',
            color: theme.textMuted, fontSize: 15
          }}>
            Loading...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'DM Sans, sans-serif',
            color: theme.textMuted, fontSize: 15
          }}>
            No {category} expenses in {year}
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
              gap: isMobile ? 10 : 14, marginBottom: 24
            }}>
              {[
                { label: 'TOTAL SPENT',    value: `₹${total.toLocaleString('en-IN')}`,   color: color },
                { label: 'NO. OF EXPENSES', value: expenses.length,                       color: theme.textPrimary },
                { label: 'AVERAGE',         value: `₹${avg.toLocaleString('en-IN')}`,    color: theme.textPrimary },
                { label: 'ACTIVE MONTHS',   value: activeMonths,                          color: theme.textPrimary },
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
                    fontFamily: 'DM Sans, sans-serif', fontSize: 22,
                    color: c.color, fontWeight: 700, letterSpacing: '-0.5px'
                  }}>
                    {c.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Month-wise bar chart */}
            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 14, padding: isMobile ? '16px 14px' : '22px 24px',
              marginBottom: 24
            }}>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                color: theme.textMuted, letterSpacing: '0.08em',
                fontWeight: 500, marginBottom: 16
              }}>
                MONTH-WISE SPENDING — {category.toUpperCase()} — {year}
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={dark ? '#2a2a2a' : '#f0f0f0'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: theme.textMuted, fontSize: 10,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: theme.textMuted, fontSize: 10,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v =>
                      v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`
                    }
                  />
                  <Tooltip
                    formatter={v => [
                      `₹${Number(v).toLocaleString('en-IN')}`,
                      category
                    ]}
                    contentStyle={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: 8, fontSize: 12,
                      color: theme.textPrimary,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    cursor={{ fill: dark ? '#222' : '#f5f5f5' }}
                  />
                  <Bar
                    dataKey="amount"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.amount > 0 ? color : (dark ? '#2a2a2a' : '#f0f0f0')}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense list */}
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              color: theme.textMuted, letterSpacing: '0.08em',
              fontWeight: 500, marginBottom: 14
            }}>
              ALL {category.toUpperCase()} EXPENSES — {year}
            </div>

            <div style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 14, overflow: 'hidden'
            }}>
              {[...expenses]
                .sort((a, b) => b.amount - a.amount)
                .map((exp, i, arr) => (
                <div key={exp._id} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isMobile ? '12px 14px' : '14px 20px',
                  borderBottom: i < arr.length - 1
                    ? `1px solid ${theme.cardBorder}`
                    : 'none',
                  transition: 'background 0.15s'
                }}
                  onMouseOver={e => e.currentTarget.style.background = theme.bg}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>

                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 12, flex: 1, minWidth: 0
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: color + '20',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 18,
                      flexShrink: 0
                    }}>
                      {icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 14, fontWeight: 600,
                        color: theme.textPrimary,
                        whiteSpace: 'nowrap', overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {exp.name}
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11, color: theme.textMuted, marginTop: 2
                      }}>
                        {MONTHS_FULL[new Date(exp.date).getMonth()]} · {new Date(exp.date).getDate()}
                        {exp.note ? ` · ${exp.note}` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 16, fontWeight: 700,
                    color: color, letterSpacing: '-0.3px',
                    flexShrink: 0, marginLeft: 12
                  }}>
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Total footer */}
            <div style={{
              textAlign: 'right', marginTop: 14,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, color: theme.textMuted
            }}>
              Total:{' '}
              <span style={{
                color: color, fontWeight: 700, fontSize: 18
              }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}