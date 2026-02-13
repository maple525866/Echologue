package com.echologue.domain.category.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 标签聚合根
 *
 * @author Echologue
 */
@Data
@Builder
public class Tag {
    
    /**
     * 标签ID
     */
    private Long id;
    
    /**
     * 标签名称
     */
    private String name;
    
    /**
     * URL别名
     */
    private String slug;
    
    /**
     * 文章数量（冗余字段）
     */
    private Integer articleCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 创建标签
     */
    public static Tag create(String name, String slug) {
        return Tag.builder()
                .name(name)
                .slug(slug)
                .articleCount(0)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * 更新信息
     */
    public void update(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }
}
