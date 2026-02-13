package com.echologue.domain.article.model;

import lombok.Value;

/**
 * 标题值对象
 *
 * @author Echologue
 */
@Value
public class Title {
    
    String value;
    
    public Title(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("标题不能为空");
        }
        if (value.length() > 200) {
            throw new IllegalArgumentException("标题长度不能超过200个字符");
        }
        this.value = value.trim();
    }
    
    public static Title of(String title) {
        return new Title(title);
    }
}
