import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserInfo } from '@/api/user';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ArticleDetail from '@/pages/ArticleDetail';
import Editor from '@/pages/Editor';
import StarBackground from '@/components/StarBackground';

// 路由守卫组件 - 需要登录
const RequireAuth = ({ children }: { children: ReactElement }) => {
  const { checkLogin } = useUserStore();
  
  if (!checkLogin()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { isLogin, setUserInfo, clearUserInfo } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem('satoken');
    if (!token || isLogin) return;

    const initUser = async () => {
      try {
        const res = await getUserInfo();
        setUserInfo(res.data);
      } catch (error) {
        console.error('恢复登录态失败:', error);
        clearUserInfo();
      }
    };

    void initUser();
  }, [isLogin, setUserInfo, clearUserInfo]);

  return (
    <>
    <StarBackground />
    <BrowserRouter>
      <Routes>
        {/* 首页 - 文章列表 */}
        <Route path="/" element={<Home />} />
        
        {/* 登录 */}
        <Route path="/login" element={<Login />} />
        
        {/* 注册 */}
        <Route path="/register" element={<Register />} />
        
        {/* 文章详情 */}
        <Route path="/article/:id" element={<ArticleDetail />} />
        
        {/* 创建文章 - 需要登录 */}
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        
        {/* 编辑文章 - 需要登录 */}
        <Route
          path="/editor/:id"
          element={
            <RequireAuth>
              <Editor />
            </RequireAuth>
          }
        />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
