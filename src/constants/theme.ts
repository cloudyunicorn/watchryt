// Light and Dark theme color schemes
export const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceHighlight: '#E9ECEF',
  primary: '#7C3AED', // Vivid purple
  primaryVariant: '#5B21B6',
  secondary: '#06B6D4',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  error: '#DC2626',
  success: '#10B981',
  border: '#E5E7EB',

  // Platform colors (same for both themes)
  instagram: '#E1306C',
  tiktok: '#00F2EA',
  youtube: '#FF0000',
  facebook: '#1877F2',
  placeholder: '#D1D5DB'
};

export const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceHighlight: '#2C2C2C',
  primary: '#BB86FC', // Material Design Purple 200
  primaryVariant: '#3700B3',
  secondary: '#03DAC6',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  error: '#CF6679',
  success: '#03DAC6',
  border: '#333333',

  // Platform colors
  instagram: '#E1306C',
  tiktok: '#00F2EA',
  youtube: '#FF0000',
  facebook: '#1877F2',
  placeholder: '#404040'
};

export type ThemeColors = typeof darkColors;

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16 },
  caption: { fontSize: 12 },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  full: 9999,
};

// Default export for backwards compatibility (dark theme)
export const theme = {
  colors: darkColors,
  spacing,
  typography,
  borderRadius,
};
