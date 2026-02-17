import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('satoken');
    if (token && config.headers) {
      config.headers['satoken'] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    
    // 如果返回的code不是200，说明接口调用出错
    if (res.code !== 200) {
      console.error('接口错误:', res.message || '未知错误');
      
      // Token过期或未登录
      if (res.code === 401 || res.code === 403) {
        localStorage.removeItem('satoken');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.message || '接口调用失败'));
    }
    
    return res;
  },
  (error: AxiosError) => {
    console.error('响应错误:', error.message);
    
    // 网络错误或超时
    if (error.message.includes('timeout')) {
      console.error('请求超时，请稍后重试');
    } else if (error.message.includes('Network Error')) {
      console.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

export default request;
