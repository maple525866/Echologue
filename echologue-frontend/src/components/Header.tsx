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
    <header className="sticky top-0 z-50 bg-ink-base border-b border-ink-border">
      <div className="container-content">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-semibold tracking-wide text-ink-primary hover:text-ink-accent transition-colors duration-200"
          >
            Echologue
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="btn btn-ghost text-sm px-3 py-1.5"
            >
              首页
            </Link>
            {isLogin && (
              <Link
                to="/editor"
                className="btn btn-ghost text-sm px-3 py-1.5"
              >
                写文章
              </Link>
            )}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-2">
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost w-8 h-8 p-0 flex items-center justify-center rounded-md"
              aria-label="切换主题"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* 用户信息 / 登录按钮 */}
            {isLogin && userInfo ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded-md hover:bg-ink-surface transition-colors duration-150">
                  <div className="w-7 h-7 rounded-full bg-ink-accent flex items-center justify-center text-xs font-medium text-ink-base">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm text-ink-secondary">
                    {userInfo.username}
                  </span>
                </div>

                {/* 下拉菜单 */}
                <div className="absolute right-0 mt-1.5 w-44 bg-ink-hover rounded-lg border border-ink-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="py-1">
                    <Link
                      to={`/user/${userInfo.id}`}
                      className="block px-4 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-ink-surface transition-colors duration-150"
                    >
                      个人主页
                    </Link>
                    <div className="border-t border-ink-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-ink-danger hover:bg-ink-surface transition-colors duration-150"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-ghost text-sm px-3 py-1.5">
                  登录
                </Link>
                <Link to="/register" className="btn btn-primary text-sm px-3 py-1.5">
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
