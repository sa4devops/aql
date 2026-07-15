'use client';
import React, { useEffect } from 'react';
import '../styles/tailwind.css';

// Inline script to prevent Flash of Incorrect Theme — runs before React hydration
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('aql-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
    var lang = localStorage.getItem('aql-lang') || 'ar';
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    var accent = localStorage.getItem('aql-accent');
    if (accent) {
      try {
        var tokens = JSON.parse(accent);
        Object.entries(tokens).forEach(function(e) {
          document.documentElement.style.setProperty(e[0], e[1]);
        });
      } catch(e) {}
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>عقل / AQL — منصة إدارة المعرفة المؤسسية</title>
        <meta name="description" content="منصة عقل لإدارة المعرفة والذكاء الاصطناعي للجهات الحكومية والمؤسسات الكبرى" />
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Faql1113back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}