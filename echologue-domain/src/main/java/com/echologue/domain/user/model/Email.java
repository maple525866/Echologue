package com.echologue.domain.user.model;

import lombok.Value;

import java.util.regex.Pattern;

/**
 * 邮箱值对象
 *
 * @author Echologue
 */
@Value
public class Email {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    String value;
    
    public Email(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("邮箱格式不正确");
        }
        this.value = value.trim().toLowerCase();
    }
    
    public static Email of(String email) {
        return new Email(email);
    }
}
