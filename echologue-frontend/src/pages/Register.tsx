import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/api/user';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.username || !formData.email || !formData.password) {
      setError('请填写所有必填项');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    setLoading(true);

    try {
      // 调用注册接口
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // 注册成功，跳转到登录页
      alert('注册成功！请登录');
      navigate('/login');
    } catch (err: unknown) {
      setError(getErrorMessage(err, '注册失败，请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Echologue</h1>
          <p className="text-gray-600 dark:text-gray-400">创建你的账号</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                用户名
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="请输入用户名"
                required
              />
            </div>

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
                placeholder="至少6位字符"
                required
              />
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                placeholder="请再次输入密码"
                required
              />
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            已有账号？{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
