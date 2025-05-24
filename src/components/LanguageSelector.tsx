"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation('common');
  const [mounted, setMounted] = useState(false);

  // 确保组件在客户端挂载后才显示真实内容
  useEffect(() => {
    setMounted(true);
    
    // 从localStorage恢复语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      const supportedLanguages = languages.map(lang => lang.code);
      if (supportedLanguages.includes(savedLanguage)) {
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, [i18n]);

  // 处理语言切换
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  // 在服务器端和客户端挂载前显示默认英语状态，避免hydration错误
  if (!mounted) {
    return (
      <div className="w-40 h-9 bg-white border border-gray-200 rounded-md flex items-center gap-2 px-3">
        <Globe size={16} className="text-gray-500" />
        <span className="flex items-center gap-2">
          <span>🇺🇸</span>
          <span className="text-sm">English</span>
        </span>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-40 h-9 bg-white border-gray-200">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-500" />
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.name}</span>
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 