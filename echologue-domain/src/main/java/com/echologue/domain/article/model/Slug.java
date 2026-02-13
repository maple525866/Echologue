package com.echologue.domain.article.model;

import cn.hutool.core.util.StrUtil;
import lombok.Value;

import java.util.UUID;

/**
 * URL别名值对象
 *
 * @author Echologue
 */
@Value
public class Slug {
    
    String value;
    
    public Slug(String value) {
        if (value != null && !value.isEmpty()) {
            if (!value.matches("^[a-z0-9-]+$")) {
                throw new IllegalArgumentException("Slug只能包含小写字母、数字和连字符");
            }
            this.value = value;
        } else {
            // 如果没有提供slug，生成一个随机的
            this.value = generateRandomSlug();
        }
    }
    
    public static Slug of(String slug) {
        return new Slug(slug);
    }
    
    public static Slug generate() {
        return new Slug(null);
    }
    
    private String generateRandomSlug() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
