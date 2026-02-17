import { create } from 'zustand';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface UserStore {
  userInfo: UserInfo | null;
  isLogin: boolean;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
  checkLogin: () => boolean;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  isLogin: false,
  
  setUserInfo: (userInfo: UserInfo) => {
    set({ userInfo, isLogin: true });
  },
  
  clearUserInfo: () => {
    set({ userInfo: null, isLogin: false });
    localStorage.removeItem('satoken');
  },
  
  checkLogin: () => {
    const token = localStorage.getItem('satoken');
    if (!token && get().isLogin) {
      set({ userInfo: null, isLogin: false });
    }
    return !!token;
  },
}));
