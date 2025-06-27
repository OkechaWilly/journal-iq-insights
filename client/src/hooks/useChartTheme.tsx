import { useEffect, useState } from 'react';
import { getChartTheme, getChartColors, getCandlestickTheme } from '@/lib/chartTheme';

export const useChartTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setIsDark(isDarkMode);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return {
    isDark,
    theme: getChartTheme(isDark),
    colors: getChartColors(isDark),
    candlestickTheme: getCandlestickTheme(isDark),
  };
};