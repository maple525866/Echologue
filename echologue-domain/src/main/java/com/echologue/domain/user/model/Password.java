package com.echologue.domain.user.model;

import cn.hutool.crypto.digest.BCrypt;
import lombok.Value;

/**
 * 密码值对象
 *
 * @author Echologue
 */
@Value
public class Password {
    
    /**
     * 加密后的密码
     */
    String encryptedValue;
    
    private Password(String encryptedValue) {
        this.encryptedValue = encryptedValue;
    }
    
    /**
     * 创建密码（加密）
     */
    public static Password create(String rawPassword) {
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("密码不能为空");
        }
        if (rawPassword.length() < 6) {
            throw new IllegalArgumentException("密码长度不能少于6位");
        }
        // 使用BCrypt加密
        String encrypted = BCrypt.hashpw(rawPassword, BCrypt.gensalt());
        return new Password(encrypted);
    }
    
    /**
     * 从已加密的密码创建
     */
    public static Password fromEncrypted(String encryptedPassword) {
        if (encryptedPassword == null || encryptedPassword.isEmpty()) {
            throw new IllegalArgumentException("加密密码不能为空");
        }
        return new Password(encryptedPassword);
    }
    
    /**
     * 校验密码
     */
    public boolean matches(String rawPassword) {
        if (rawPassword == null) {
            return false;
        }
        return BCrypt.checkpw(rawPassword, this.encryptedValue);
    }
}
