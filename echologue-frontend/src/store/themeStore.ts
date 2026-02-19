import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 从localStorage获取主题，默认为dark
const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  return savedTheme || 'dark';
};

// 应用主题到HTML根元素
const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
};

export const useThemeStore = create<ThemeStore>((set) => {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  return {
    theme: initialTheme,
    
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        return { theme: newTheme };
      });
    },
    
    setTheme: (theme: Theme) => {
      applyTheme(theme);
      set({ theme });
    },
  };
});
