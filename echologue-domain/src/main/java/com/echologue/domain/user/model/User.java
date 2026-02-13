package com.echologue.domain.user.model;

import com.echologue.types.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户聚合根
 *
 * @author Echologue
 */
@Data
@Builder
public class User {
    
    /**
     * 用户ID
     */
    private UserId id;
    
    /**
     * 用户名
     */
    private Username username;
    
    /**
     * 邮箱
     */
    private Email email;
    
    /**
     * 密码
     */
    private Password password;
    
    /**
     * 头像
     */
    private String avatar;
    
    /**
     * 个人简介
     */
    private String bio;
    
    /**
     * 状态
     */
    private UserStatus status;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 注册用户
     */
    public static User register(Username username, Email email, Password password) {
        return User.builder()
                .username(username)
                .email(email)
                .password(password)
                .status(UserStatus.NORMAL)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * 认证密码
     */
    public boolean authenticate(String rawPassword) {
        return this.password.matches(rawPassword);
    }
    
    /**
     * 更新个人信息
     */
    public void updateProfile(String avatar, String bio) {
        this.avatar = avatar;
        this.bio = bio;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 修改密码
     */
    public void changePassword(Password newPassword) {
        this.password = newPassword;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 禁用用户
     */
    public void disable() {
        this.status = UserStatus.DISABLED;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 启用用户
     */
    public void enable() {
        this.status = UserStatus.NORMAL;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 是否正常状态
     */
    public boolean isNormal() {
        return this.status == UserStatus.NORMAL;
    }
}
