/**
 * Enterprise UI Reference Showcase
 * Route: /ui-reference
 * Status: VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED
 * OFFLINE DESIGN TARGET — VERIFICATION PENDING
 *
 * All assets are local. No external fonts, icons, images, or scripts.
 * Fonts: Cairo (Arabic), Inter (Latin), JetBrains Mono — all local woff2
 * Icons: inline SVG only
 * Images: local public/assets/images/ only
 */

'use client';
import React, { useState, useEffect } from 'react';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge, RiskBadge, ClassificationBadge } from '@/components/StatusBadge';

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) => (
  <section id={id} className="mb-12 scroll-mt-16">
    <div className="mb-5">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {children}
  </section>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{title}</div>
    {children}
  </div>
);

const Card = ({ children, className = '', padding = true, style }: { children: React.ReactNode; className?: string; padding?: boolean; style?: React.CSSProperties }) => (
  <div className={`card ${padding ? 'p-5' : ''} ${className}`} style={style}>{children}</div>
);

// ─── Token Swatch ─────────────────────────────────────────────────────────────
const ColorSwatch = ({ token, label, value }: { token: string; label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <div className="rounded-md w-full" style={{ height: 44, background: `var(${token})`, border: '1px solid var(--border)' }} title={value} />
    <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{token}</div>
  </div>
);

const TokenRow = ({ token, description }: { token: string; description: string }) => (
  <div className="flex items-center gap-4 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
    <code className="text-xs font-mono w-52 flex-shrink-0" style={{ color: 'var(--accent)' }}>{token}</code>
    <div className="rounded flex-shrink-0" style={{ width: 20, height: 20, background: `var(${token})`, border: '1px solid var(--border)' }} />
    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</span>
  </div>
);

// ─── Section 1: Foundations ───────────────────────────────────────────────────
const FoundationsSection = ({ t }: { t: (ar: string, en: string) => string }) => (
  <Section id="foundations" title={t('١ — الأسس', '1 — Foundations')} subtitle={t('Tokens اللون والطباعة والمسافات والحواف والظلال', 'Color, typography, spacing, radius, and shadow tokens')}>
    <Card>
      <SubSection title={t('ألوان التمييز', 'Accent Colors')}>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <ColorSwatch token="--accent" label={t('أساسي', 'Default')} value="#6366F1" />
          <ColorSwatch token="--accent-hover" label={t('تحويم', 'Hover')} value="#4F46E5" />
          <ColorSwatch token="--accent-pressed" label={t('ضغط', 'Pressed')} value="#4338CA" />
          <ColorSwatch token="--accent-subtle" label={t('خفيف', 'Subtle')} value="#EEF2FF" />
          <ColorSwatch token="--accent-muted" label={t('مكتوم', 'Muted')} value="#C7D2FE" />
          <ColorSwatch token="--accent-foreground" label={t('نص', 'Foreground')} value="#FFFFFF" />
        </div>
      </SubSection>

      <SubSection title={t('ألوان السطح', 'Surface Colors')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ColorSwatch token="--background" label={t('خلفية', 'Background')} value="--background" />
          <ColorSwatch token="--surface" label={t('سطح', 'Surface')} value="--surface" />
          <ColorSwatch token="--surface-raised" label={t('سطح مرفوع', 'Raised')} value="--surface-raised" />
          <ColorSwatch token="--surface-overlay" label={t('طبقة', 'Overlay')} value="--surface-overlay" />
        </div>
      </SubSection>

      <SubSection title={t('ألوان النص', 'Text Colors')}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <ColorSwatch token="--text-primary" label={t('أساسي', 'Primary')} value="--text-primary" />
          <ColorSwatch token="--text-secondary" label={t('ثانوي', 'Secondary')} value="--text-secondary" />
          <ColorSwatch token="--text-muted" label={t('خافت', 'Muted')} value="--text-muted" />
          <ColorSwatch token="--text-disabled" label={t('معطل', 'Disabled')} value="--text-disabled" />
          <ColorSwatch token="--text-inverse" label={t('معكوس', 'Inverse')} value="--text-inverse" />
        </div>
      </SubSection>

      <SubSection title={t('ألوان الحالة', 'Semantic Status Colors')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ColorSwatch token="--success" label={t('نجاح', 'Success')} value="--success" />
          <ColorSwatch token="--warning" label={t('تحذير', 'Warning')} value="--warning" />
          <ColorSwatch token="--error" label={t('خطأ', 'Error')} value="--error" />
          <ColorSwatch token="--info" label={t('معلومة', 'Info')} value="--info" />
        </div>
      </SubSection>

      <SubSection title={t('مستويات المخاطرة', 'Risk Level Colors')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ColorSwatch token="--risk-low" label={t('منخفض', 'Low')} value="--risk-low" />
          <ColorSwatch token="--risk-medium" label={t('متوسط', 'Medium')} value="--risk-medium" />
          <ColorSwatch token="--risk-high" label={t('مرتفع', 'High')} value="--risk-high" />
          <ColorSwatch token="--risk-critical" label={t('حرج', 'Critical')} value="--risk-critical" />
        </div>
      </SubSection>

      <SubSection title={t('مستويات التصنيف', 'Classification Colors')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ColorSwatch token="--class-public" label={t('عام', 'Public')} value="--class-public" />
          <ColorSwatch token="--class-internal" label={t('داخلي', 'Internal')} value="--class-internal" />
          <ColorSwatch token="--class-confidential" label={t('سري', 'Confidential')} value="--class-confidential" />
          <ColorSwatch token="--class-topsecret" label={t('سري للغاية', 'Top Secret')} value="--class-topsecret" />
        </div>
      </SubSection>

      <SubSection title={t('الطباعة', 'Typography Scale')}>
        <div className="space-y-3">
          {[
            { size: 'text-3xl font-bold', label: 'Display LG — 30px Bold', sample: t('عنوان رئيسي كبير', 'Large Display Heading') },
            { size: 'text-2xl font-bold', label: 'Display MD — 24px Bold', sample: t('عنوان رئيسي', 'Display Heading') },
            { size: 'text-xl font-semibold', label: 'Heading LG — 20px SemiBold', sample: t('عنوان صفحة', 'Page Heading') },
            { size: 'text-lg font-semibold', label: 'Heading MD — 18px SemiBold', sample: t('عنوان قسم', 'Section Heading') },
            { size: 'text-base font-semibold', label: 'Heading SM — 16px SemiBold', sample: t('عنوان فرعي', 'Sub Heading') },
            { size: 'text-base', label: 'Body LG — 16px Regular', sample: t('نص أساسي كبير', 'Large body text') },
            { size: 'text-sm', label: 'Body MD — 14px Regular', sample: t('نص أساسي', 'Body text') },
            { size: 'text-xs', label: 'Body SM / Caption — 12px', sample: t('نص صغير وتعليق', 'Small text and caption') },
            { size: 'text-xs font-mono', label: 'Mono — 12px JetBrains Mono', sample: 'REF-2024-00451 · rec_7f3a9b2c' },
          ].map((item, i) => (
            <div key={`typo-${i}`} className="flex items-baseline gap-4 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className={`${item.size} flex-1`} style={{ color: 'var(--text-primary)' }}>{item.sample}</span>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('الخطوط المحلية', 'Local Fonts')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Cairo — Arabic</div>
            <div className="text-base" style={{ fontFamily: 'var(--font-arabic)' }}>منصة عقل للمعرفة المؤسسية</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>400 · 500 · 600 · 700 — local woff2</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Inter — Latin</div>
            <div className="text-base" style={{ fontFamily: 'var(--font-latin)' }}>AQL Enterprise Platform</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>400 · 500 · 600 · 700 — local woff2</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>JetBrains Mono</div>
            <div className="text-sm font-mono" style={{ fontFamily: 'var(--font-mono)' }}>REF-2024-00451</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>400 — local woff2</div>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('المسافات', 'Spacing Scale')}>
        <div className="flex flex-wrap items-end gap-3">
          {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map(s => (
            <div key={`sp-${s}`} className="flex flex-col items-center gap-1">
              <div style={{ width: s, height: s, background: 'var(--accent-subtle)', border: '1px solid var(--accent-muted)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('الحواف', 'Border Radius')}>
        <div className="flex flex-wrap items-center gap-4">
          {[
            { label: 'sm — 4px', r: 4 },
            { label: 'md — 6px', r: 6 },
            { label: 'lg — 8px', r: 8 },
            { label: 'xl — 12px', r: 12 },
            { label: 'full', r: 9999 },
          ].map(item => (
            <div key={`r-${item.label}`} className="flex flex-col items-center gap-2">
              <div style={{ width: 48, height: 48, background: 'var(--accent-subtle)', border: '2px solid var(--accent-muted)', borderRadius: item.r }} />
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('الظلال', 'Shadows')}>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg" style={{ width: 80, height: 48, background: 'var(--surface)', boxShadow: 'var(--shadow-1)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>elevation-1</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg" style={{ width: 80, height: 48, background: 'var(--surface)', boxShadow: 'var(--shadow-2)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>elevation-2</span>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('حلقة التركيز', 'Focus Ring')}>
        <div className="flex gap-4 items-center">
          <button className="btn btn-primary btn-md" style={{ outline: '2px solid var(--accent)', outlineOffset: 2 }}>
            {t('حالة التركيز', 'Focus State')}
          </button>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>outline: 2px solid var(--accent); outline-offset: 2px</span>
        </div>
      </SubSection>

      <SubSection title={t('نقاط التوقف', 'Breakpoints')}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[['sm', '640px'], ['md', '768px'], ['lg', '1024px'], ['xl', '1280px'], ['2xl', '1536px']].map(([name, val]) => (
            <div key={`bp-${name}`} className="p-2 rounded text-center" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{val}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('مدد الحركة', 'Motion Durations')}>
        <div className="flex flex-wrap gap-4">
          {[['سريع / Fast', '150ms'], ['أساسي / Base', '200ms'], ['بطيء / Slow', '300ms']].map(([label, dur]) => (
            <div key={`dur-${dur}`} className="p-3 rounded-lg text-center" style={{ background: 'var(--background)', border: '1px solid var(--border)', minWidth: 100 }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--accent)' }}>{dur}</div>
            </div>
          ))}
        </div>
      </SubSection>
    </Card>
  </Section>
);

// ─── Section 2: Themes ────────────────────────────────────────────────────────
const ThemesSection = ({ t, theme, setTheme }: { t: (ar: string, en: string) => string; theme: string; setTheme: (t: 'light' | 'dark') => void }) => (
  <Section id="themes" title={t('٢ — المظاهر', '2 — Themes')} subtitle={t('Light وDark مع الحفاظ على التسلسل البصري', 'Light and Dark with preserved visual hierarchy')}>
    <Card>
      <div className="flex gap-3 mb-6">
        <button className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('light')}>
          ☀️ {t('فاتح', 'Light')}
        </button>
        <button className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('dark')}>
          🌙 {t('داكن', 'Dark')}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card sample */}
        <div className="card p-4">
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t('بطاقة عينة', 'Sample Card')}</div>
          <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t('نص وصفي داخل البطاقة', 'Descriptive text inside the card')}</div>
          <div className="flex gap-2">
            <StatusBadge status="approved" />
            <RiskBadge level="low" />
          </div>
        </div>
        {/* Input sample */}
        <div className="card p-4">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('اسم الحقل', 'Field Label')}</label>
          <input type="text" className="input-base" placeholder={t('أدخل القيمة...', 'Enter value...')} />
          <div className="flex gap-2 mt-3">
            <button className="btn btn-primary btn-sm">{t('حفظ', 'Save')}</button>
            <button className="btn btn-secondary btn-sm">{t('إلغاء', 'Cancel')}</button>
          </div>
        </div>
        {/* Table sample */}
        <div className="card overflow-hidden" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('العنوان', 'Title')}</th>
                <th>{t('الحالة', 'Status')}</th>
                <th>{t('المخاطرة', 'Risk')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: t('عنصر أول', 'First Item'), status: 'approved' as const, risk: 'low' as const },
                { title: t('عنصر ثانٍ', 'Second Item'), status: 'under_review' as const, risk: 'medium' as const },
                { title: t('عنصر ثالث', 'Third Item'), status: 'draft' as const, risk: 'high' as const },
              ].map((row, i) => (
                <tr key={`theme-row-${i}`} className="group">
                  <td className="text-sm">{row.title}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td><RiskBadge level={row.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Disabled / error states */}
        <div className="card p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('حقل معطل', 'Disabled Field')}</label>
            <input type="text" className="input-base" disabled placeholder={t('معطل', 'Disabled')} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('حقل خطأ', 'Error Field')}</label>
            <input type="text" className="input-base error" defaultValue={t('قيمة خاطئة', 'Invalid value')} aria-invalid="true" />
            <p className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>{t('رسالة الخطأ', 'Error message')}</p>
          </div>
          <button className="btn btn-primary btn-sm" disabled>{t('زر معطل', 'Disabled Button')}</button>
        </div>
      </div>
    </Card>
  </Section>
);

// ─── Section 3: Direction & Localization ─────────────────────────────────────
const DirectionSection = ({ t, lang, setLang }: { t: (ar: string, en: string) => string; lang: string; setLang: (l: 'ar' | 'en') => void }) => (
  <Section id="direction" title={t('٣ — الاتجاه والتوطين', '3 — Direction & Localization')} subtitle={t('RTL عربي وLTR إنجليزي مع CSS Logical Properties', 'Arabic RTL and English LTR with CSS logical properties')}>
    <Card>
      <div className="flex gap-3 mb-6">
        <button className={`btn btn-sm ${lang === 'ar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLang('ar')}>
          عربي RTL
        </button>
        <button className={`btn btn-sm ${lang === 'en' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLang('en')}>
          English LTR
        </button>
      </div>

      <SubSection title={t('اتجاه الشريط الجانبي والتنقل', 'Sidebar & Navigation Direction')}>
        <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded" style={{ width: 8, height: 8, background: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)' }}>{t('الشريط الجانبي يظهر على اليمين في RTL', 'Sidebar appears on the right in RTL')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded" style={{ width: 8, height: 8, background: 'var(--success)' }} />
            <span style={{ color: 'var(--text-primary)' }}>{t('يستخدم border-inline-end بدلاً من border-right', 'Uses border-inline-end instead of border-right')}</span>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('مسار التنقل', 'Breadcrumb Direction')}>
        <nav className="flex items-center gap-1 text-sm">
          {[t('الرئيسية', 'Home'), t('السجلات', 'Records'), t('تفاصيل السجل', 'Record Detail')].map((item, i, arr) => (
            <React.Fragment key={`dir-bc-${i}`}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</span>}
              <span style={{ color: i === arr.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === arr.length - 1 ? 500 : 400 }}>
                {item}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </SubSection>

      <SubSection title={t('محاذاة النموذج', 'Form Alignment')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('اسم الحقل', 'Field Label')}</label>
            <input type="text" className="input-base" placeholder={t('أدخل القيمة...', 'Enter value...')} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('حقل البحث', 'Search Field')}</label>
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute" style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" className="input-base" style={{ paddingInlineStart: 32 }} placeholder={t('بحث...', 'Search...')} />
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('محاذاة الجدول', 'Table Alignment')}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'start' }}>{t('العنوان', 'Title')}</th>
                <th style={{ textAlign: 'start' }}>{t('الحالة', 'Status')}</th>
                <th style={{ textAlign: 'start' }}>{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="group">
                <td className="text-sm">{t('عنصر تجريبي', 'Sample Item')}</td>
                <td><StatusBadge status="approved" /></td>
                <td>
                  <button className="btn btn-ghost btn-sm text-xs">{t('عرض', 'View')} →</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title={t('الدرج والحوار', 'Drawer & Dialog Direction')}>
        <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t(
              'الدرج يظهر من اليسار في RTL (ms-auto) ومن اليمين في LTR. يستخدم border-inline-start.',
              'Drawer appears from the left in RTL (ms-auto) and from the right in LTR. Uses border-inline-start.'
            )}
          </p>
        </div>
      </SubSection>

      <SubSection title={t('الترقيم', 'Pagination')}>
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('١–١٠ من ٤٧ / 1–10 of 47', '1–10 of 47')}
          </span>
          <div className="flex items-center gap-1">
            <button className="btn btn-ghost btn-sm" aria-label={t('السابق', 'Previous')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            {[1, 2, 3].map(p => (
              <button key={`dir-page-${p}`} className="btn btn-sm" style={{ background: p === 1 ? 'var(--accent)' : 'transparent', color: p === 1 ? 'var(--accent-foreground)' : 'var(--text-secondary)', border: 'none', minWidth: 32 }}>
                {p}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm" aria-label={t('التالي', 'Next')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </SubSection>
    </Card>
  </Section>
);

// ─── Section 4: App Shell ─────────────────────────────────────────────────────
const AppShellSection = ({ t }: { t: (ar: string, en: string) => string }) => (
  <Section id="app-shell" title={t('٤ — هيكل التطبيق', '4 — Application Shell')} subtitle={t('Sidebar وTopbar والتنقل — مستخرج من الشاشات المرجعية', 'Sidebar, Topbar, and Navigation — extracted from reference screens')}>
    <Card>
      <div className="p-3 rounded-lg mb-4 text-sm" style={{ background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}>
        {t(
          'هيكل التطبيق الفعلي يعمل في الشريط الجانبي الأيسر/الأيمن. هذا القسم يوثق الأنماط المستخرجة.',
          'The actual App Shell is running in the sidebar. This section documents the extracted patterns.'
        )}
      </div>

      <SubSection title={t('حالات الشريط الجانبي', 'Sidebar States')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expanded */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{t('موسّع — 240px', 'Expanded — 240px')}</div>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', width: 200 }}>
              <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="rounded" style={{ width: 24, height: 24, background: 'var(--accent-subtle)' }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>عقل</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-latin)' }}>AQL Platform</div>
                </div>
              </div>
              <div className="p-2" style={{ background: 'var(--surface)' }}>
                <div className="text-xs font-semibold uppercase mb-1 px-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('الرئيسية', 'Main')}</div>
                {[
                  { label: t('الرئيسية', 'Home'), active: true },
                  { label: t('السجلات', 'Records'), active: false },
                  { label: t('سير العمل', 'Workflows'), active: false },
                ].map((item, i) => (
                  <div key={`shell-nav-${i}`} className={`nav-item ${item.active ? 'active' : ''}`} style={{ fontSize: 12 }}>
                    <div className="rounded" style={{ width: 14, height: 14, background: item.active ? 'var(--accent)' : 'var(--text-muted)', opacity: 0.5 }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Collapsed */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{t('مطوي — 64px', 'Collapsed — 64px')}</div>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', width: 56 }}>
              <div className="flex items-center justify-center py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="rounded" style={{ width: 24, height: 24, background: 'var(--accent-subtle)' }} />
              </div>
              <div className="p-1" style={{ background: 'var(--surface)' }}>
                {[true, false, false].map((active, i) => (
                  <div key={`shell-col-${i}`} className={`nav-item ${active ? 'active' : ''} justify-center`} style={{ padding: '8px 0' }}>
                    <div className="rounded" style={{ width: 14, height: 14, background: active ? 'var(--accent)' : 'var(--text-muted)', opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('شريط العنوان العلوي', 'Topbar')}>
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4 px-4" style={{ height: 48, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <nav className="flex items-center gap-1 text-sm flex-1">
              {[t('الرئيسية', 'Home'), t('السجلات', 'Records')].map((item, i, arr) => (
                <React.Fragment key={`topbar-bc-${i}`}>
                  {i > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
                  <span style={{ color: i === arr.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === arr.length - 1 ? 500 : 400 }}>{item}</span>
                </React.Fragment>
              ))}
            </nav>
            <div className="flex items-center gap-2 px-3 rounded-md text-sm" style={{ height: 28, background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)', minWidth: 140 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span className="text-xs">{t('بحث...', 'Search...')}</span>
              <span className="ms-auto text-xs font-mono" style={{ color: 'var(--text-disabled)' }}>⌘K</span>
            </div>
            <button className="btn btn-ghost btn-sm relative" aria-label={t('الإشعارات', 'Notifications')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="absolute rounded-full" style={{ top: 4, insetInlineEnd: 4, width: 8, height: 8, background: 'var(--error)' }} aria-hidden="true" />
            </button>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('حالات التنقل', 'Navigation States')}>
        <div className="flex flex-wrap gap-2">
          {[
            { label: t('عادي', 'Default'), cls: 'nav-item' },
            { label: t('تحويم', 'Hover'), cls: 'nav-item', style: { background: 'var(--gray-100)', color: 'var(--text-primary)' } },
            { label: t('نشط', 'Active'), cls: 'nav-item active' },
          ].map((item, i) => (
            <div key={`nav-state-${i}`} className={item.cls} style={{ width: 140, ...(item.style || {}) }}>
              <div className="rounded" style={{ width: 14, height: 14, background: 'currentColor', opacity: 0.4 }} />
              {item.label}
            </div>
          ))}
        </div>
      </SubSection>
    </Card>
  </Section>
);

// ─── Section 5: Buttons ───────────────────────────────────────────────────────
const ButtonsSection = ({ t }: { t: (ar: string, en: string) => string }) => {
  const [loading, setLoading] = useState(false);
  const simulate = () => { setLoading(true); setTimeout(() => setLoading(false), 2000); };

  return (
    <Section id="buttons" title={t('٥ — الأزرار والإجراءات', '5 — Buttons & Actions')} subtitle={t('جميع أنواع وأحجام وحالات الأزرار', 'All button variants, sizes, and states')}>
      <Card>
        <SubSection title={t('الأنواع', 'Variants')}>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary btn-md">{t('إجراء رئيسي', 'Primary Action')}</button>
            <button className="btn btn-secondary btn-md">{t('إجراء ثانوي', 'Secondary Action')}</button>
            <button className="btn btn-ghost btn-md">{t('إجراء شفاف', 'Ghost Action')}</button>
            <button className="btn btn-destructive btn-md">{t('إجراء تدميري', 'Destructive Action')}</button>
          </div>
        </SubSection>

        <SubSection title={t('الأحجام', 'Sizes')}>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary btn-sm">{t('صغير', 'Small')}</button>
            <button className="btn btn-primary btn-md">{t('متوسط', 'Medium')}</button>
            <button className="btn btn-primary btn-lg">{t('كبير', 'Large')}</button>
          </div>
        </SubSection>

        <SubSection title={t('الحالات', 'States')}>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn btn-primary btn-md">{t('عادي', 'Normal')}</button>
            <button className="btn btn-primary btn-md" onClick={simulate} disabled={loading}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {t('جارٍ التحميل...', 'Loading...')}
                </>
              ) : t('انقر للتحميل', 'Click to Load')}
            </button>
            <button className="btn btn-primary btn-md" disabled>{t('معطل', 'Disabled')}</button>
            <button className="btn btn-primary btn-md" style={{ outline: '2px solid var(--accent)', outlineOffset: 2 }}>{t('تركيز', 'Focused')}</button>
          </div>
        </SubSection>

        <SubSection title={t('مع أيقونات', 'With Icons')}>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary btn-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              {t('إضافة جديد', 'Add New')}
            </button>
            <button className="btn btn-secondary btn-md">
              {t('تصدير', 'Export')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button className="btn btn-ghost btn-sm" aria-label={t('تعديل', 'Edit')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button className="btn btn-ghost btn-sm" aria-label={t('حذف', 'Delete')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </SubSection>

        <SubSection title={t('إجراءات شريط الأدوات', 'Toolbar Actions')}>
          <div className="flex items-center gap-1 p-2 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)', width: 'fit-content' }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: t('تعديل', 'Edit') },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, label: t('نسخ', 'Copy') },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>, label: t('حذف', 'Delete') },
            ].map((action, i) => (
              <button key={`toolbar-${i}`} className="btn btn-ghost btn-sm" aria-label={action.label} title={action.label}>
                {action.icon}
              </button>
            ))}
          </div>
        </SubSection>
      </Card>
    </Section>
  );
};

// ─── Section 6: Form Components ───────────────────────────────────────────────
const FormsSection = ({ t }: { t: (ar: string, en: string) => string }) => {
  const [switchVal, setSwitchVal] = useState(false);
  const [checkVal, setCheckVal] = useState(false);
  const [radioVal, setRadioVal] = useState('a');

  return (
    <Section id="forms" title={t('٦ — مكوّنات النماذج', '6 — Form Components')} subtitle={t('جميع حقول الإدخال وحالاتها', 'All input fields and their states')}>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('حقل نصي — عادي', 'Text Input — Normal')}
            </label>
            <input type="text" className="input-base" placeholder={t('أدخل النص هنا...', 'Enter text here...')} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('نص المساعدة الاختياري', 'Optional help text')}</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('حقل نصي — خطأ', 'Text Input — Error')}
              <span style={{ color: 'var(--error)', marginInlineStart: 2 }} aria-hidden="true">*</span>
            </label>
            <input type="text" className="input-base error" defaultValue={t('قيمة خاطئة', 'Invalid value')} aria-invalid="true" aria-describedby="form-err" />
            <p id="form-err" className="text-xs mt-1" role="alert" style={{ color: 'var(--error-text)' }}>{t('هذا الحقل مطلوب', 'This field is required')}</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('حقل نصي — معطل', 'Text Input — Disabled')}
            </label>
            <input type="text" className="input-base" placeholder={t('معطل', 'Disabled')} disabled />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('حقل للقراءة فقط', 'Read-only Field')}
            </label>
            <input type="text" className="input-base" value={t('قيمة للقراءة فقط', 'Read-only value')} readOnly style={{ background: 'var(--background)', cursor: 'default' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('قائمة منسدلة', 'Select')}
            </label>
            <select className="input-base">
              <option value="">{t('اختر خياراً...', 'Choose an option...')}</option>
              <option>{t('الخيار الأول', 'Option One')}</option>
              <option>{t('الخيار الثاني', 'Option Two')}</option>
              <option>{t('الخيار الثالث', 'Option Three')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('حقل البحث', 'Search Field')}
            </label>
            <div className="relative">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="absolute" style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" className="input-base" style={{ paddingInlineStart: 32 }} placeholder={t('بحث...', 'Search...')} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {t('منطقة نصية', 'Textarea')}
            </label>
            <textarea className="input-base" style={{ height: 80, resize: 'vertical' }} placeholder={t('نص طويل...', 'Long text...')} />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={checkVal} onChange={e => setCheckVal(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
              {t('خانة اختيار', 'Checkbox')}
            </label>
            <div className="flex gap-4">
              {['a', 'b'].map(v => (
                <label key={`form-radio-${v}`} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                  <input type="radio" name="form-radio" value={v} checked={radioVal === v} onChange={() => setRadioVal(v)} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
                  {t(`خيار ${v === 'a' ? 'أ' : 'ب'}`, `Option ${v.toUpperCase()}`)}
                </label>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                role="switch" aria-checked={switchVal} onClick={() => setSwitchVal(v => !v)}
                className="rounded-full transition-colors flex-shrink-0"
                style={{ width: 40, height: 22, background: switchVal ? 'var(--accent)' : 'var(--gray-300)', position: 'relative', border: 'none', cursor: 'pointer' }}
                aria-label={t('مفتاح تبديل', 'Toggle Switch')}
              >
                <span className="absolute rounded-full transition-all" style={{ width: 16, height: 16, background: '#fff', top: 3, insetInlineStart: switchVal ? 21 : 3 }} aria-hidden="true" />
              </button>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t('مفتاح تبديل', 'Toggle')} — {switchVal ? t('مفعل', 'On') : t('معطل', 'Off')}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <SubSection title={t('حالات التحقق', 'Validation States')}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t('صالح', 'Valid'), cls: '', borderColor: 'var(--success)', msg: t('القيمة صحيحة', 'Value is valid'), msgColor: 'var(--success-text)' },
                { label: t('تحذير', 'Warning'), cls: '', borderColor: 'var(--warning)', msg: t('تحقق من القيمة', 'Please verify the value'), msgColor: 'var(--warning-text)' },
                { label: t('خطأ', 'Error'), cls: 'error', borderColor: 'var(--error)', msg: t('القيمة غير صحيحة', 'Value is invalid'), msgColor: 'var(--error-text)' },
              ].map((item, i) => (
                <div key={`val-state-${i}`}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</label>
                  <input type="text" className={`input-base ${item.cls}`} style={{ borderColor: item.borderColor }} defaultValue={t('قيمة تجريبية', 'Sample value')} />
                  <p className="text-xs mt-1" style={{ color: item.msgColor }}>{item.msg}</p>
                </div>
              ))}
            </div>
          </SubSection>
        </div>
      </Card>
    </Section>
  );
};

// ─── Section 7: Data Display ──────────────────────────────────────────────────
const DataDisplaySection = ({ t }: { t: (ar: string, en: string) => string }) => (
  <Section id="data-display" title={t('٧ — عرض البيانات', '7 — Data Display')} subtitle={t('البطاقات والشارات والأحوال الخاصة', 'Cards, badges, and special states')}>
    <Card>
      <SubSection title={t('بطاقات الإحصاء', 'Stat Cards')}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: t('إجمالي السجلات', 'Total Records'), value: '1,247', desc: t('↑ 12% هذا الشهر', '↑ 12% this month'), trend: 'up' as const },
            { label: t('قيد المراجعة', 'Under Review'), value: '38', desc: t('↓ 5 من الأسبوع الماضي', '↓ 5 from last week'), trend: 'down' as const },
            { label: t('معتمدة', 'Approved'), value: '892', desc: t('→ لا تغيير', '→ No change'), trend: 'neutral' as const },
            { label: t('مرفوضة', 'Rejected'), value: '23', desc: t('↑ 3 هذا الأسبوع', '↑ 3 this week'), trend: 'up' as const },
          ].map((stat, i) => (
            <div key={`stat-${i}`} className="card p-4">
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: stat.trend === 'up' ? 'var(--success-text)' : stat.trend === 'down' ? 'var(--error-text)' : 'var(--text-muted)' }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('الشارات', 'Badges')}>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="draft" />
          <StatusBadge status="under_review" />
          <StatusBadge status="approved" />
          <StatusBadge status="rejected" />
          <StatusBadge status="archived" />
          <RiskBadge level="low" />
          <RiskBadge level="medium" />
          <RiskBadge level="high" />
          <RiskBadge level="critical" />
          <ClassificationBadge level="public" />
          <ClassificationBadge level="internal" />
          <ClassificationBadge level="confidential" />
          <ClassificationBadge level="top_secret" />
        </div>
      </SubSection>

      <SubSection title={t('الرمز الشخصي', 'Avatar')}>
        <div className="flex items-center gap-4">
          {[{ size: 24, fs: 10 }, { size: 32, fs: 12 }, { size: 40, fs: 14 }].map((s, i) => (
            <div key={`av-${i}`} className="flex flex-col items-center gap-1">
              <div className="rounded-full flex items-center justify-center font-bold" style={{ width: s.size, height: s.size, background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: s.fs }}>
                م
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{s.size}px</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('قائمة المفتاح-القيمة', 'Key-Value List')}>
        <div className="max-w-md">
          {[
            [t('نوع السجل', 'Record Type'), t('طلب إجازة', 'Leave Request')],
            [t('الرقم المرجعي', 'Reference Number'), 'REF-2024-00451'],
            [t('القسم', 'Department'), t('الموارد البشرية', 'Human Resources')],
            [t('تاريخ الإنشاء', 'Created At'), '2024-03-15'],
            [t('الحالة', 'Status'), <StatusBadge key="kv-status" status="approved" />],
          ].map(([label, value], i) => (
            <div key={`kv-${i}`} className="flex gap-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-xs w-32 flex-shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title={t('الحالات الخاصة', 'Special States')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Empty */}
          <div className="card p-4 flex flex-col items-center justify-center gap-2 text-center" style={{ minHeight: 120 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }} aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('لا توجد بيانات', 'No Data')}</div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('لم يتم العثور على عناصر', 'No items found')}</p>
          </div>
          {/* Skeleton */}
          <div className="card p-4 space-y-2">
            <div className="skeleton" style={{ height: 16, width: '80%' }} />
            <div className="skeleton" style={{ height: 12, width: '60%' }} />
            <div className="skeleton" style={{ height: 12, width: '70%' }} />
            <div className="skeleton" style={{ height: 24, width: '40%' }} />
          </div>
          {/* Error */}
          <div className="card p-4 flex flex-col items-center justify-center gap-2 text-center" style={{ minHeight: 120 }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {t('حدث خطأ', 'An error occurred')}
            </div>
            <button className="btn btn-secondary btn-sm text-xs">{t('إعادة المحاولة', 'Retry')}</button>
          </div>
        </div>
      </SubSection>

      <SubSection title={t('القيمة المخفية', 'Masked Value')}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em' }}>••••••••</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('قيمة مخفية', 'Masked value')}</span>
        </div>
      </SubSection>
    </Card>
  </Section>
);

// ─── Section 8: Tables ────────────────────────────────────────────────────────
const TablesSection = ({ t }: { t: (ar: string, en: string) => string }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const rows = [
    { id: 1, title: t('عنصر أول', 'First Item'), ref: 'REF-001', status: 'approved' as const, risk: 'low' as const, dept: t('الموارد البشرية', 'HR') },
    { id: 2, title: t('عنصر ثانٍ', 'Second Item'), ref: 'REF-002', status: 'under_review' as const, risk: 'medium' as const, dept: t('المالية', 'Finance') },
    { id: 3, title: t('عنصر ثالث', 'Third Item'), ref: 'REF-003', status: 'draft' as const, risk: 'high' as const, dept: t('التقنية', 'IT') },
    { id: 4, title: t('عنصر رابع', 'Fourth Item'), ref: 'REF-004', status: 'rejected' as const, risk: 'critical' as const, dept: t('القانونية', 'Legal') },
    { id: 5, title: t('عنصر خامس', 'Fifth Item'), ref: 'REF-005', status: 'archived' as const, risk: 'low' as const, dept: t('الإدارة', 'Admin') },
  ];

  const toggleSelect = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === rows.length ? [] : rows.map(r => r.id));
  const handleSort = (col: string) => { if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortCol(col); setSortDir('asc'); } };

  return (
    <Section id="tables" title={t('٨ — الجداول', '8 — Tables')} subtitle={t('جدول مؤسسي كامل مع جميع الميزات', 'Full enterprise table with all features')}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="relative flex-1 min-w-40 max-w-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="absolute" style={{ top: '50%', transform: 'translateY(-50%)', insetInlineStart: 10, color: 'var(--text-muted)', pointerEvents: 'none' }} aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" className="input-base" style={{ paddingInlineStart: 32 }} placeholder={t('بحث...', 'Search...')} />
          </div>
          <select className="input-base" style={{ width: 'auto', minWidth: 120 }}>
            <option value="">{t('كل الحالات', 'All Statuses')}</option>
            <option>{t('معتمد', 'Approved')}</option>
            <option>{t('مسودة', 'Draft')}</option>
          </select>
          <button className="btn btn-primary btn-sm ms-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            {t('إضافة', 'Add')}
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2" style={{ background: 'var(--accent-subtle)', borderBottom: '1px solid var(--accent-muted)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{selected.length} {t('محدد', 'selected')}</span>
            <div className="flex gap-2 ms-auto">
              <button className="btn btn-secondary btn-sm text-xs">{t('تصدير', 'Export')}</button>
              <button className="btn btn-destructive btn-sm text-xs">{t('حذف', 'Delete')}</button>
              <button className="btn btn-ghost btn-sm text-xs" onClick={() => setSelected([])}>{t('إلغاء', 'Clear')}</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={selected.length === rows.length} onChange={toggleAll} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} aria-label={t('تحديد الكل', 'Select all')} />
                </th>
                {[
                  { id: 'title', label: t('العنوان', 'Title') },
                  { id: 'ref', label: t('الرقم المرجعي', 'Reference') },
                  { id: 'status', label: t('الحالة', 'Status') },
                  { id: 'risk', label: t('المخاطرة', 'Risk') },
                  { id: 'dept', label: t('القسم', 'Department') },
                ].map(col => (
                  <th key={`th-${col.id}`} style={{ cursor: 'pointer' }} onClick={() => handleSort(col.id)}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortCol === col.id && <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                    </div>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={`trow-${row.id}`} className={`group ${selected.includes(row.id) ? 'selected' : ''}`}>
                  <td>
                    <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} style={{ accentColor: 'var(--accent)', width: 14, height: 14 }} aria-label={`${t('تحديد', 'Select')} ${row.title}`} />
                  </td>
                  <td className="text-sm font-medium" style={{ color: 'var(--accent)', cursor: 'pointer' }}>{row.title}</td>
                  <td><span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{row.ref}</span></td>
                  <td><StatusBadge status={row.status} /></td>
                  <td><RiskBadge level={row.risk} /></td>
                  <td className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.dept}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label={t('عرض', 'View')}>
                      {t('عرض', 'View')} →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-4 px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t(`${(page - 1) * 5 + 1}–${page * 5} من 47`, `${(page - 1) * 5 + 1}–${page * 5} of 47`)}
          </span>
          <div className="flex items-center gap-1">
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} aria-label={t('السابق', 'Previous')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            {[1, 2, 3].map(p => (
              <button key={`tpg-${p}`} className="btn btn-sm" style={{ background: p === page ? 'var(--accent)' : 'transparent', color: p === page ? 'var(--accent-foreground)' : 'var(--text-secondary)', border: 'none', minWidth: 32 }} onClick={() => setPage(p)} aria-current={p === page ? 'page' : undefined}>
                {p}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(3, p + 1))} disabled={page >= 3} aria-label={t('التالي', 'Next')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ─── Section 9: Overlays ──────────────────────────────────────────────────────
const OverlaysSection = ({ t, lang }: { t: (ar: string, en: string) => string; lang: 'ar' | 'en' }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDestructive, setShowDestructive] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showTooltip] = useState(false);

  return (
    <Section id="overlays" title={t('٩ — الطبقات والأسطح', '9 — Overlays & Surfaces')} subtitle={t('الحوارات والأدراج والإشعارات', 'Dialogs, drawers, and notifications')}>
      <Card>
        <SubSection title={t('الحوارات', 'Dialogs')}>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-secondary btn-md" onClick={() => setShowDialog(true)}>
              {t('فتح حوار', 'Open Dialog')}
            </button>
            <button className="btn btn-destructive btn-md" onClick={() => setShowDestructive(true)}>
              {t('حوار تأكيد الحذف', 'Destructive Confirm')}
            </button>
            <button className="btn btn-secondary btn-md" onClick={() => setShowDrawer(true)}>
              {t('فتح درج', 'Open Drawer')}
            </button>
          </div>
        </SubSection>

        <SubSection title={t('الإشعارات', 'Toasts')}>
          <div className="flex flex-wrap gap-3">
            {(['success', 'error', 'warning', 'info'] as const).map(v => (
              <button key={`toast-${v}`} className="btn btn-secondary btn-sm" onClick={() => setShowToast(v)}>
                {v === 'success' ? t('نجاح', 'Success') : v === 'error' ? t('خطأ', 'Error') : v === 'warning' ? t('تحذير', 'Warning') : t('معلومة', 'Info')}
              </button>
            ))}
          </div>
          {showToast && (
            <div className="mt-3">
              {(() => {
                const styles: Record<string, React.CSSProperties> = {
                  success: { background: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' },
                  error: { background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' },
                  warning: { background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' },
                  info: { background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' },
                };
                const msgs: Record<string, string> = {
                  success: t('تمت العملية بنجاح', 'Operation completed successfully'),
                  error: t('حدث خطأ أثناء التنفيذ', 'An error occurred during execution'),
                  warning: t('يرجى مراجعة البيانات', 'Please review the data'),
                  info: t('معلومة للمستخدم', 'Information for the user'),
                };
                return (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm" style={{ ...styles[showToast], maxWidth: 400 }} role="alert">
                    <span className="flex-1">{msgs[showToast]}</span>
                    <button onClick={() => setShowToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7 }} aria-label={t('إغلاق', 'Close')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </SubSection>

        <SubSection title={t('التلميح', 'Tooltip')}>
          <div className="relative inline-flex group">
            <button className="btn btn-secondary btn-sm">{t('تحويم للتلميح', 'Hover for Tooltip')}</button>
            <div className="absolute z-50 px-2 py-1 text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              style={{ background: 'var(--gray-900)', color: 'var(--gray-50)', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 4 }}
              role="tooltip">
              {t('نص التلميح', 'Tooltip text')}
            </div>
          </div>
        </SubSection>
      </Card>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={e => { if (e.target === e.currentTarget) setShowDialog(false); }}>
          <div className="card w-full flex flex-col" style={{ maxWidth: 520, maxHeight: '90vh', outline: 'none' }}>
            <div className="flex items-start justify-between gap-3 p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 id="dlg-title" className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{t('عنوان الحوار', 'Dialog Title')}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('وصف الحوار وتفاصيله', 'Dialog description and details')}</p>
              </div>
              <button onClick={() => setShowDialog(false)} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-5">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('اسم الحقل', 'Field Label')}</label>
              <input type="text" className="input-base" placeholder={t('أدخل القيمة...', 'Enter value...')} />
            </div>
            <div className="flex items-center justify-end gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDialog(false)}>{t('إلغاء', 'Cancel')}</button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowDialog(false)}>{t('حفظ', 'Save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Destructive Confirm */}
      {showDestructive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} role="dialog" aria-modal="true" aria-labelledby="dest-title" onClick={e => { if (e.target === e.currentTarget) setShowDestructive(false); }}>
          <div className="card w-full flex flex-col" style={{ maxWidth: 400 }}>
            <div className="flex items-start justify-between gap-3 p-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 id="dest-title" className="font-semibold text-base" style={{ color: 'var(--error-text)' }}>{t('تأكيد الحذف', 'Confirm Deletion')}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('هذا الإجراء لا يمكن التراجع عنه', 'This action cannot be undone')}</p>
              </div>
              <button onClick={() => setShowDestructive(false)} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDestructive(false)}>{t('إلغاء', 'Cancel')}</button>
              <button className="btn btn-destructive btn-sm" onClick={() => setShowDestructive(false)}>{t('حذف', 'Delete')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,0.3)' }} role="dialog" aria-modal="true" aria-labelledby="drawer-title" onClick={e => { if (e.target === e.currentTarget) setShowDrawer(false); }}>
          <div className="ms-auto flex flex-col" style={{ width: '100%', maxWidth: 420, height: '100%', background: 'var(--surface)', borderInlineStart: '1px solid var(--border)', overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 id="drawer-title" className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('عنوان الدرج', 'Drawer Title')}</h2>
              <button onClick={() => setShowDrawer(false)} className="btn btn-ghost btn-sm" aria-label={t('إغلاق', 'Close')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <div className="space-y-4">
                {[t('اسم الحقل الأول', 'First Field'), t('اسم الحقل الثاني', 'Second Field')].map((label, i) => (
                  <div key={`drawer-field-${i}`}>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <input type="text" className="input-base" placeholder={t('أدخل القيمة...', 'Enter value...')} />
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 mt-3">
                  <StatusBadge status="approved" />
                  <RiskBadge level="low" />
                  <ClassificationBadge level="internal" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-primary btn-sm flex-1" onClick={() => setShowDrawer(false)}>{t('حفظ', 'Save')}</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowDrawer(false)}>{t('إلغاء', 'Cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

// ─── Section 10: Navigation Patterns ─────────────────────────────────────────
const NavigationSection = ({ t }: { t: (ar: string, en: string) => string }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  return (
    <Section id="navigation" title={t('١٠ — أنماط التنقل والتفاعل', '10 — Navigation & Interaction Patterns')} subtitle={t('التبويبات والمسارات والفلاتر والإجراءات الجماعية', 'Tabs, breadcrumbs, filters, and bulk actions')}>
      <Card>
        <SubSection title={t('التبويبات', 'Tabs')}>
          <div style={{ borderBottom: '1px solid var(--border)' }} role="tablist">
            <div className="flex gap-0">
              {[
                { id: 'all', label: t('الكل', 'All'), count: 47 },
                { id: 'active', label: t('نشط', 'Active'), count: 12 },
                { id: 'archived', label: t('مؤرشف', 'Archived'), count: 8 },
              ].map(tab => (
                <button
                  key={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: -1,
                    borderBottomWidth: 2,
                    borderBottomStyle: 'solid',
                    borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  }}
                >
                  {tab.label}
                  <span className="badge text-xs" style={{ background: activeTab === tab.id ? 'var(--accent-subtle)' : 'var(--gray-100)', color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 mt-2 rounded-lg text-sm" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
            {t(`محتوى تبويب: ${activeTab}`, `Tab content: ${activeTab}`)}
          </div>
        </SubSection>

        <SubSection title={t('شريط الإجراءات الجماعية', 'Bulk Action Bar')}>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-muted)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>3 {t('محدد', 'selected')}</span>
            <div className="flex gap-2 ms-auto">
              <button className="btn btn-secondary btn-sm text-xs">{t('تصدير', 'Export')}</button>
              <button className="btn btn-destructive btn-sm text-xs">{t('حذف', 'Delete')}</button>
              <button className="btn btn-ghost btn-sm text-xs">{t('إلغاء', 'Clear')}</button>
            </div>
          </div>
        </SubSection>

        <SubSection title={t('الإفصاح التدريجي', 'Progressive Disclosure')}>
          <div className="card overflow-hidden">
            <button
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium"
              style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: disclosureOpen ? '1px solid var(--border)' : 'none' }}
              onClick={() => setDisclosureOpen(o => !o)}
              aria-expanded={disclosureOpen}
            >
              {t('إعدادات متقدمة', 'Advanced Settings')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: disclosureOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }} aria-hidden="true">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {disclosureOpen && (
              <div className="p-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('محتوى الإعدادات المتقدمة', 'Advanced settings content')}</p>
              </div>
            )}
          </div>
        </SubSection>

        <SubSection title={t('نمط الحفظ والإغلاق', 'Save & Close Pattern')}>
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm">{t('إلغاء', 'Cancel')}</button>
            <div className="ms-auto flex gap-2">
              <button className="btn btn-secondary btn-sm">{t('حفظ كمسودة', 'Save as Draft')}</button>
              <button className="btn btn-primary btn-sm">{t('حفظ وإغلاق', 'Save & Close')}</button>
            </div>
          </div>
        </SubSection>

        <SubSection title={t('قائمة السياق', 'Context Menu')}>
          <div className="inline-block rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-2)', minWidth: 180 }}>
            {[
              { label: t('عرض التفاصيل', 'View Details'), icon: '👁' },
              { label: t('تعديل', 'Edit'), icon: '✏️' },
              { label: t('نسخ', 'Duplicate'), icon: '📋' },
              { label: '—', icon: '' },
              { label: t('حذف', 'Delete'), icon: '🗑', destructive: true },
            ].map((item, i) => item.label === '—' ? (
              <div key={`ctx-sep-${i}`} style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
            ) : (
              <button key={`ctx-${i}`} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-start transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.destructive ? 'var(--error-text)' : 'var(--text-primary)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = item.destructive ? 'var(--error-bg)' : 'var(--background)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </SubSection>
      </Card>
    </Section>
  );
};

// ─── Section 11: Screen Archetypes ────────────────────────────────────────────
const ArchetypesSection = ({ t }: { t: (ar: string, en: string) => string }) => (
  <Section id="archetypes" title={t('١١ — نماذج الشاشات', '11 — Screen Archetype Samples')} subtitle={t('نماذج مصغرة غير وظيفية تستخدم نفس الـTokens والمكوّنات', 'Non-functional miniature samples using the same tokens and components')}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dashboard */}
      <div>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('لوحة التحكم', 'Dashboard')}</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('عنوان الصفحة', 'Page Title')}</div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: t('إجمالي', 'Total'), value: '1,247' },
                { label: t('نشط', 'Active'), value: '892' },
                { label: t('معلق', 'Pending'), value: '38' },
                { label: t('مكتمل', 'Done'), value: '317' },
              ].map((s, i) => (
                <div key={`arch-stat-${i}`} className="card p-3">
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                  <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-3" style={{ background: 'var(--background)', border: '1px solid var(--border)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('منطقة الرسم البياني', 'Chart Area')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('قائمة', 'List')}</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('عنوان القائمة', 'List Title')}</div>
            <button className="btn btn-primary btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              {t('إضافة', 'Add')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('العنوان', 'Title')}</th>
                  <th>{t('الحالة', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { title: t('عنصر أول', 'First Item'), status: 'approved' as const },
                  { title: t('عنصر ثانٍ', 'Second Item'), status: 'under_review' as const },
                  { title: t('عنصر ثالث', 'Third Item'), status: 'draft' as const },
                ].map((row, i) => (
                  <tr key={`arch-list-${i}`} className="group">
                    <td className="text-sm">{row.title}</td>
                    <td><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('تفاصيل', 'Detail')}</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('عنوان السجل', 'Record Title')}</div>
            <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>REF-2024-00451</div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status="approved" />
              <RiskBadge level="low" />
              <ClassificationBadge level="internal" />
            </div>
            {[
              [t('نوع السجل', 'Record Type'), t('طلب إجازة', 'Leave Request')],
              [t('القسم', 'Department'), t('الموارد البشرية', 'HR')],
              [t('تاريخ الإنشاء', 'Created At'), '2024-03-15'],
            ].map(([label, value], i) => (
              <div key={`arch-detail-${i}`} className="flex gap-3 py-1.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-xs w-28 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('نموذج', 'Form')}</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('إجراء رئيسي', 'Primary Action')}</div>
          </div>
          <div className="p-4 space-y-3">
            {[t('اسم الحقل الأول', 'First Field'), t('اسم الحقل الثاني', 'Second Field')].map((label, i) => (
              <div key={`arch-form-${i}`}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                <input type="text" className="input-base" placeholder={t('أدخل القيمة...', 'Enter value...')} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{t('الحالة', 'Status')}</label>
              <select className="input-base">
                <option>{t('اختر...', 'Choose...')}</option>
                <option>{t('معتمد', 'Approved')}</option>
                <option>{t('مسودة', 'Draft')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-primary btn-sm flex-1">{t('حفظ', 'Save')}</button>
            <button className="btn btn-secondary btn-sm">{t('إلغاء', 'Cancel')}</button>
          </div>
        </div>
      </div>

      {/* Builder / Canvas */}
      <div className="lg:col-span-2">
        <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{t('منشئ / لوحة', 'Builder / Canvas')}</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t('منشئ المسارات', 'Workflow Builder')}</div>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm">{t('معاينة', 'Preview')}</button>
              <button className="btn btn-primary btn-sm">{t('نشر', 'Publish')}</button>
            </div>
          </div>
          <div className="flex" style={{ height: 160 }}>
            <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--background)', borderInlineEnd: '1px solid var(--border)' }}>
              <div className="flex items-center gap-8">
                {[
                  { label: t('بداية', 'Start'), color: 'var(--success)' },
                  { label: t('مهمة', 'Task'), color: 'var(--accent)' },
                  { label: t('نهاية', 'End'), color: 'var(--error)' },
                ].map((node, i) => (
                  <React.Fragment key={`arch-node-${i}`}>
                    {i > 0 && <div style={{ width: 32, height: 1, background: 'var(--border-strong)' }} aria-hidden="true" />}
                    <div className="wf-node text-center" style={{ borderColor: node.color, minWidth: 80 }}>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{node.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-3" style={{ width: 140, background: 'var(--surface)' }}>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{t('الخصائص', 'Properties')}</div>
              <div className="skeleton" style={{ height: 12, width: '80%' }} />
              <div className="skeleton" style={{ height: 12, width: '60%' }} />
              <div className="skeleton" style={{ height: 28, width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

// ─── Table of Contents ────────────────────────────────────────────────────────
const TOC = ({ t, activeSection }: { t: (ar: string, en: string) => string; activeSection: string }) => {
  const sections = [
    { id: 'foundations', label: t('١ — الأسس', '1 — Foundations') },
    { id: 'themes', label: t('٢ — المظاهر', '2 — Themes') },
    { id: 'direction', label: t('٣ — الاتجاه', '3 — Direction') },
    { id: 'app-shell', label: t('٤ — هيكل التطبيق', '4 — App Shell') },
    { id: 'buttons', label: t('٥ — الأزرار', '5 — Buttons') },
    { id: 'forms', label: t('٦ — النماذج', '6 — Forms') },
    { id: 'data-display', label: t('٧ — عرض البيانات', '7 — Data Display') },
    { id: 'tables', label: t('٨ — الجداول', '8 — Tables') },
    { id: 'overlays', label: t('٩ — الطبقات', '9 — Overlays') },
    { id: 'navigation', label: t('١٠ — التنقل', '10 — Navigation') },
    { id: 'archetypes', label: t('١١ — نماذج الشاشات', '11 — Archetypes') },
  ];

  return (
    <nav className="hidden lg:block sticky top-4" style={{ width: 220, flexShrink: 0 }} aria-label={t('فهرس المحتوى', 'Table of Contents')}>
      <div className="card p-3">
        <div className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {t('المحتويات', 'Contents')}
        </div>
        <div className="space-y-0.5">
          {sections.map(s => (
            <a
              key={`toc-${s.id}`}
              href={`#${s.id}`}
              className="block text-xs px-2 py-1.5 rounded transition-colors"
              style={{
                color: activeSection === s.id ? 'var(--accent)' : 'var(--text-secondary)',
                background: activeSection === s.id ? 'var(--accent-subtle)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
function UIReferenceContent() {
  const { t, lang, setLang, theme, setTheme } = useApp();
  const [activeSection, setActiveSection] = useState('foundations');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t('مرجع واجهة المستخدم المؤسسية', 'Enterprise UI Reference Showcase')}
              </h1>
              <span className="badge text-xs" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}>
                {t('مرشح — غير معتمد', 'CANDIDATE — NOT APPROVED')}
              </span>
            </div>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              VISUAL BASELINE CANDIDATE — NOT GOVERNING — NOT YET APPROVED · OFFLINE DESIGN TARGET — VERIFICATION PENDING
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className={`btn btn-sm ${lang === 'ar' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLang('ar')}>عربي</button>
            <button className={`btn btn-sm ${lang === 'en' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLang('en')}>English</button>
            <button className={`btn btn-sm ${theme === 'light' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? t('داكن', 'Dark') : t('فاتح', 'Light')}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="flex gap-6 px-6 py-6 max-w-screen-xl mx-auto">
          {/* TOC */}
          <TOC t={t} activeSection={activeSection} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <FoundationsSection t={t} />
            <ThemesSection t={t} theme={theme} setTheme={setTheme} />
            <DirectionSection t={t} lang={lang} setLang={setLang} />
            <AppShellSection t={t} />
            <ButtonsSection t={t} />
            <FormsSection t={t} />
            <DataDisplaySection t={t} />
            <TablesSection t={t} />
            <OverlaysSection t={t} lang={lang} />
            <NavigationSection t={t} />
            <ArchetypesSection t={t} />

            {/* Footer */}
            <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                STOP — The Enterprise UI Reference Showcase has been created as a visual-baseline candidate only.
                No governing approval, visual-baseline approval, production rollout, business-feature implementation,
                main-branch merge, tag, or release has occurred.
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {t('المصدر: src/design-system/ · المسار: /ui-reference', 'Source: src/design-system/ · Route: /ui-reference')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UIReferencePage() {
  return (
    <AppShell breadcrumbs={[{ label: 'مرجع التصميم / UI Reference' }]}>
      <UIReferenceContent />
    </AppShell>
  );
}
