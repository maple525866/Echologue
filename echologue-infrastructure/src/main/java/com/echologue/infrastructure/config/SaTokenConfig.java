package com.echologue.infrastructure.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sa-Token配置
 *
 * @author Echologue
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {
    
    /**
     * 注册Sa-Token拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册Sa-Token拦截器，校验登录状态
        registry.addInterceptor(new SaInterceptor(handle -> {
            // 校验登录（所有路由都校验，下面排除不需要校验的）
            // StpUtil.checkLogin();
        }))
        .addPathPatterns("/**")
        .excludePathPatterns(
            // 排除登录接口
            "/api/user/login",
            "/api/user/register",
            // 排除公开接口（查看文章）
            "/api/article",
            "/api/article/*",
            "/api/category",
            "/api/category/*",
            "/api/tag",
            "/api/tag/*",
            // 排除Swagger文档
            "/doc.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/webjars/**",
            // 排除静态资源
            "/favicon.ico",
            "/error"
        );
    }
}
