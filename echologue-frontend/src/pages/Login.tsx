import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/user';
import { getUserInfo } from '@/api/user';
import { useUserStore } from '@/store/userStore';

const Login = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUserStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 客户端校验
    if (!formData.email || !formData.password) {
      setError('请填写所有必填项');
      return;
    }

    setLoading(true);

    try {
      // 调用登录接口
      const res = await login(formData);
      const token = res.data;
      
      // 保存token到localStorage
      localStorage.setItem('satoken', token);
      
      // 获取用户信息
      const userRes = await getUserInfo();
      setUserInfo(userRes.data);
      
      // 跳转到首页
      navigate('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err, '登录失败，请检查邮箱和密码'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Echologue</h1>
          <p className="text-gray-600 dark:text-gray-400">登录你的账号</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium mb-2">
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
            <div>
              <label className="block text-sm font-medium mb-2">
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
              className="btn btn-primary w-full"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            还没有账号？{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              立即注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
