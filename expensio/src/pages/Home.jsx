import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWindowSize } from '../hooks/useWindowSize';
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
  const { isMobile, isTablet } = useWindowSize();
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

  const totalYear   = Object.values(monthlyTotals).reduce((s, v) => s + v, 0);
  const maxMonth    = Math.max(...Object.values(monthlyTotals), 1);
  const activeMonths = Object.keys(monthlyTotals).length;

  const padding      = isMobile ? '16px 14px' : '32px 40px';
  const gridCols     = isMobile ? 'repeat(2,1fr)' : isTablet ? 'repeat(3,1fr)' : 'repeat(4,1fr)';
  const summaryGridCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)';

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
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      transition: 'background 0.3s'
    }}>
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
              lineHeight: 1.2
            }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              color: theme.textMuted,
              fontSize: 13,
              marginTop: 6,
              fontWeight: 300
            }}>
              Track and manage your expenses by month
            </p>
          </div>

          {/* Year selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setYear(y => y - 1)} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 8, fontSize: 18,
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.currentTarget.style.background = theme.accent === '#000000' ? '#f0f0f0' : '#222'}
              onMouseOut={e => e.currentTarget.style.background = theme.cardBg}>
              ‹
            </button>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: isMobile ? 20 : 24,
              color: theme.textPrimary,
              fontWeight: 700,
              minWidth: 56, textAlign: 'center',
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
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.currentTarget.style.background = theme.accent === '#000000' ? '#f0f0f0' : '#222'}
              onMouseOut={e => e.currentTarget.style.background = theme.cardBg}>
              ›
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: summaryGridCols,
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 24 : 36
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
                ? MONTHS[Number(Object.entries(monthlyTotals)
                    .sort((a, b) => b[1] - a[1])[0]?.[0])]?.slice(0, 3)
                : '—',
              sub: 'highest spending',
              color: theme.textPrimary
            },
          ].map(c => (
            <div key={c.label} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: isMobile ? 12 : 14,
              padding: isMobile ? '16px 14px' : '22px 20px',
              transition: 'background 0.3s'
            }}>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 10,
                color: theme.textMuted,
                letterSpacing: '0.08em',
                fontWeight: 500,
                marginBottom: 8
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: isMobile ? 20 : 26,
                color: c.color,
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}>
                {c.value}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11,
                color: theme.textSubtle,
                marginTop: 5,
                fontWeight: 300
              }}>
                {c.sub}
              </div>
            </div>
          ))}
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
            Loading...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: isMobile ? 10 : 14
          }}>
            {MONTHS.map((name, i) => {
              const total     = monthlyTotals[i] || 0;
              const barWidth  = total ? Math.round((total / maxMonth) * 100) : 0;
              const isCurrent = i === new Date().getMonth() &&
                                year === new Date().getFullYear();

              return (
                <div key={i} onClick={() => setSelectedMonth(i)}
                  style={{
                    background: theme.monthCardBg,
                    border: isCurrent
                      ? `2px solid ${theme.accent}`
                      : `1px solid ${theme.monthCardBorder}`,
                    borderRadius: isMobile ? 12 : 14,
                    padding: isMobile ? '14px 14px' : '20px 20px',
                    cursor: 'pointer', position: 'relative',
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
                  }}>

                  {/* Current badge */}
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

                  {/* Month name */}
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

                  {/* Amount */}
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

                  {/* Progress bar */}
                  <div style={{
                    background: dark ? '#e0e0e0' : '#f0f0f0',
                    borderRadius: 99, height: 3,
                    overflow: 'hidden'
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

                  {/* Footer */}
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