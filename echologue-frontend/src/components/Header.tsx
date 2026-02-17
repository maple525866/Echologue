import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, isLogin, clearUserInfo } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    clearUserInfo();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gradient">
            Echologue
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
            >
              首页
            </Link>
            {isLogin && (
              <Link
                to="/editor"
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                写文章
              </Link>
            )}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="切换主题"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* 用户信息 / 登录按钮 */}
            {isLogin && userInfo ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {userInfo.username}
                  </span>
                </div>
                
                {/* 下拉菜单 */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link
                      to={`/user/${userInfo.id}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      个人主页
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-secondary text-sm">
                  登录
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
