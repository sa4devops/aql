'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/app-routes/routes';
import type { UserRole, SimulationMode } from '@/mocks/types';
import { USERS } from '@/mocks/data';

// ─── App Context ──────────────────────────────────────────────────────────────
interface AppContextType {
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  simMode: SimulationMode;
  setSimMode: (m: SimulationMode) => void;
  simRole: UserRole;
  setSimRole: (r: UserRole) => void;
  currentUser: typeof USERS[0];
  t: (ar: string, en: string) => string;
  accentName: 'indigo' | 'navy';
  setAccentName: (a: 'indigo' | 'navy') => void;
}

export const AppContext = createContext<AppContextType>({
  lang: 'ar', setLang: () => {},
  theme: 'light', setTheme: () => {},
  simMode: 'normal', setSimMode: () => {},
  simRole: 'system_admin', setSimRole: () => {},
  currentUser: USERS[0],
  t: (ar) => ar,
  accentName: 'indigo', setAccentName: () => {},
});

export const useApp = () => useContext(AppContext);

// ─── Accent Tokens ────────────────────────────────────────────────────────────
const ACCENT_TOKENS = {
  indigo: {
    '--accent': '#6366F1',
    '--accent-hover': '#4F46E5',
    '--accent-pressed': '#4338CA',
    '--accent-subtle': '#EEF2FF',
    '--accent-muted': '#C7D2FE',
  },
  navy: {
    '--accent': '#1B365D',
    '--accent-hover': '#152B4A',
    '--accent-pressed': '#0F1F36',
    '--accent-subtle': '#E8EDF5',
    '--accent-muted': '#B8C8DF',
  },
};

// ─── Nav Items ────────────────────────────────────────────────────────────────
const getNavItems = (t: (ar: string, en: string) => string) => [
  {
    group: t('الرئيسية', 'Main'),
    items: [
      { label: t('الرئيسية', 'Home'), icon: 'home', href: '/', exact: true },
    ],
  },
  {
    group: t('السجلات', 'Records'),
    items: [
      { label: t('قائمة السجلات', 'Record List'), icon: 'table', href: ROUTES.records },
      { label: t('منشئ أنواع السجلات', 'Type Builder'), icon: 'layout', href: ROUTES.recordTypeBuilder },
    ],
  },
  {
    group: t('سير العمل', 'Workflows'),
    items: [
      { label: t('منشئ المسارات', 'Workflow Builder'), icon: 'workflow', href: ROUTES.workflowBuilder },
    ],
  },
  {
    group: t('الحوكمة', 'Governance'),
    items: [
      { label: t('سجل الإجراءات', 'Action Registry'), icon: 'shield', href: ROUTES.governanceActions },
    ],
  },
  {
    group: t('النظام', 'System'),
    items: [
      { label: t('معرض التصميم', 'UI Showcase'), icon: 'palette', href: ROUTES.showcase },
    ],
  },
];

const NavIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    table: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>,
    layout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>,
    workflow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v3m-4.5 5.5L12 10l4.5 5.5"/></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    palette: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  };
  return <span className="flex-shrink-0 text-current">{icons[name] || icons.home}</span>;
};

const roleLabels: Record<UserRole, { ar: string; en: string }> = {
  employee: { ar: 'موظف', en: 'Employee' },
  supervisor: { ar: 'مشرف', en: 'Supervisor' },
  manager: { ar: 'مدير', en: 'Manager' },
  system_admin: { ar: 'مسؤول نظام', en: 'System Admin' },
};

