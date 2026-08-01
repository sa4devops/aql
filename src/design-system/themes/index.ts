/**
 * Design System — Theme Definitions
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 *
 * Describes the two supported themes: light and dark.
 * Theme switching is handled by AppShell via CSS class on <html>.
 * Dark mode: class="dark" on <html>
 * Light mode: no class (default)
 *
 * Accent variants: indigo (default), navy
 * Accent switching is handled by AppShell via CSS custom property override.
 */

export type ThemeName = 'light' | 'dark';
export type AccentName = 'indigo' | 'navy';

export interface ThemeDescriptor {
  name: ThemeName;
  label: { ar: string; en: string };
  cssClass: string;
  description: { ar: string; en: string };
}

export const THEMES: ThemeDescriptor[] = [
  {
    name: 'light',
    label: { ar: 'فاتح', en: 'Light' },
    cssClass: '',
    description: {
      ar: 'الوضع الافتراضي — خلفية فاتحة مع نصوص داكنة',
      en: 'Default mode — light background with dark text',
    },
  },
  {
    name: 'dark',
    label: { ar: 'داكن', en: 'Dark' },
    cssClass: 'dark',
    description: {
      ar: 'وضع الظلام — خلفية داكنة مع نصوص فاتحة، مع الحفاظ على التسلسل البصري',
      en: 'Dark mode — dark background with light text, preserving visual hierarchy',
    },
  },
];

export interface AccentDescriptor {
  name: AccentName;
  label: { ar: string; en: string };
  primaryColor: string;
  description: { ar: string; en: string };
}

export const ACCENTS: AccentDescriptor[] = [
  {
    name: 'indigo',
    label: { ar: 'نيلي', en: 'Indigo' },
    primaryColor: '#6366F1',
    description: {
      ar: 'اللون الافتراضي — نيلي حديث',
      en: 'Default accent — modern indigo',
    },
  },
  {
    name: 'navy',
    label: { ar: 'كحلي', en: 'Navy' },
    primaryColor: '#1B365D',
    description: {
      ar: 'كحلي مؤسسي — مناسب للجهات الحكومية',
      en: 'Enterprise navy — suitable for government entities',
    },
  },
];
