package com.echologue.types.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 用户状态枚举
 *
 * @author Echologue
 */
@Getter
@AllArgsConstructor
public enum UserStatus {
    
    /**
     * 正常
     */
    NORMAL(1, "正常"),
    
    /**
     * 禁用
     */
    DISABLED(0, "禁用");
    
    private final Integer code;
    private final String desc;
    
    /**
     * 根据code获取枚举
     */
    public static UserStatus of(Integer code) {
        for (UserStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的用户状态: " + code);
    }
}
