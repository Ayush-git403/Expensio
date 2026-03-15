import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import MonthView from '../components/MonthView';

const MONTHS = [
  'January','February','March','April',
  'May','June','July','August',
  'September','October','November','December'
];

export default function Home() {
  const { user } = useAuth();
  const { dark, theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchYearlyData(); }, [year]);

  async function fetchYearlyData() {
    setLoading(true);
    try {
      const { data } = await API.get(`/expenses?year=${year}`);
      const totals = {};
      data.forEach(exp => {
        const m = new Date(exp.date).getMonth();
        totals[m] = (totals[m] || 0) + exp.amount;
      });
      setMonthlyTotals(totals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalYear = Object.values(monthlyTotals).reduce((s, v) => s + v, 0);
  const maxMonth  = Math.max(...Object.values(monthlyTotals), 1);
  const activeMonths = Object.keys(monthlyTotals).length;

  if (selectedMonth !== null) {
    return (
      <MonthView
        month={selectedMonth}
        year={year}
        onBack={() => { setSelectedMonth(null); fetchYearlyData(); }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 32
        }}>
          <div>
            <h1 className="serif" style={{
              fontSize: 34, color: theme.textPrimary,
              fontWeight: 400, letterSpacing: '-0.5px'
            }}>
              Welcome back, {user?.name?.split(' ')[0]} !
            </h1>
            <p style={{ color: theme.textPrimary, fontSize: 14, marginTop: 6, opacity: 0.7 }}>
              Track and manage your expenses by month
            </p>
          </div>

          {/* Year Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setYear(y => y - 1)}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.textPrimary,
                padding: '8px 16px', borderRadius: 10,
                fontSize: 18, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
              onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}>
              ‹
            </button>
            <span className="serif" style={{
              fontSize: 26, color: theme.accent,
              minWidth: 64, textAlign: 'center'
            }}>
              {year}
            </span>
            <button onClick={() => setYear(y => y + 1)}
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.cardBorder}`,
                color: theme.textPrimary,
                padding: '8px 16px', borderRadius: 10,
                fontSize: 18, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
              onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}>
              ›
            </button>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14, marginBottom: 28
        }}>
          {[
            {
              label: 'TOTAL SPENT',
              value: `₹${totalYear.toLocaleString('en-IN')}`,
              sub: `in ${year}`,
              color: theme.accent
            },
            {
              label: 'ACTIVE MONTHS',
              value: activeMonths,
              sub: 'with expenses',
              color: theme.highlight
            },
            {
              label: 'MONTHLY AVERAGE',
              value: activeMonths
                ? `₹${Math.round(totalYear / activeMonths).toLocaleString('en-IN')}`
                : '₹0',
              sub: 'per active month',
              color: theme.magenta
            },
            {
              label: 'BUSIEST MONTH',
              value: Object.keys(monthlyTotals).length
                ? MONTHS[Number(Object.entries(monthlyTotals)
                    .sort((a,b) => b[1]-a[1])[0]?.[0])]?.slice(0,3)
                : '—',
              sub: 'highest spending',
              color: theme.almond
            },
          ].map(c => (
            <div key={c.label} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 14, padding: '20px 22px',
              transition: 'background 0.3s'
            }}>
              <div style={{
                fontSize: 11, color: theme.textPrimary,
                opacity: 0.6,
                marginBottom: 8, letterSpacing: '0.06em', fontWeight: 500
              }}>
                {c.label}
              </div>
              <div className="serif" style={{
                fontSize: 26, color: c.color,
                letterSpacing: '-0.5px'
              }}>
                {c.value}
              </div>
              <div style={{
                fontSize: 12, color: theme.textPrimary,
                opacity: 0.5, marginTop: 4
              }}>
                {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Section Label */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            color: theme.textPrimary, fontSize: 15, opacity: 0.6
          }}>
            Loading your expenses...
          </div>
        ) : (
          <>
            <div style={{
              fontSize: 12, color: theme.textPrimary,
              opacity: 0.55,
              letterSpacing: '0.06em', marginBottom: 14,
              fontWeight: 500
            }}>
              MONTHLY BREAKDOWN — CLICK A MONTH TO VIEW EXPENSES
            </div>

            {/* Monthly Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 14
            }}>
              {MONTHS.map((name, i) => {
                const total     = monthlyTotals[i] || 0;
                const barWidth  = total ? Math.round((total / maxMonth) * 100) : 0;
                const isCurrent = i === new Date().getMonth() && year === new Date().getFullYear();

                return (
                  <div key={i} onClick={() => setSelectedMonth(i)}
                    style={{
                      background: isCurrent
                        ? (dark ? '#1e2d40' : '#e8f4fc')
                        : theme.cardBg,
                      border: isCurrent
                        ? `1.5px solid ${theme.accent}`
                        : `1px solid ${theme.cardBorder}`,
                      borderRadius: 14, padding: '20px 20px',
                      cursor: 'pointer', position: 'relative',
                      transition: 'all 0.2s',
                      opacity: !total && !isCurrent ? 0.75 : 1
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = theme.accent;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${theme.accent}22`;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = isCurrent ? theme.accent : theme.cardBorder;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>

                    {/* Current badge */}
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        fontSize: 10, color: theme.accent,
                        background: dark ? '#0d1e2e' : '#d0eaf8',
                        padding: '3px 9px', borderRadius: 99,
                        border: `1px solid ${theme.accent}55`,
                        fontWeight: 500
                      }}>
                        NOW
                      </div>
                    )}

                    {/* Month name — FIXED COLOR */}
                    <div style={{
                      fontSize: 14,
                      color: theme.textPrimary,
                      marginBottom: 10,
                      fontWeight: 600,
                      letterSpacing: '0.01em'
                    }}>
                      {name}
                    </div>

                    {/* Amount */}
                    <div className="serif" style={{
                      fontSize: 22,
                      color: total ? theme.accent : theme.textPrimary,
                      opacity: total ? 1 : 0.3,
                      marginBottom: 14,
                      letterSpacing: '-0.3px'
                    }}>
                      {total ? `₹${total.toLocaleString('en-IN')}` : '—'}
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      background: theme.barTrack,
                      borderRadius: 99, height: 5,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: barWidth + '%', height: '100%',
                        background: barWidth > 75 ? theme.highlight : theme.accent,
                        borderRadius: 99,
                        transition: 'width 0.6s ease'
                      }} />
                    </div>

                    {/* Footer row */}
                    <div style={{
                      fontSize: 11,
                      color: theme.textPrimary,
                      opacity: 0.5,
                      marginTop: 10,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{total ? `${barWidth}% of peak` : 'No expenses'}</span>
                      {total
                        ? <span style={{ color: theme.accent, opacity: 1 }}>View →</span>
                        : null}
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