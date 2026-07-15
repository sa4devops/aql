'use client';
import React, { useState, useEffect } from 'react';
import AppShell, { useApp } from '@/components/AppShell';
import { StatusBadge, RiskBadge, ClassificationBadge } from '@/components/StatusBadge';

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const ShowcaseSection = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <div className="mb-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {subtitle && <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    <div className="card p-5">
      {children}
    </div>
  </section>
);

// ─── Color Swatch ─────────────────────────────────────────────────────────────
const ColorSwatch = ({ name, value, textColor = '#fff' }: { name: string; value: string; textColor?: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="rounded-md w-full"
      style={{ height: 48, background: value, border: '1px solid rgba(0,0,0,0.08)' }}
      title={value}
      aria-label={`${name}: ${value}`}
    />
    <div className="text-xs text-center font-medium" style={{ color: 'var(--text-secondary)' }}>{name}</div>
    <div className="text-xs text-center font-mono" style={{ color: 'var(--text-muted)' }}>{value}</div>
  </div>
);

// ─── Token Row ────────────────────────────────────────────────────────────────
const TokenRow = ({ token, value, description }: { token: string; value: string; description: string }) => (
  <div
    className="flex items-center gap-4 py-2"
    style={{ borderBottom: '1px solid var(--border-subtle)' }}
  >
    <code className="text-xs font-mono w-48 flex-shrink-0" style={{ color: 'var(--accent)' }}>{token}</code>
    <div
      className="rounded flex-shrink-0"
      style={{ width: 24, height: 24, background: `var(${token})`, border: '1px solid var(--border)' }}
    />
    <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--text-muted)', width: 80 }}>{value}</span>
    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{description}</span>
  </div>
);

// ─── Interactive Button Demo ──────────────────────────────────────────────────
const ButtonDemo = ({ t, lang }: { t: (ar: string, en: string) => string; lang: 'ar' | 'en' }) => {
  const [loading, setLoading] = useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t('الأنواع', 'Types')}
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary btn-md">{t('أساسي', 'Primary')}</button>
          <button className="btn btn-secondary btn-md">{t('ثانوي', 'Secondary')}</button>
          <button className="btn btn-ghost btn-md">{t('شفاف', 'Ghost')}</button>
          <button className="btn btn-destructive btn-md">{t('تدميري', 'Destructive')}</button>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t('الأحجام', 'Sizes')}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary btn-sm">{t('صغير', 'Small')}</button>
          <button className="btn btn-primary btn-md">{t('متوسط', 'Medium')}</button>
          <button className="btn btn-primary btn-lg">{t('كبير', 'Large')}</button>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t('الحالات', 'States')}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary btn-md">{t('عادي', 'Normal')}</button>
          <button className="btn btn-primary btn-md" onClick={simulateLoad} disabled={loading}>
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                {t('جارٍ التحميل...', 'Loading...')}
              </>
            ) : t('انقر للتحميل', 'Click to Load')}
          </button>
          <button className="btn btn-primary btn-md" disabled>{t('معطل', 'Disabled')}</button>
        </div>
      </div>
    </div>
  );
};

