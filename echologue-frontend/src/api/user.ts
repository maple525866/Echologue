import request from '@/utils/request';

// 用户注册请求参数
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

// 用户登录请求参数
export interface LoginParams {
  email: string;
  password: string;
}

// 用户信息响应
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

// 用户注册
export const register = (data: RegisterParams) => {
  return request.post('/user/register', data);
};

// 用户登录
export const login = (data: LoginParams) => {
  return request.post<string>('/user/login', data);
};

// 获取当前用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info');
};
