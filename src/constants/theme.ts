// 瑞士设计系统 — 色彩、排版、间距
// Swiss Design System — colors, typography, spacing

export const Colors = {
  // 主色调
  swissRed: '#E11D2B',
  swissRedDark: '#B0121A',
  swissRedLight: '#F7D0D3',

  // 中性色
  white: '#FFFFFF',
  nearBlack: '#1A1A1A',
  darkGray: '#4A4A4A',
  midGray: '#8C8C8C',
  lightGray: '#E5E5E5',
  offWhite: '#F8F8F8',
  border: '#E8E8E8',

  // 点缀色
  glacierBlue: '#C4D7E6',
  alpineGreen: '#4A7C59',
  goldAccent: '#D4A843',
} as const;

export const Typography = {
  // 字体族
  fontFamily: 'Inter',
  fontFamilyMono: 'Inter',

  // 字号与行高
  hero: { fontSize: 36, lineHeight: 44, letterSpacing: -0.5 },
  h1: { fontSize: 28, lineHeight: 36, letterSpacing: -0.3 },
  h2: { fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 24 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySmall: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 16 },
  button: { fontSize: 16, lineHeight: 20, letterSpacing: 0.5 },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const Shadows = {
  none: {},
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