// ─── Input Demo ───────────────────────────────────────────────────────────────
const InputDemo = ({ t }: { t: (ar: string, en: string) => string }) => {
  const [textVal, setTextVal] = useState('');
  const [switchVal, setSwitchVal] = useState(false);
  const [checkVal, setCheckVal] = useState(false);
  const [radioVal, setRadioVal] = useState('a');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('حقل نصي — طبيعي', 'Text Input — Normal')}
        </label>
        <input
          type="text"
          className="input-base"
          placeholder={t('أدخل النص هنا...', 'Enter text here...')}
          value={textVal}
          onChange={e => setTextVal(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('حقل نصي — خطأ', 'Text Input — Error')}
        </label>
        <input
          type="text"
          className="input-base error"
          placeholder={t('قيمة خاطئة...', 'Invalid value...')}
          defaultValue={t('قيمة خاطئة', 'Invalid value')}
          aria-invalid="true"
          aria-describedby="input-error-msg"
        />
        <p id="input-error-msg" className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>
          {t('هذا الحقل يحتوي على خطأ', 'This field contains an error')}
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('حقل نصي — معطل', 'Text Input — Disabled')}
        </label>
        <input
          type="text"
          className="input-base"
          placeholder={t('معطل', 'Disabled')}
          disabled
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('قائمة منسدلة', 'Select')}
        </label>
        <select className="input-base">
          <option>{t('اختر خياراً...', 'Choose an option...')}</option>
          <option>{t('الخيار الأول', 'Option One')}</option>
          <option>{t('الخيار الثاني', 'Option Two')}</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          {t('منطقة نصية', 'Textarea')}
        </label>
        <textarea
          className="input-base"
          style={{ height: 72, resize: 'vertical' }}
          placeholder={t('نص طويل...', 'Long text...')}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showcase-check"
            checked={checkVal}
            onChange={e => setCheckVal(e.target.checked)}
            style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
          />
          <label htmlFor="showcase-check" className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {t('خانة اختيار', 'Checkbox')}
          </label>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            {['a', 'b'].map(v => (
              <label key={`radio-${v}`} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                <input
                  type="radio"
                  name="showcase-radio"
                  value={v}
                  checked={radioVal === v}
                  onChange={() => setRadioVal(v)}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                />
                {t(`خيار ${v === 'a' ? 'أ' : 'ب'}`, `Option ${v.toUpperCase()}`)}
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            role="switch"
            aria-checked={switchVal}
            onClick={() => setSwitchVal(v => !v)}
            className="rounded-full transition-colors flex-shrink-0"
            style={{
              width: 40, height: 22,
              background: switchVal ? 'var(--accent)' : 'var(--gray-300)',
              position: 'relative', border: 'none', cursor: 'pointer',
            }}
            aria-label={t('مفتاح تبديل', 'Toggle Switch')}
          >
            <span
              className="absolute rounded-full transition-all"
              style={{ width: 16, height: 16, background: '#fff', top: 3, insetInlineStart: switchVal ? 21 : 3 }}
            />
          </button>
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {t('مفتاح تبديل', 'Toggle Switch')} — {switchVal ? t('مفعل', 'On') : t('معطل', 'Off')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Dialog Demo ──────────────────────────────────────────────────────────────
const DialogDemo = ({ t, lang }: { t: (ar: string, en: string) => string; lang: 'ar' | 'en' }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <button className="btn btn-secondary btn-md" onClick={() => setShowDialog(true)}>
        {t('فتح حوار', 'Open Dialog')}
      </button>
      <button className="btn btn-secondary btn-md" onClick={() => setShowDrawer(true)}>
        {t('فتح درج', 'Open Drawer')}
      </button>
      <button
        className="btn btn-secondary btn-md"
        onClick={() => { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }}
      >
        {t('إظهار إشعار', 'Show Toast')}
      </button>

      {/* Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          role="dialog"
          aria-modal="true"
          onClick={e => { if (e.target === e.currentTarget) setShowDialog(false); }}
        >
          <div
            className="rounded-xl p-6 flex flex-col gap-4"
            style={{ width: 400, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-2)' }}
          >
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('تأكيد الإجراء', 'Confirm Action')}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('هل أنت متأكد من تنفيذ هذا الإجراء؟ لا يمكن التراجع عنه.', 'Are you sure you want to perform this action? This cannot be undone.')}
            </p>
            <div className="flex gap-2 justify-end">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowDialog(false)}>
                {t('إلغاء', 'Cancel')}
              </button>
              <button className="btn btn-destructive btn-sm" onClick={() => setShowDialog(false)}>
                {t('تأكيد', 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowDrawer(false); }}
        >
          <div
            className="ms-auto flex flex-col p-5"
            style={{ width: 320, height: '100%', background: 'var(--surface)', borderInlineStart: '1px solid var(--border)' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('درج جانبي', 'Side Drawer')}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDrawer(false)} aria-label={t('إغلاق', 'Close')}>×</button>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('هذا مثال على درج جانبي مع دعم Esc وإدارة التركيز.', 'This is an example side drawer with Esc support and focus management.')}
            </p>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className="fixed z-50 rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
          style={{
            bottom: 24,
            insetInlineEnd: 80,
            background: 'var(--gray-900)',
            color: '#fff',
            boxShadow: 'var(--shadow-2)',
            minWidth: 280,
          }}
          role="alert"
          aria-live="polite"
        >
          <span style={{ color: '#22C55E' }}>✓</span>
          {t('تم تنفيذ الإجراء بنجاح', 'Action completed successfully')}
        </div>
      )}
    </div>
  );
};

// ─── State Cards Demo ─────────────────────────────────────────────────────────
const StateCardsDemo = ({ t }: { t: (ar: string, en: string) => string }) => {
  const states = [
    {
      name: t('تحميل', 'Loading'),
      content: (
        <div className="space-y-2">
          <div className="skeleton" style={{ height: 16, width: '70%' }} />
          <div className="skeleton" style={{ height: 12, width: '90%' }} />
          <div className="skeleton" style={{ height: 12, width: '60%' }} />
        </div>
      ),
    },
    {
      name: t('فارغ', 'Empty'),
      content: (
        <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
            <rect width="18" height="18" x="3" y="3" rx="2"/>
          </svg>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('لا توجد عناصر', 'No items yet')}</div>
          <button className="btn btn-ghost btn-sm text-xs">{t('إضافة عنصر', 'Add Item')}</button>
        </div>
      ),
    },
    {
      name: t('خطأ', 'Error'),
      content: (
        <div
          className="flex items-start gap-2 p-3 rounded-md text-xs"
          style={{ background: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <div className="font-medium">{t('فشل التحميل', 'Load Failed')}</div>
            <div>{t('تحقق من الاتصال وأعد المحاولة.', 'Check connection and retry.')}</div>
          </div>
        </div>
      ),
    },
    {
      name: t('معطل', 'Disabled'),
      content: (
        <div
          className="flex items-center gap-2 p-3 rounded-md text-xs"
          style={{ background: 'var(--disabled-bg)', color: 'var(--disabled-text)', border: '1px solid var(--disabled-border)' }}
          aria-disabled="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          {t('هذا المكوّن معطل حالياً', 'This component is currently disabled')}
        </div>
      ),
    },
    {
      name: t('محظور', 'Permission Denied'),
      content: (
        <div
          className="flex items-center gap-2 p-3 rounded-md text-xs"
          style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)' }}
          role="alert"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          {t('ليس لديك صلاحية الوصول لهذا المحتوى', 'You do not have permission to access this content')}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {states.map(state => (
        <div
          key={`state-card-${state.name}`}
          className="rounded-lg p-4"
          style={{ border: '1px solid var(--border)', background: 'var(--background)' }}
        >
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {state.name}
          </div>
          {state.content}
        </div>
      ))}
    </div>
  );
};

// ─── Showcase Content ─────────────────────────────────────────────────────────
function ShowcaseContent() {
  const { lang, t, theme, setTheme, accentName, setAccentName } = useApp();

  const graySteps = [
    { name: '50', value: 'var(--gray-50)' },
    { name: '100', value: 'var(--gray-100)' },
    { name: '200', value: 'var(--gray-200)' },
    { name: '300', value: 'var(--gray-300)' },
    { name: '400', value: 'var(--gray-400)' },
    { name: '500', value: 'var(--gray-500)' },
    { name: '600', value: 'var(--gray-600)' },
    { name: '700', value: 'var(--gray-700)' },
    { name: '800', value: 'var(--gray-800)' },
    { name: '900', value: 'var(--gray-900)' },
    { name: '950', value: 'var(--gray-950)' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6">
      {/* Disclaimer Banner */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8 text-sm font-medium"
        style={{
          background: 'var(--warning-bg)',
          color: 'var(--warning-text)',
          border: '1px solid var(--warning-border)',
        }}
        role="note"
        aria-label="إشعار مهم"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div>
          <div>{t('خيارات أولية قيد المراجعة — ليست معياراً معتمداً', 'Initial options under review — not an approved standard')}</div>
          <div className="text-xs mt-0.5 font-normal" style={{ color: 'var(--warning-text)', opacity: 0.8 }}>
            {t('هذه الصفحة لعرض خيارات التصميم الأولية وتجريبها. القيم والمكوّنات قابلة للتغيير.', 'This page displays initial design options for review. Values and components are subject to change.')}
          </div>
        </div>
      </div>

      {/* Live Controls */}
      <div className="card p-5 mb-8">
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('أدوات التبديل الحية', 'Live Switching Controls')}
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          {/* Accent Toggle */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('لون التمييز', 'Accent Color')}
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button
                onClick={() => setAccentName('indigo')}
                className="px-4 py-2 text-xs font-medium transition-colors flex items-center gap-2"
                style={{
                  background: accentName === 'indigo' ? 'var(--accent)' : 'var(--surface)',
                  color: accentName === 'indigo' ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer',
                }}
                aria-pressed={accentName === 'indigo'}
              >
                <span className="rounded-full" style={{ width: 10, height: 10, background: '#6366F1', display: 'inline-block' }} />
                {t('نيلي', 'Indigo')} #6366F1
              </button>
              <button
                onClick={() => setAccentName('navy')}
                className="px-4 py-2 text-xs font-medium transition-colors flex items-center gap-2"
                style={{
                  background: accentName === 'navy' ? 'var(--accent)' : 'var(--surface)',
                  color: accentName === 'navy' ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer',
                }}
                aria-pressed={accentName === 'navy'}
              >
                <span className="rounded-full" style={{ width: 10, height: 10, background: '#1B365D', display: 'inline-block' }} />
                {t('كحلي', 'Navy')} #1B365D
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              {t('المظهر', 'Theme')}
            </div>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button
                onClick={() => setTheme('light')}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  background: theme === 'light' ? 'var(--accent)' : 'var(--surface)',
                  color: theme === 'light' ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer',
                }}
                aria-pressed={theme === 'light'}
              >
                ☀️ {t('فاتح', 'Light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="px-4 py-2 text-xs font-medium"
                style={{
                  background: theme === 'dark' ? 'var(--accent)' : 'var(--surface)',
                  color: theme === 'dark' ? '#fff' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer',
                }}
                aria-pressed={theme === 'dark'}
              >
                🌙 {t('داكن', 'Dark')}
              </button>
            </div>
          </div>

          {/* Accent discipline note */}
          <div
            className="text-xs px-3 py-2 rounded-md"
            style={{ background: 'var(--info-bg)', color: 'var(--info-text)', border: '1px solid var(--info-border)' }}
          >
            {t('اختبار الانضباط: أي عنصر لا يتغير لون التمييز فيه = لون مكتوب مباشرة (انتهاك).', 'Discipline test: any element that does not change accent color = hardcoded color (violation).')}
          </div>
        </div>
      </div>

      {/* Gray Scale */}
      <ShowcaseSection title={t('مقياس الرمادي', 'Gray Scale')} subtitle={t('11 درجة — الأساس الكامل للنظام', '11 steps — the complete system foundation')}>
        <div className="grid grid-cols-11 gap-2">
          {graySteps.map(s => (
            <ColorSwatch key={`gray-${s.name}`} name={s.name} value={s.value} />
          ))}
        </div>
      </ShowcaseSection>

      {/* Accent Family */}
      <ShowcaseSection title={t('عائلة لون التمييز', 'Accent Color Family')} subtitle={t('تتغير مع مبدل اللون أعلاه', 'Changes with the color switcher above')}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { token: '--accent', name: t('أساسي', 'Default') },
            { token: '--accent-hover', name: t('تمرير', 'Hover') },
            { token: '--accent-pressed', name: t('ضغط', 'Pressed') },
            { token: '--accent-subtle', name: t('خفيف', 'Subtle') },
            { token: '--accent-muted', name: t('كتوم', 'Muted') },
            { token: '--accent-foreground', name: t('نص', 'Foreground') },
          ].map(item => (
            <ColorSwatch key={`accent-${item.token}`} name={item.name} value={`var(${item.token})`} />
          ))}
        </div>
      </ShowcaseSection>

      {/* Semantic Colors */}
      <ShowcaseSection title={t('الألوان الدلالية', 'Semantic Colors')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: t('نجاح', 'Success'), bg: '--success-bg', text: '--success-text', border: '--success-border', main: '--success' },
            { name: t('تحذير', 'Warning'), bg: '--warning-bg', text: '--warning-text', border: '--warning-border', main: '--warning' },
            { name: t('خطأ', 'Error'), bg: '--error-bg', text: '--error-text', border: '--error-border', main: '--error' },
            { name: t('معلومة', 'Info'), bg: '--info-bg', text: '--info-text', border: '--info-border', main: '--info' },
          ].map(item => (
            <div
              key={`semantic-${item.name}`}
              className="rounded-lg p-4"
              style={{ background: `var(${item.bg})`, border: `1px solid var(${item.border})` }}
            >
              <div className="text-sm font-semibold mb-1" style={{ color: `var(${item.text})` }}>
                {item.name}
              </div>
              <div className="text-xs" style={{ color: `var(${item.text})` }}>
                {t('نص تجريبي بلون الحالة', 'Sample text in semantic color')}
              </div>
              <div className="mt-2 w-6 h-6 rounded" style={{ background: `var(${item.main})` }} />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Risk Family */}
      <ShowcaseSection title={t('عائلة المخاطر', 'Risk Token Family')} subtitle={t('مولودة في شاشة سجل الإجراءات', 'Born in the Action Registry screen')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { level: 'low' as const, name: t('منخفض', 'Low') },
            { level: 'medium' as const, name: t('متوسط', 'Medium') },
            { level: 'high' as const, name: t('مرتفع', 'High') },
            { level: 'critical' as const, name: t('حرج', 'Critical') },
          ].map(item => (
            <div key={`risk-family-${item.level}`} className="flex flex-col gap-2">
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.name}</div>
              <RiskBadge level={item.level} />
              <div
                className="rounded-md p-2 text-xs"
                style={{
                  background: `var(--risk-${item.level}-bg)`,
                  color: `var(--risk-${item.level}-text)`,
                  border: `1px solid var(--risk-${item.level})`,
                }}
              >
                {t('خلفية المستوى', 'Level background')}
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Classification Family */}
      <ShowcaseSection title={t('عائلة التصنيف', 'Classification Token Family')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { level: 'public' as const, name: t('عام', 'Public') },
            { level: 'internal' as const, name: t('داخلي', 'Internal') },
            { level: 'confidential' as const, name: t('سري', 'Confidential') },
            { level: 'top_secret' as const, name: t('سري للغاية', 'Top Secret') },
          ].map(item => (
            <div key={`class-family-${item.level}`} className="flex flex-col gap-2">
              <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.name}</div>
              <ClassificationBadge level={item.level} />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Typography */}
      <ShowcaseSection title={t('التنوع الطباعي', 'Typography Scale')}>
        <div className="space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {[
            { size: 32, weight: 700, label: 'H1 — 32px Bold', ar: 'عنوان رئيسي — مستوى H1', en: 'Main Heading — H1 Level' },
            { size: 24, weight: 600, label: 'H2 — 24px SemiBold', ar: 'عنوان فرعي — مستوى H2', en: 'Section Heading — H2 Level' },
            { size: 20, weight: 600, label: 'H3 — 20px SemiBold', ar: 'عنوان قسم — مستوى H3', en: 'Subsection Heading — H3 Level' },
            { size: 16, weight: 500, label: 'H4 — 16px Medium', ar: 'عنوان مكوّن — مستوى H4', en: 'Component Heading — H4 Level' },
            { size: 14, weight: 400, label: 'Body — 14px Regular', ar: 'نص الجسم — حجم Body للقراءة المريحة في الجلسات الطويلة', en: 'Body text — Body size for comfortable reading in long sessions' },
            { size: 12, weight: 400, label: 'Small — 12px', ar: 'نص صغير — للبيانات الثانوية والتسميات', en: 'Small text — for secondary data and labels' },
            { size: 11, weight: 400, label: 'Caption — 11px', ar: 'تعليق — للطوابع الزمنية والمعلومات التفصيلية', en: 'Caption — for timestamps and detail information' },
          ].map((item, i) => (
            <div key={`type-scale-${i}`} className="flex items-baseline gap-4">
              <span className="text-xs font-mono w-32 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span style={{ fontSize: item.size, fontWeight: item.weight, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {lang === 'ar' ? item.ar : item.en}
              </span>
            </div>
          ))}
          <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>JetBrains Mono — أرقام وأكواد</div>
            <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }} dir="ltr">
              AQL-2026-01042 · v2.1.3 · classify_correspondence · {"{ id: 'action-001', riskLevel: 'high' }"}
            </div>
          </div>
          <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('أرقام لاتينية موحدة داخل النص العربي', 'Unified Latin digits within Arabic text')}</div>
            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {t('تم استلام 1,247 مراسلة خلال الربع الأول من عام 2026، منها 89 مراسلة سرية.', '1,247 correspondence items received in Q1 2026, of which 89 were classified.')}
            </div>
          </div>
        </div>
      </ShowcaseSection>

      {/* Spacing */}
      <ShowcaseSection title={t('نظام التباعد', 'Spacing System')} subtitle={t('نظام 8px', '8px base system')}>
        <div className="flex items-end gap-4 flex-wrap">
          {[4, 8, 16, 24, 32, 48, 64, 96].map(size => (
            <div key={`spacing-${size}`} className="flex flex-col items-center gap-1">
              <div style={{ width: size, height: size, background: 'var(--accent)', borderRadius: 3, opacity: 0.7 }} />
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{size}px</div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Radius */}
      <ShowcaseSection title={t('نظام الحواف', 'Border Radius System')}>
        <div className="flex gap-6 flex-wrap items-end">
          {[
            { name: 'sm', value: '4px' },
            { name: 'md', value: '6px' },
            { name: 'lg', value: '8px' },
            { name: 'xl', value: '12px' },
            { name: 'full', value: '9999px' },
          ].map(r => (
            <div key={`radius-${r.name}`} className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: 'var(--accent-subtle)',
                  border: '2px solid var(--accent)',
                  borderRadius: r.value,
                }}
              />
              <div className="text-xs text-center font-mono" style={{ color: 'var(--text-secondary)' }}>
                {r.name}<br />{r.value}
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Shadows */}
      <ShowcaseSection title={t('الظلال', 'Shadows')}>
        <div className="flex gap-6 flex-wrap">
          {[
            { name: t('elevation-1 (بطاقات)', 'elevation-1 (cards)'), shadow: 'var(--shadow-1)' },
            { name: t('elevation-2 (طبقات عائمة)', 'elevation-2 (floating layers)'), shadow: 'var(--shadow-2)' },
          ].map(s => (
            <div key={`shadow-${s.name}`} className="flex flex-col items-center gap-3">
              <div
                className="rounded-lg"
                style={{ width: 100, height: 60, background: 'var(--surface)', boxShadow: s.shadow, border: '1px solid var(--border)' }}
              />
              <div className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>{s.name}</div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      {/* Status Badges */}
      <ShowcaseSection title={t('شارات الحالة', 'Status Badges')}>
        <div className="flex flex-wrap gap-3">
          {(['draft', 'under_review', 'approved', 'rejected', 'archived'] as const).map(s => (
            <StatusBadge key={`status-badge-${s}`} status={s} />
          ))}
        </div>
      </ShowcaseSection>

      {/* Buttons */}
      <ShowcaseSection title={t('الأزرار', 'Buttons')}>
        <ButtonDemo t={t} lang={lang} />
      </ShowcaseSection>

      {/* Inputs */}
      <ShowcaseSection title={t('حقول الإدخال', 'Input Fields')}>
        <InputDemo t={t} />
      </ShowcaseSection>

      {/* State Cards */}
      <ShowcaseSection title={t('حالات المكوّنات الخمس', 'Five Component States')}>
        <StateCardsDemo t={t} />
      </ShowcaseSection>

      {/* Dialogs / Toasts */}
      <ShowcaseSection title={t('الحوارات والإشعارات', 'Dialogs & Toasts')}>
        <DialogDemo t={t} lang={lang} />
      </ShowcaseSection>

      {/* Mini Table */}
      <ShowcaseSection title={t('نموذج جدول مصغر', 'Mini Table Sample')}>
        <div className="overflow-x-auto">
          <table className="data-table" style={{ minWidth: 500 }}>
            <thead>
              <tr>
                <th>{t('المرجع', 'Reference')}</th>
                <th>{t('العنوان', 'Title')}</th>
                <th>{t('الحالة', 'Status')}</th>
                <th>{t('التصنيف', 'Classification')}</th>
                <th>{t('المخاطرة', 'Risk')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'AQL-2026-01001', title: t('مراسلة وزارة المالية', 'Finance Ministry Correspondence'), status: 'approved' as const, class: 'confidential' as const, risk: 'high' as const },
                { ref: 'AQL-2026-01002', title: t('طلب إجازة سنوية', 'Annual Leave Request'), status: 'under_review' as const, class: 'internal' as const, risk: 'low' as const },
                { ref: 'AQL-2026-01003', title: t('عقد توريد معدات', 'Equipment Supply Contract'), status: 'draft' as const, class: 'public' as const, risk: 'medium' as const },
              ].map(row => (
                <tr key={`mini-table-${row.ref}`} className="group">
                  <td><span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{row.ref}</span></td>
                  <td><span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.title}</span></td>
                  <td><StatusBadge status={row.status} /></td>
                  <td><ClassificationBadge level={row.class} /></td>
                  <td><RiskBadge level={row.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* Token Inventory */}
      <ShowcaseSection title={t('جرد الرموز الدلالية', 'Semantic Token Inventory')}>
        <div className="space-y-1">
          {[
            { token: '--background', value: 'light: #F8FAFC / dark: #0F172A', desc: t('خلفية الصفحة', 'Page background') },
            { token: '--surface', value: 'light: #FFFFFF / dark: #1E293B', desc: t('خلفية البطاقات', 'Card background') },
            { token: '--accent', value: 'Indigo: #6366F1 / Navy: #1B365D', desc: t('لون التمييز — قابل للتبديل', 'Accent color — switchable') },
            { token: '--border', value: 'light: #E2E8F0 / dark: #334155', desc: t('لون الحدود الافتراضي', 'Default border color') },
            { token: '--text-primary', value: 'light: #0F172A / dark: #F1F5F9', desc: t('النص الأساسي', 'Primary text') },
            { token: '--text-secondary', value: 'light: #475569 / dark: #94A3B8', desc: t('النص الثانوي', 'Secondary text') },
            { token: '--text-muted', value: 'light: #94A3B8 / dark: #64748B', desc: t('النص الكتوم', 'Muted text') },
          ].map(item => (
            <TokenRow key={`token-inv-${item.token}`} token={item.token} value={item.value} description={item.desc} />
          ))}
        </div>
      </ShowcaseSection>
    </div>
  );
}

export default function ShowcasePage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <AppShell breadcrumbs={[{ label: 'عقل', href: '/' }, { label: 'معرض التصميم' }]}>
      <ShowcaseContent />
    </AppShell>
  );
}