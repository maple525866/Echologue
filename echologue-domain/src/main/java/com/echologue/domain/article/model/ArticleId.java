package com.echologue.domain.article.model;

import lombok.Value;

/**
 * 文章ID值对象
 *
 * @author Echologue
 */
@Value
public class ArticleId {
    
    Long value;
    
    public static ArticleId of(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("文章ID不能为空或小于等于0");
        }
        return new ArticleId(id);
    }
}
