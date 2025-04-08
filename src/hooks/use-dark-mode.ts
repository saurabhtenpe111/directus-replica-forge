
import { useEffect, useState } from 'react';

interface UseDarkModeReturn {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useDarkMode = (): UseDarkModeReturn => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Check if user prefers dark mode from system settings
  useEffect(() => {
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersColorScheme.matches);
    
    // Listen for changes in system color scheme preference
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    prefersColorScheme.addEventListener('change', handler);
    
    return () => {
      prefersColorScheme.removeEventListener('change', handler);
    };
  }, []);
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return { isDarkMode, toggleDarkMode };
};
