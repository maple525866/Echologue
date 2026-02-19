import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getUserInfo } from '@/api/user';
import { useUserStore } from '@/store/userStore';

const Login = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUserStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('请填写所有必填项');
      return;
    }

    setLoading(true);
    try {
      const res = await login(formData);
      localStorage.setItem('satoken', res.data);
      const userRes = await getUserInfo();
      setUserInfo(userRes.data);
      navigate('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err, '登录失败，请检查邮箱和密码'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-sm">
        {/* 品牌区 */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-ink-primary tracking-tight">Echologue</h1>
          <p className="mt-1 text-sm text-ink-secondary">登录你的账号</p>
        </div>

        {/* 表单卡片 */}
        <div className="bg-ink-surface rounded-xl border border-ink-border p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 错误提示 */}
            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-[#2a1a1a] border border-[#4a2a2a] text-ink-danger text-sm">
                {error}
              </div>
            )}

            {/* 邮箱 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider">
                邮箱
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* 密码 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider">
                密码
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="请输入密码"
                required
              />
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中…' : '登录'}
            </button>
          </form>
        </div>

        {/* 注册跳转 */}
        <p className="mt-5 text-center text-sm text-ink-secondary">
          还没有账号？{' '}
          <Link to="/register" className="text-ink-accent hover:text-ink-primary transition-colors duration-150 font-medium">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
