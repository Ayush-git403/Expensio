import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import API from '../api/axios';
import MonthView from '../components/MonthView';

const MONTHS = [
  'January','February','March','April',
  'May','June','July','August',
  'September','October','November','December'
];

const SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

const CATEGORY_COLORS = {
  Food: '#e07820',
  Transport: '#1a6fad',
  Housing: '#3a6640',
  Health: '#e05050',
  Entertainment: '#7040a0',
  Shopping: '#c04830',
  Education: '#0f6e56',
  Travel: '#ba7517',
  Utilities: '#4a7a8a',
  Other: '#888888'
};

export default function Home() {
  const { user } = useAuth();
  const { dark, theme } = useTheme();
  const { isMobile, isTablet } = useWindowSize();

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYearlyData();
  }, [year]);

  async function fetchYearlyData() {
    setLoading(true);
    setMonthlyTotals({});
    setAllExpenses([]);
    try {
      const { data } = await API.get(`/expenses?year=${year}`);
      console.log('Frontend received expenses:', data.length, 'for year:', year);
      const totals = {};
      data.forEach(exp => {
        const m = new Date(exp.date).getMonth();
        totals[m] = (totals[m] || 0) + exp.amount;
      });
      setMonthlyTotals(totals);
      setAllExpenses(data);
    } catch (err) {
      console.error('fetchYearlyData error:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalYear    = Object.values(monthlyTotals).reduce((s, v) => s + v, 0);
  const maxMonth     = Math.max(...Object.values(monthlyTotals), 1);
  const activeMonths = Object.keys(monthlyTotals).length;

  const topExpenses = [...allExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const chartData = MONTHS.map((name, i) => ({
    month: SHORT[i],
    amount: monthlyTotals[i] || 0
  }));

  const padding         = isMobile ? '16px 14px' : '32px 40px';
  const gridCols        = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)';
  const summaryGridCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';

  if (selectedMonth !== null) {
    return (
      <MonthView
        month={selectedMonth}
        year={year}
        onBack={() => {
          setSelectedMonth(null);
          fetchYearlyData();
        }}
      />
    );
  }

  const card = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: isMobile ? 12 : 14,
    transition: 'background 0.3s'
  };

  const label = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 10,
    color: theme.textMuted,
    letterSpacing: '0.08em',
    fontWeight: 500,
    marginBottom: 16
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 24 : 36
        }}>
          <div>
            <h1 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: isMobile ? 24 : 32,
              color: theme.textPrimary,
              fontWeight: 700,
              letterSpacing: '-0.8px',
              lineHeight: 1.2,
              margin: 0
            }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              color: theme.textMuted,
              fontSize: 13,
              marginTop: 6,
              marginBottom: 0,
              fontWeight: 300
            }}>
              Track and manage your expenses by month
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setYear(y => y - 1)} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 8, fontSize: 18,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>‹</button>

            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: isMobile ? 20 : 24,
              color: theme.textPrimary,
              fontWeight: 700,
              minWidth: 56,
              textAlign: 'center',
              letterSpacing: '-0.5px'
            }}>
              {year}
            </span>

            <button onClick={() => setYear(y => y + 1)} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 8, fontSize: 18,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>›</button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: summaryGridCols,
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 20 : 24
        }}>
          {[
            {
              label: 'TOTAL SPENT',
              value: `₹${totalYear.toLocaleString('en-IN')}`,
              sub: `in ${year}`,
              color: theme.textPrimary
            },
            {
              label: 'ACTIVE MONTHS',
              value: activeMonths,
              sub: 'with expenses',
              color: theme.highlight
            },
            {
              label: 'MONTHLY AVG',
              value: activeMonths
                ? `₹${Math.round(totalYear / activeMonths).toLocaleString('en-IN')}`
                : '₹0',
              sub: 'per month',
              color: theme.textPrimary
            },
            {
              label: 'BUSIEST MONTH',
              value: Object.keys(monthlyTotals).length
                ? MONTHS[Number(
                    Object.entries(monthlyTotals)
                      .sort((a, b) => b[1] - a[1])[0]?.[0]
                  )]?.slice(0, 3) ?? '—'
                : '—',
              sub: 'highest spending',
              color: theme.textPrimary
            },
          ].map(c => (
            <div key={c.label} style={{
              ...card,
              padding: isMobile ? '16px 14px' : '22px 20px'
            }}>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 10, color: theme.textMuted,
                letterSpacing: '0.08em', fontWeight: 500, marginBottom: 8
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: isMobile ? 20 : 26,
                color: c.color, fontWeight: 700, letterSpacing: '-0.5px'
              }}>
                {c.value}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11, color: theme.textSubtle,
                marginTop: 5, fontWeight: 300
              }}>
                {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Chart + Top Expenses ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 14 : 18,
          marginBottom: isMobile ? 20 : 24
        }}>

          {/* Bar Chart */}
          <div style={{ ...card, padding: isMobile ? '16px 14px' : '22px 20px' }}>
            <div style={label}>SPENDING PER MONTH — {year}</div>
            {totalYear > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
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
                      fill: theme.textMuted,
                      fontSize: 10,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fill: theme.textMuted,
                      fontSize: 10,
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v =>
                      v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                    }
                  />
                  <Tooltip
                    formatter={v => [
                      `₹${Number(v).toLocaleString('en-IN')}`,
                      'Spent'
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
                    fill={dark ? '#ffffff' : '#000000'}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans, sans-serif',
                color: theme.textMuted,
                fontSize: 13
              }}>
                No expenses in {year}
              </div>
            )}
          </div>

          {/* Top Expenses */}
          <div style={{ ...card, padding: isMobile ? '16px 14px' : '22px 20px' }}>
            <div style={label}>TOP EXPENSES — {year}</div>
            {topExpenses.length > 0 ? (
              <div>
                {topExpenses.map((exp, i) => (
                  <div key={exp._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < topExpenses.length - 1
                      ? `1px solid ${theme.cardBorder}`
                      : 'none'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flex: 1,
                      minWidth: 0
                    }}>
                      <div style={{
                        width: 24, height: 24,
                        borderRadius: '50%',
                        background: i === 0
                          ? (dark ? '#ffffff' : '#000000')
                          : theme.cardBorder,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                        flexShrink: 0,
                        color: i === 0
                          ? (dark ? '#000000' : '#ffffff')
                          : theme.textMuted,
                        fontFamily: 'DM Sans, sans-serif'
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 13, fontWeight: 600,
                          color: theme.monthCardText,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {exp.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6, marginTop: 3
                        }}>
                          <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 10,
                            background: (CATEGORY_COLORS[exp.category] || '#888') + '22',
                            color: CATEGORY_COLORS[exp.category] || '#888',
                            padding: '1px 7px',
                            borderRadius: 99,
                            fontWeight: 500
                          }}>
                            {exp.category}
                          </span>
                          <span style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 10,
                            color: theme.textMuted
                          }}>
                            {SHORT[new Date(exp.date).getMonth()]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 15, fontWeight: 700,
                      color: theme.monthCardText,
                      letterSpacing: '-0.3px',
                      flexShrink: 0,
                      marginLeft: 8
                    }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'DM Sans, sans-serif',
                color: theme.textMuted,
                fontSize: 13
              }}>
                No expenses in {year}
              </div>
            )}
          </div>
        </div>

        {/* ── Section label ── */}
        <div style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          color: theme.textMuted,
          letterSpacing: '0.1em',
          fontWeight: 500,
          marginBottom: 14
        }}>
          MONTHLY BREAKDOWN — TAP A MONTH TO VIEW EXPENSES
        </div>

        {/* ── Monthly Grid ── */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            fontFamily: 'DM Sans, sans-serif',
            color: theme.textMuted, fontSize: 15
          }}>
            Loading {year}...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: isMobile ? 10 : 14
          }}>
            {MONTHS.map((name, i) => {
              const total     = monthlyTotals[i] || 0;
              const barWidth  = total
                ? Math.round((total / maxMonth) * 100)
                : 0;
              const isCurrent = i === new Date().getMonth() &&
                                year === new Date().getFullYear();

              return (
                <div
                  key={i}
                  onClick={() => setSelectedMonth(i)}
                  style={{
                    background: theme.monthCardBg,
                    border: isCurrent
                      ? `2px solid ${theme.accent}`
                      : `1px solid ${theme.monthCardBorder}`,
                    borderRadius: isMobile ? 12 : 14,
                    padding: isMobile ? '14px 14px' : '20px 20px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s',
                    opacity: !total && !isCurrent ? 0.45 : 1
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = dark
                      ? '0 8px 24px rgba(255,255,255,0.06)'
                      : '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = isCurrent
                      ? theme.accent
                      : theme.monthCardBorder;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      fontSize: 9,
                      color: dark ? '#000000' : '#ffffff',
                      background: theme.accent,
                      padding: '3px 9px', borderRadius: 99,
                      fontWeight: 700,
                      fontFamily: 'DM Sans, sans-serif',
                      letterSpacing: '0.05em'
                    }}>
                      NOW
                    </div>
                  )}

                  <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: isMobile ? 12 : 13,
                    color: theme.monthCardText,
                    fontWeight: 700,
                    marginBottom: 10,
                    letterSpacing: '0.02em'
                  }}>
                    {isMobile ? name.slice(0, 3) : name}
                  </div>

                  <div style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: isMobile ? 18 : 22,
                    color: total ? theme.monthCardText : theme.monthCardMuted,
                    fontWeight: total ? 700 : 300,
                    marginBottom: isMobile ? 10 : 14,
                    letterSpacing: '-0.5px',
                    opacity: total ? 1 : 0.35
                  }}>
                    {total ? `₹${total.toLocaleString('en-IN')}` : '—'}
                  </div>

                  <div style={{
                    background: dark ? '#e0e0e0' : '#f0f0f0',
                    borderRadius: 99, height: 3, overflow: 'hidden'
                  }}>
                    <div style={{
                      width: barWidth + '%', height: '100%',
                      background: barWidth > 75
                        ? theme.highlight
                        : theme.monthCardText,
                      borderRadius: 99,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>

                  {!isMobile && (
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 11,
                      color: theme.monthCardMuted,
                      marginTop: 9,
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 300
                    }}>
                      <span>
                        {total ? `${barWidth}% of peak` : 'No expenses'}
                      </span>
                      {total && (
                        <span style={{
                          color: theme.monthCardText,
                          fontWeight: 600
                        }}>
                          View →
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}