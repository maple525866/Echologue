package com.echologue.domain.user.model;

import lombok.Value;

/**
 * 用户名值对象
 *
 * @author Echologue
 */
@Value
public class Username {
    
    String value;
    
    public Username(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (value.length() < 3 || value.length() > 20) {
            throw new IllegalArgumentException("用户名长度必须在3-20个字符之间");
        }
        if (!value.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("用户名只能包含字母、数字和下划线");
        }
        this.value = value.trim();
    }
    
    public static Username of(String username) {
        return new Username(username);
    }
}
