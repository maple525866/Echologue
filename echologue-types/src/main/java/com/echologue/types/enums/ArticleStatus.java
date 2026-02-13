package com.echologue.types.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 文章状态枚举
 *
 * @author Echologue
 */
@Getter
@AllArgsConstructor
public enum ArticleStatus {
    
    /**
     * 草稿
     */
    DRAFT("DRAFT", "草稿"),
    
    /**
     * 已发布
     */
    PUBLISHED("PUBLISHED", "已发布"),
    
    /**
     * 已归档
     */
    ARCHIVED("ARCHIVED", "已归档");
    
    private final String code;
    private final String desc;
    
    /**
     * 根据code获取枚举
     */
    public static ArticleStatus of(String code) {
        for (ArticleStatus status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知的文章状态: " + code);
    }
}
