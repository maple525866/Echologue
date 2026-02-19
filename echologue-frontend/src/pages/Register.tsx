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

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password) {
      setError('请填写所有必填项');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少为 6 位');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err: unknown) {
      setError(getErrorMessage(err, '注册失败，请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  const field = (
    label: string,
    type: string,
    key: keyof typeof formData,
    placeholder: string,
  ) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="input"
        placeholder={placeholder}
        required
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-sm">
        {/* 品牌区 */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-ink-primary tracking-tight">Echologue</h1>
          <p className="mt-1 text-sm text-ink-secondary">创建你的账号</p>
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

            {field('用户名', 'text', 'username', '请输入用户名')}
            {field('邮箱', 'email', 'email', 'your@email.com')}
            {field('密码', 'password', 'password', '至少 6 位字符')}
            {field('确认密码', 'password', 'confirmPassword', '请再次输入密码')}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中…' : '注册'}
            </button>
          </form>
        </div>

        {/* 登录跳转 */}
        <p className="mt-5 text-center text-sm text-ink-secondary">
          已有账号？{' '}
          <Link to="/login" className="text-ink-accent hover:text-ink-primary transition-colors duration-150 font-medium">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
