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

  const totalYear = Object.values(monthlyTotals).reduce((s, v) => s + v, 0);
  const maxMonth  = Math.max(...Object.values(monthlyTotals), 1);
  const activeMonths = Object.keys(monthlyTotals).length;

  const padding = isMobile ? '16px 14px' : '28px 20px';
  const gridCols = isMobile
    ? 'repeat(2, 1fr)'
    : isTablet
    ? 'repeat(3, 1fr)'
    : 'repeat(4, 1fr)';

  const summaryGridCols = isMobile
    ? 'repeat(2, 1fr)'
    : 'repeat(4, 1fr)';

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
      <div style={{ maxWidth: 980, margin: '0 auto', padding }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 0,
          marginBottom: isMobile ? 20 : 32
        }}>
          <div>
            <h1 className="serif" style={{
              fontSize: isMobile ? 26 : 34,
              color: theme.textPrimary,
              fontWeight: 400, letterSpacing: '-0.5px',
              lineHeight: 1.2
            }}>
              Welcome back,{' '}
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: theme.textPrimary, fontSize: 13, marginTop: 6, opacity: 0.6 }}>
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
              borderRadius: 10, fontSize: 18, cursor: 'pointer'
            }}>‹</button>
            <span className="serif" style={{
              fontSize: isMobile ? 22 : 26,
              color: theme.accent, minWidth: 56, textAlign: 'center'
            }}>
              {year}
            </span>
            <button onClick={() => setYear(y => y + 1)} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textPrimary,
              padding: isMobile ? '6px 12px' : '8px 16px',
              borderRadius: 10, fontSize: 18, cursor: 'pointer'
            }}>›</button>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: summaryGridCols,
          gap: isMobile ? 10 : 14,
          marginBottom: isMobile ? 16 : 28
        }}>
          {[
            { label: 'TOTAL SPENT', value: `₹${totalYear.toLocaleString('en-IN')}`, sub: `in ${year}`, color: theme.accent },
            { label: 'ACTIVE MONTHS', value: activeMonths, sub: 'with expenses', color: theme.highlight },
            { label: 'MONTHLY AVG', value: activeMonths ? `₹${Math.round(totalYear / activeMonths).toLocaleString('en-IN')}` : '₹0', sub: 'per month', color: theme.magenta },
            {
              label: 'BUSIEST MONTH',
              value: Object.keys(monthlyTotals).length
                ? MONTHS[Number(Object.entries(monthlyTotals).sort((a, b) => b[1] - a[1])[0]?.[0])]?.slice(0, 3)
                : '—',
              sub: 'highest spending',
              color: theme.almond
            },
          ].map(c => (
            <div key={c.label} style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: isMobile ? 12 : 14,
              padding: isMobile ? '14px 14px' : '20px 22px',
              transition: 'background 0.3s'
            }}>
              <div style={{
                fontSize: 10, color: theme.textPrimary,
                opacity: 0.5, marginBottom: 6,
                letterSpacing: '0.06em', fontWeight: 500
              }}>
                {c.label}
              </div>
              <div className="serif" style={{
                fontSize: isMobile ? 20 : 26,
                color: c.color, letterSpacing: '-0.5px'
              }}>
                {c.value}
              </div>
              <div style={{
                fontSize: 11, color: theme.textPrimary,
                opacity: 0.45, marginTop: 4
              }}>
                {c.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Section label */}
        <div style={{
          fontSize: 11, color: theme.textPrimary,
          opacity: 0.5, letterSpacing: '0.06em',
          marginBottom: 12, fontWeight: 500
        }}>
          MONTHLY BREAKDOWN — TAP A MONTH TO VIEW EXPENSES
        </div>

        {/* Monthly grid */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: theme.textPrimary, opacity: 0.5
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
              const total = monthlyTotals[i] || 0;
              const barWidth = total ? Math.round((total / maxMonth) * 100) : 0;
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
                    borderRadius: isMobile ? 12 : 14,
                    padding: isMobile ? '14px 14px' : '20px 20px',
                    cursor: 'pointer', position: 'relative',
                    transition: 'all 0.2s',
                    opacity: !total && !isCurrent ? 0.6 : 1
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = isCurrent ? theme.accent : theme.cardBorder;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>

                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      fontSize: 9, color: theme.accent,
                      background: dark ? '#0d1e2e' : '#d0eaf8',
                      padding: '2px 7px', borderRadius: 99,
                      border: `1px solid ${theme.accent}55`,
                      fontWeight: 500
                    }}>NOW</div>
                  )}

                  <div style={{
                    fontSize: isMobile ? 12 : 13,
                    color: theme.textPrimary,
                    fontWeight: 600, marginBottom: 8
                  }}>
                    {isMobile ? name.slice(0, 3) : name}
                  </div>

                  <div className="serif" style={{
                    fontSize: isMobile ? 16 : 20,
                    color: total ? theme.accent : theme.textPrimary,
                    opacity: total ? 1 : 0.3,
                    marginBottom: isMobile ? 10 : 14,
                    letterSpacing: '-0.3px'
                  }}>
                    {total ? `₹${total.toLocaleString('en-IN')}` : '—'}
                  </div>

                  <div style={{
                    background: theme.barTrack,
                    borderRadius: 99, height: 4, overflow: 'hidden'
                  }}>
                    <div style={{
                      width: barWidth + '%', height: '100%',
                      background: barWidth > 75 ? theme.highlight : theme.accent,
                      borderRadius: 99, transition: 'width 0.6s ease'
                    }} />
                  </div>

                  {!isMobile && (
                    <div style={{
                      fontSize: 11, color: theme.textPrimary,
                      opacity: 0.45, marginTop: 8,
                      display: 'flex', justifyContent: 'space-between'
                    }}>
                      <span>{total ? `${barWidth}% of peak` : 'No expenses'}</span>
                      {total && <span style={{ color: theme.accent, opacity: 1 }}>View →</span>}
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