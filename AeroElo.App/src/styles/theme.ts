// AeroGuest branding theme
export const theme = {
  colors: {
    // Primary brand colors
    primary: '#0066CC',
    primaryLight: '#3388DD',
    primaryDark: '#004499',
    
    // Secondary colors
    secondary: '#6C757D',
    secondaryLight: '#ADB5BD',
    secondaryDark: '#495057',
    
    // Status colors
    success: '#28A745',
    warning: '#FFC107',
    danger: '#DC3545',
    info: '#17A2B8',
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    
    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textMuted: '#ADB5BD',
  },
  
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Fira Code', 'Consolas', monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Theme = typeof theme;
