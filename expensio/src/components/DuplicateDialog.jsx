import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_COLORS = {
  Food: '#e07820', Transport: '#1a6fad', Housing: '#3a6640',
  Health: '#e05050', Entertainment: '#7040a0', Shopping: '#c04830',
  Education: '#0f6e56', Travel: '#ba7517', Utilities: '#4a7a8a',
  Other: '#888888'
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function DuplicateDialog({
  isOpen,
  onClose,
  onAddAnyway,
  duplicate,
}) {
  const { dark, theme } = useTheme();

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const catColor = CATEGORY_COLORS[duplicate?.category] || '#888';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="dup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: dark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          {/* Dialog */}
          <motion.div
            key="dup-dialog"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              type: 'spring', stiffness: 380,
              damping: 30, mass: 0.8
            }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201,
              width: '90%', maxWidth: 420,
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 20,
              padding: '28px 24px',
              boxShadow: dark
                ? '0 24px 64px rgba(0,0,0,0.8)'
                : '0 24px 64px rgba(0,0,0,0.15)',
              boxSizing: 'border-box',
            }}
          >
            {/* Warning icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: '#ff444418',
              border: '1px solid #ff444444',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24, marginBottom: 16
            }}>
              ⚠️
            </div>

            {/* Title */}
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 18, fontWeight: 700,
              color: theme.textPrimary,
              letterSpacing: '-0.3px',
              marginBottom: 6
            }}>
              Duplicate Expense Found
            </div>
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13, color: theme.textMuted,
              marginBottom: 20, lineHeight: 1.5
            }}>
              An expense with the same name and amount already exists in{' '}
              <strong style={{ color: theme.textPrimary }}>
                {MONTHS[duplicate?.month]}
              </strong>.
            </div>

            {/* Existing expense card */}
            {duplicate && (
              <div style={{
                background: dark ? '#1a1a1a' : '#f5f5f5',
                border: `1px solid ${theme.cardBorder}`,
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {/* Category icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: catColor + '22',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    color: catColor, fontWeight: 700,
                    fontSize: 16, flexShrink: 0
                  }}>
                    {duplicate.category[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14, fontWeight: 600,
                      color: theme.textPrimary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {duplicate.name}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 6, marginTop: 3
                    }}>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 10, fontWeight: 500,
                        background: catColor + '22',
                        color: catColor,
                        padding: '1px 8px', borderRadius: 99
                      }}>
                        {duplicate.category}
                      </span>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 10, color: theme.textMuted
                      }}>
                        {new Date(duplicate.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 17, fontWeight: 700,
                  color: theme.textPrimary,
                  letterSpacing: '-0.3px',
                  flexShrink: 0
                }}>
                  ₹{duplicate.amount.toLocaleString('en-IN')}
                </div>
              </div>
            )}

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
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
                onMouseOut={e => e.currentTarget.style.borderColor = theme.cardBorder}
              >
                Cancel
              </button>
              <button
                onClick={onAddAnyway}
                style={{
                  flex: 1, padding: '12px',
                  background: '#ff4444',
                  border: 'none', borderRadius: 12,
                  color: '#ffffff',
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                Add Anyway
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}