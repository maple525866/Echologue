package com.echologue.application.article.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章DTO
 *
 * @author Echologue
 */
@Data
@Builder
public class ArticleDTO {
    
    /**
     * 文章ID
     */
    private Long id;
    
    /**
     * 作者ID
     */
    private Long authorId;
    
    /**
     * 作者名称
     */
    private String authorName;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * URL别名
     */
    private String slug;
    
    /**
     * 摘要
     */
    private String summary;
    
    /**
     * 封面图
     */
    private String cover;
    
    /**
     * 文章内容
     */
    private String content;
    
    /**
     * 状态
     */
    private String status;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 标签ID列表
     */
    private List<Long> tagIds;
    
    /**
     * 浏览量
     */
    private Integer views;
    
    /**
     * 点赞数
     */
    private Integer likes;
    
    /**
     * 评论数
     */
    private Integer commentCount;
    
    /**
     * 发布时间
     */
    private LocalDateTime publishedAt;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
