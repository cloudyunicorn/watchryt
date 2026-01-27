export const theme = {
  colors: {
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
    tiktok: '#00F2EA', // TikTok cyan-ish
    youtube: '#FF0000',
    facebook: '#1877F2',
    placeholder: '#404040'
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' as const, color: '#FFFFFF' },
    h2: { fontSize: 24, fontWeight: 'bold' as const, color: '#FFFFFF' },
    h3: { fontSize: 20, fontWeight: '600' as const, color: '#FFFFFF' },
    body: { fontSize: 16, color: '#FFFFFF' },
    caption: { fontSize: 12, color: '#B3B3B3' },
    button: { fontSize: 16, fontWeight: '600' as const, color: '#FFFFFF' },
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    full: 9999,
  }
};
