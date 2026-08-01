/**
 * Design System Tokens
 * Source: src/styles/tailwind.css CSS variables
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * All tokens reference CSS custom properties defined in tailwind.css.
 * Do NOT use raw hex values in components — always use the token name.
 */

// ─── Accent Tokens ────────────────────────────────────────────────────────────
export const accentTokens = {
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  accentPressed: 'var(--accent-pressed)',
  accentSubtle: 'var(--accent-subtle)',
  accentForeground: 'var(--accent-foreground)',
  accentMuted: 'var(--accent-muted)',
} as const;

// ─── Gray Scale ───────────────────────────────────────────────────────────────
export const grayTokens = {
  gray50: 'var(--gray-50)',
  gray100: 'var(--gray-100)',
  gray200: 'var(--gray-200)',
  gray300: 'var(--gray-300)',
  gray400: 'var(--gray-400)',
  gray500: 'var(--gray-500)',
  gray600: 'var(--gray-600)',
  gray700: 'var(--gray-700)',
  gray800: 'var(--gray-800)',
  gray900: 'var(--gray-900)',
  gray950: 'var(--gray-950)',
} as const;

// ─── Surface Tokens ───────────────────────────────────────────────────────────
export const surfaceTokens = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  surface: 'var(--surface)',
  surfaceRaised: 'var(--surface-raised)',
  surfaceOverlay: 'var(--surface-overlay)',
  border: 'var(--border)',
  borderSubtle: 'var(--border-subtle)',
  borderStrong: 'var(--border-strong)',
} as const;

// ─── Text Tokens ──────────────────────────────────────────────────────────────
export const textTokens = {
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  textDisabled: 'var(--text-disabled)',
  textInverse: 'var(--text-inverse)',
} as const;

// ─── Semantic Status Tokens ───────────────────────────────────────────────────
export const semanticTokens = {
  success: 'var(--success)',
  successBg: 'var(--success-bg)',
  successBorder: 'var(--success-border)',
  successText: 'var(--success-text)',

  warning: 'var(--warning)',
  warningBg: 'var(--warning-bg)',
  warningBorder: 'var(--warning-border)',
  warningText: 'var(--warning-text)',

  error: 'var(--error)',
  errorBg: 'var(--error-bg)',
  errorBorder: 'var(--error-border)',
  errorText: 'var(--error-text)',

  info: 'var(--info)',
  infoBg: 'var(--info-bg)',
  infoBorder: 'var(--info-border)',
  infoText: 'var(--info-text)',

  disabled: 'var(--disabled)',
  disabledBg: 'var(--disabled-bg)',
  disabledBorder: 'var(--disabled-border)',
  disabledText: 'var(--disabled-text)',
} as const;

// ─── Risk Tokens ──────────────────────────────────────────────────────────────
export const riskTokens = {
  riskLow: 'var(--risk-low)',
  riskLowBg: 'var(--risk-low-bg)',
  riskLowBorder: 'var(--risk-low-border)',
  riskLowText: 'var(--risk-low-text)',

  riskMedium: 'var(--risk-medium)',
  riskMediumBg: 'var(--risk-medium-bg)',
  riskMediumBorder: 'var(--risk-medium-border)',
  riskMediumText: 'var(--risk-medium-text)',

  riskHigh: 'var(--risk-high)',
  riskHighBg: 'var(--risk-high-bg)',
  riskHighBorder: 'var(--risk-high-border)',
  riskHighText: 'var(--risk-high-text)',

  riskCritical: 'var(--risk-critical)',
  riskCriticalBg: 'var(--risk-critical-bg)',
  riskCriticalBorder: 'var(--risk-critical-border)',
  riskCriticalText: 'var(--risk-critical-text)',
} as const;

// ─── Classification Tokens ────────────────────────────────────────────────────
export const classificationTokens = {
  classPublic: 'var(--class-public)',
  classPublicBg: 'var(--class-public-bg)',
  classPublicText: 'var(--class-public-text)',

  classInternal: 'var(--class-internal)',
  classInternalBg: 'var(--class-internal-bg)',
  classInternalText: 'var(--class-internal-text)',

  classConfidential: 'var(--class-confidential)',
  classConfidentialBg: 'var(--class-confidential-bg)',
  classConfidentialText: 'var(--class-confidential-text)',

  classTopSecret: 'var(--class-topsecret)',
  classTopSecretBg: 'var(--class-topsecret-bg)',
  classTopSecretText: 'var(--class-topsecret-text)',
} as const;

// ─── Spacing Scale ────────────────────────────────────────────────────────────
export const spacingScale = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

// ─── Radius Tokens ────────────────────────────────────────────────────────────
export const radiusTokens = {
  sm: 'var(--radius-sm)',   // 4px
  md: 'var(--radius-md)',   // 6px
  lg: 'var(--radius-lg)',   // 8px
  xl: 'var(--radius-xl)',   // 12px
  full: 'var(--radius-full)', // 9999px
} as const;

// ─── Shadow Tokens ────────────────────────────────────────────────────────────
export const shadowTokens = {
  elevation1: 'var(--shadow-1)',
  elevation2: 'var(--shadow-2)',
} as const;

// ─── Typography Tokens ────────────────────────────────────────────────────────
export const typographyTokens = {
  fontArabic: 'var(--font-arabic)',   // Cairo — local
  fontLatin: 'var(--font-latin)',     // Inter — local
  fontMono: 'var(--font-mono)',       // JetBrains Mono — local
} as const;

// ─── Layout Tokens ────────────────────────────────────────────────────────────
export const layoutTokens = {
  sidebarWidth: 'var(--sidebar-width)',       // 240px
  sidebarCollapsed: 'var(--sidebar-collapsed)', // 64px
  topbarHeight: 'var(--topbar-height)',       // 56px
} as const;

// ─── Motion Tokens ────────────────────────────────────────────────────────────
export const motionTokens = {
  durationFast: '150ms',
  durationBase: '200ms',
  durationSlow: '300ms',
  easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─── Breakpoints ─────────────────────────────────────────────────────────────
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ─── Icon Sizes ───────────────────────────────────────────────────────────────
export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
} as const;

// ─── All Tokens (flat export) ─────────────────────────────────────────────────
export const tokens = {
  ...accentTokens,
  ...grayTokens,
  ...surfaceTokens,
  ...textTokens,
  ...semanticTokens,
  ...riskTokens,
  ...classificationTokens,
  spacing: spacingScale,
  radius: radiusTokens,
  shadow: shadowTokens,
  typography: typographyTokens,
  layout: layoutTokens,
  motion: motionTokens,
  breakpoints,
  iconSizes,
} as const;

export default tokens;
