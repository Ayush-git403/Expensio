import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../utils/helpers';

export default function EditDialog({
  isOpen,
  onClose,
  form,
  setForm,
  onSave,
  error,
  month,
  year
}) {
  const { dark, theme } = useTheme();

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const inputStyle = {
    width: '100%',
    background: dark ? '#1a1a1a' : '#f5f5f5',
    border: `1px solid ${theme.cardBorder}`,
    color: theme.textPrimary,
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    colorScheme: dark ? 'dark' : 'light',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    color: theme.textMuted,
    marginBottom: 6,
    letterSpacing: '0.05em',
    fontWeight: 500,
    fontFamily: 'DM Sans, sans-serif'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: dark
                ? 'rgba(0,0,0,0.75)'
                : 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 30,
              mass: 0.8
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201,
              width: '90%',
              maxWidth: 480,
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 20,
              padding: '28px 24px',
              boxShadow: dark
                ? '0 24px 64px rgba(0,0,0,0.8)'
                : '0 24px 64px rgba(0,0,0,0.15)',
              boxSizing: 'border-box'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 18, fontWeight: 700,
                  color: theme.textPrimary,
                  letterSpacing: '-0.3px'
                }}>
                  Edit Expense
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12, color: theme.textMuted, marginTop: 3
                }}>
                  Make changes and save
                </div>
              </div>
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: dark ? '#1a1a1a' : '#f0f0f0',
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textMuted,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer', fontSize: 16,
                  fontFamily: 'DM Sans, sans-serif',
                  flexShrink: 0
                }}>
                ✕
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                color: '#ff4444', fontSize: 13,
                marginBottom: 16, padding: '8px 12px',
                background: '#ff444418', borderRadius: 8,
                border: '1px solid #ff444444',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {error}
              </div>
            )}

            {/* Form fields */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>NAME</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Expense name"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>AMOUNT (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14, marginBottom: 16
            }}>
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={inputStyle}>
                  {CATEGORIES.map(c => (
                    <option key={c}>{c}</option>
                  ))}
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

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>NOTE (optional)</label>
              <input
                type="text"
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Any extra detail..."
                style={inputStyle}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '12px',
                  background: 'none',
                  border: `1px solid ${theme.cardBorder}`,
                  borderRadius: 12,
                  color: theme.textMuted,
                  fontSize: 14, fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s'
                }}>
                Cancel
              </button>
              <button
                onClick={onSave}
                style={{
                  flex: 2, padding: '12px',
                  background: dark ? '#ffffff' : '#000000',
                  border: 'none', borderRadius: 12,
                  color: dark ? '#000000' : '#ffffff',
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}