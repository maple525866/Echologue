package com.echologue.domain.category.model;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 分类聚合根
 *
 * @author Echologue
 */
@Data
@Builder
public class Category {
    
    /**
     * 分类ID
     */
    private Long id;
    
    /**
     * 分类名称
     */
    private String name;
    
    /**
     * URL别名
     */
    private String slug;
    
    /**
     * 分类描述
     */
    private String description;
    
    /**
     * 排序
     */
    private Integer sort;
    
    /**
     * 文章数量（冗余字段）
     */
    private Integer articleCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 创建分类
     */
    public static Category create(String name, String slug, String description) {
        return Category.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .sort(0)
                .articleCount(0)
                .createdAt(LocalDateTime.now())
                .build();
    }
    
    /**
     * 更新信息
     */
    public void update(String name, String slug, String description) {
        this.name = name;
        this.slug = slug;
        this.description = description;
    }
}