// ─── Simulation Switcher ──────────────────────────────────────────────────────
const SimSwitcher = () => {
  const { simMode, setSimMode, simRole, setSimRole, lang } = useApp();
  const [open, setOpen] = useState(false);
  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  return (
    <div className="sim-switcher">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-xs font-mono"
        style={{ color: 'var(--gray-300)' }}
        aria-label="Simulation Switcher"
      >
        <span style={{ color: '#22C55E' }}>◉</span>
        {t('محاكي', 'SIM')}
        <span style={{ color: 'var(--gray-500)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--gray-700)' }}>
          <div className="mb-2">
            <div className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>{t('الحالة', 'Mode')}</div>
            {(['normal', 'loading', 'error', 'empty'] as SimulationMode[]).map(m => (
              <button
                key={`sim-mode-${m}`}
                onClick={() => setSimMode(m)}
                className="block w-full text-start text-xs px-1 py-0.5 rounded"
                style={{
                  color: simMode === m ? '#22C55E' : 'var(--gray-400)',
                  background: simMode === m ? 'rgba(34,197,94,0.1)' : 'transparent',
                }}
              >
                {m === 'normal' ? t('طبيعي', 'Normal') : m === 'loading' ? t('تحميل', 'Loading') : m === 'error' ? t('خطأ', 'Error') : t('فارغ', 'Empty')}
              </button>
            ))}
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--gray-500)' }}>{t('الدور', 'Role')}</div>
            {(['employee', 'supervisor', 'manager', 'system_admin'] as UserRole[]).map(r => (
              <button
                key={`sim-role-${r}`}
                onClick={() => setSimRole(r)}
                className="block w-full text-start text-xs px-1 py-0.5 rounded"
                style={{
                  color: simRole === r ? '#818CF8' : 'var(--gray-400)',
                  background: simRole === r ? 'rgba(129,140,248,0.1)' : 'transparent',
                }}
              >
                {roleLabels[r][lang]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { lang, setLang, theme, setTheme, simRole, t, currentUser } = useApp();
  const pathname = usePathname();
  const navItems = getNavItems(t);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <aside
      className="sidebar-transition flex flex-col h-full"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--surface)',
        borderInlineEnd: '1px solid var(--border)',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      aria-label={t('القائمة الجانبية', 'Sidebar')}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ height: 'var(--topbar-height)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}
      >
        <img
          src="/assets/images/logo-1784079754223.png"
          alt={t('شعار عقل', 'AQL Logo')}
          style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
        />
        {!collapsed && (
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--accent)', lineHeight: 1.2 }}>عقل</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-latin)', lineHeight: 1.2 }}>AQL Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2" role="navigation">
        {navItems.map(group => (
          <div key={`nav-group-${group.group}`} className="mb-4">
            {!collapsed && (
              <div
                className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
              >
                {group.group}
              </div>
            )}
            {group.items.map(item => (
              <Link
                key={`nav-${item.href}`}
                href={item.href}
                className={`nav-item ${isActive(item.href, item.exact) ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
              >
                <NavIcon name={item.icon} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="px-2 py-3" style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* User */}
        <div className="flex items-center gap-2 px-2 py-2 mb-2 rounded-md" style={{ background: 'var(--background)' }}>
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ width: 28, height: 28, background: 'var(--accent-subtle)', color: 'var(--accent)' }}
            aria-hidden="true"
          >
            {currentUser.name.ar.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ar' ? currentUser.name.ar : currentUser.name.en}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {roleLabels[simRole][lang]}
              </div>
            </div>
          )}
        </div>

        {/* Lang / Theme toggles */}
        {!collapsed && (
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="btn btn-ghost btn-sm flex-1 text-xs"
              aria-label={t('تبديل اللغة', 'Toggle Language')}
            >
              {lang === 'ar' ? 'EN' : 'عر'}
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="btn btn-ghost btn-sm flex-1 text-xs"
              aria-label={t('تبديل المظهر', 'Toggle Theme')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="btn btn-ghost btn-sm w-full"
          aria-label={collapsed ? t('توسيع القائمة', 'Expand Sidebar') : t('طي القائمة', 'Collapse Sidebar')}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: collapsed ? (lang === 'ar' ? 'rotate(180deg)' : 'rotate(0deg)') : (lang === 'ar' ? 'rotate(0deg)' : 'rotate(180deg)') }}
          >
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ breadcrumbs }: { breadcrumbs?: { label: string; href?: string }[] }) => {
  const { t } = useApp();

  return (
    <header
      className="flex items-center gap-4 px-4 lg:px-6"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
      role="banner"
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label={t('مسار التنقل', 'Breadcrumb')} className="flex items-center gap-1 text-sm flex-1 min-w-0">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={`crumb-${i}`}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="truncate hover:underline"
                  style={{ color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="truncate font-medium"
                  style={{ color: 'var(--text-primary)' }}
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Search (visual only) */}
      <div className="flex-1 max-w-xs">
        <div
          className="flex items-center gap-2 px-3 rounded-md text-sm"
          style={{ height: 32, background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          role="search"
          aria-label={t('بحث', 'Search')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span>{t('بحث...', 'Search...')}</span>
          <span className="ms-auto text-xs font-mono" style={{ color: 'var(--text-disabled)' }}>⌘K</span>
        </div>
      </div>

      {/* Notifications */}
      <button
        className="btn btn-ghost btn-sm relative"
        aria-label={t('الإشعارات', 'Notifications')}
        style={{ position: 'relative' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span
          className="absolute rounded-full text-xs flex items-center justify-center font-bold"
          style={{ top: 4, insetInlineEnd: 4, width: 14, height: 14, background: 'var(--error)', color: '#fff', fontSize: 9 }}
          aria-label="3 إشعارات"
        >3</span>
      </button>
    </header>
  );
};

// ─── App Shell Provider ───────────────────────────────────────────────────────
export default function AppShell({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const [lang, setLangState] = useState<'ar' | 'en'>('ar');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [simMode, setSimMode] = useState<SimulationMode>('normal');
  const [simRole, setSimRole] = useState<UserRole>('system_admin');
  const [collapsed, setCollapsed] = useState(false);
  const [accentName, setAccentNameState] = useState<'indigo' | 'navy'>('indigo');

  const currentUser = USERS.find(u => {
    if (simRole === 'system_admin') return u.role === 'system_admin';
    if (simRole === 'manager') return u.role === 'manager';
    if (simRole === 'supervisor') return u.role === 'supervisor';
    return u.role === 'employee';
  }) || USERS[0];

  const setLang = (l: 'ar' | 'en') => {
    setLangState(l);
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', l);
    localStorage.setItem('aql-lang', l);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    document.documentElement.classList.toggle('dark', t === 'dark');
    localStorage.setItem('aql-theme', t);
  };

  const setAccentName = (a: 'indigo' | 'navy') => {
    setAccentNameState(a);
    const tokens = ACCENT_TOKENS[a];
    Object.entries(tokens).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    localStorage.setItem('aql-accent', JSON.stringify(tokens));
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('aql-lang') as 'ar' | 'en' | null;
    const storedTheme = localStorage.getItem('aql-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedLang) {
      setLangState(storedLang);
      document.documentElement.setAttribute('dir', storedLang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', storedLang);
    }
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (prefersDark) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const t = (ar: string, en: string) => lang === 'ar' ? ar : en;

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, simMode, setSimMode, simRole, setSimRole, currentUser, t, accentName, setAccentName }}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: 'var(--background)' }}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar breadcrumbs={breadcrumbs} />
          <main
            className="flex-1 overflow-auto scrollbar-thin"
            style={{ background: 'var(--background)' }}
            id="main-content"
            role="main"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Simulation Switcher */}
      <SimSwitcher />
    </AppContext.Provider>
  );
}