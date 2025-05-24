"use client";

import { useEffect } from 'react';
import '../lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 这里不需要做任何特殊处理，让LanguageSelector自己处理语言恢复
  }, []);

  return <>{children}</>;
} 