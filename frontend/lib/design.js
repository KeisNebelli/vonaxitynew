// frontend/lib/design.js
// Vonaxity Design System v2
// Premium healthcare-tech aesthetic

export const DS = {
  // ── Color palette ──────────────────────────────────────────────────────────
  colors: {
    // Primary — calm blue
    primary: '#2563EB',
    primaryLight: '#EFF6FF',
    primaryMid: '#3B82F6',
    primaryDark: '#1D4ED8',

    // Secondary — soft green (health)
    secondary: '#059669',
    secondaryLight: '#ECFDF5',
    secondaryDark: '#047857',

    // Neutral scale
    bg: '#FAFAF9',
    bgWhite: '#FFFFFF',
    bgSubtle: '#F5F5F4',

    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    border: '#E5E7EB',
    borderSubtle: '#F3F4F6',

    // Semantic
    warning: '#D97706',
    warningLight: '#FFFBEB',
    error: '#DC2626',
    errorLight: '#FEF2F2',
    info: '#0EA5E9',
    infoLight: '#F0F9FF',
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  fonts: {
    sans: "'Inter', 'system-ui', -apple-system, sans-serif",
    heading: "'Inter', 'system-ui', -apple-system, sans-serif",
  },

  // ── Spacing ────────────────────────────────────────────────────────────────
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
    section: '96px',
  },

  // ── Border radius ──────────────────────────────────────────────────────────
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    card: '0 1px 4px rgba(0,0,0,0.06)',
  },
};

// ── Component style factories ─────────────────────────────────────────────────
export const styles = {
  // Buttons
  btnPrimary: {
    background: DS.colors.primary,
    color: '#fff',
    border: 'none',
    borderRadius: DS.radius.md,
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.1px',
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },

  btnSecondary: {
    background: DS.colors.bgWhite,
    color: DS.colors.textPrimary,
    border: `1.5px solid ${DS.colors.border}`,
    borderRadius: DS.radius.md,
    padding: '11px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '-0.1px',
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },

  btnGhost: {
    background: 'transparent',
    color: DS.colors.primary,
    border: 'none',
    borderRadius: DS.radius.md,
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  // Cards
  card: {
    background: DS.colors.bgWhite,
    border: `1px solid ${DS.colors.border}`,
    borderRadius: DS.radius.lg,
    boxShadow: DS.shadow.card,
    padding: '24px',
  },

  cardSubtle: {
    background: DS.colors.bgSubtle,
    border: `1px solid ${DS.colors.border}`,
    borderRadius: DS.radius.lg,
    padding: '20px',
  },

  // Inputs
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: DS.radius.md,
    border: `1.5px solid ${DS.colors.border}`,
    fontSize: '14px',
    color: DS.colors.textPrimary,
    background: DS.colors.bgWhite,
    outline: 'none',
    fontFamily: DS.fonts.sans,
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },

  // Badges
  badge: (type = 'default') => {
    const types = {
      default: { bg: DS.colors.bgSubtle, color: DS.colors.textSecondary },
      primary: { bg: DS.colors.primaryLight, color: DS.colors.primaryDark },
      success: { bg: DS.colors.secondaryLight, color: DS.colors.secondaryDark },
      warning: { bg: DS.colors.warningLight, color: DS.colors.warning },
      error: { bg: DS.colors.errorLight, color: DS.colors.error },
      info: { bg: DS.colors.infoLight, color: DS.colors.info },
    };
    const t = types[type] || types.default;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      fontWeight: 600,
      padding: '4px 10px',
      borderRadius: DS.radius.full,
      background: t.bg,
      color: t.color,
      letterSpacing: '0.1px',
    };
  },
};

// ── Global CSS string (inject in _app or layout) ──────────────────────────────
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: 'Inter', 'system-ui', -apple-system, sans-serif;
  background: #FAFAF9;
  color: #111827;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5 {
  font-family: 'Inter', 'system-ui', -apple-system, sans-serif;
  letter-spacing: -0.025em;
  color: #111827;
  line-height: 1.2;
}

a { text-decoration: none; color: inherit; }

button { font-family: inherit; }

input, textarea, select { font-family: inherit; }

::selection { background: #DBEAFE; }
`;
