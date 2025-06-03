import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' 
      ? localStorage.getItem('language') || 'en' 
      : 'en';
    setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return { language, changeLanguage };
}; 