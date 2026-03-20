export const colors = {
  primary: '#0F766E', // Vibrant Teal
  secondary: '#F472B6', // Warm Peach/Pink
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A', // Slate 900
  caption: '#475569', // Slate 600
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  border: '#CBD5E1', 
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: 'bold' as const, letterSpacing: -0.5, color: colors.text },
  h2: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, lineHeight: 24, fontWeight: 'normal' as const, color: colors.text },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.caption },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
