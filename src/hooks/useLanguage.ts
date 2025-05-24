"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';

const SUPPORTED_LANGUAGES = ['en', 'zh', 'pt', 'de', 'ko', 'hi', 'fr'];

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  // 初始化客户端状态和语言加载
  useEffect(() => {
    setIsClient(true);
    
    // 从localStorage恢复语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage).then(() => {
        setIsLanguageLoaded(true);
      });
    } else {
      setIsLanguageLoaded(true);
    }
  }, [i18n]);

  // 监听语言变化并保存到localStorage
  useEffect(() => {
    if (!isClient) return;

    const handleLanguageChange = (lng: string) => {
      localStorage.setItem('language', lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, isClient]);

  const changeLanguage = useCallback((language: string) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      i18n.changeLanguage(language);
    }
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isClient,
    isLanguageLoaded,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}; 