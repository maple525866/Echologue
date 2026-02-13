package com.echologue.domain.article.model;

import com.echologue.domain.user.model.UserId;
import com.echologue.types.enums.ArticleStatus;
import com.echologue.types.exception.BusinessException;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章聚合根
 *
 * @author Echologue
 */
@Data
@Builder
public class Article {
    
    /**
     * 文章ID
     */
    private ArticleId id;
    
    /**
     * 作者ID
     */
    private UserId authorId;
    
    /**
     * 标题
     */
    private Title title;
    
    /**
     * URL别名
     */
    private Slug slug;
    
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
     * 内容类型（markdown/json）
     */
    private String contentType;
    
    /**
     * 状态
     */
    private ArticleStatus status;
    
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
    
    /**
     * 版本号（乐观锁）
     */
    private Integer version;
    
    /**
     * 创建文章（草稿）
     */
    public static Article create(UserId authorId, Title title, String content) {
        return Article.builder()
                .authorId(authorId)
                .title(title)
                .slug(Slug.generate())
                .content(content)
                .contentType("markdown")
                .status(ArticleStatus.DRAFT)
                .views(0)
                .likes(0)
                .commentCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .version(0)
                .build();
    }
    
    /**
     * 发布文章
     */
    public void publish() {
        if (this.status == ArticleStatus.PUBLISHED) {
            throw new BusinessException("文章已发布，无法重复发布");
        }
        this.status = ArticleStatus.PUBLISHED;
        this.publishedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 取消发布（变为草稿）
     */
    public void unpublish() {
        if (this.status == ArticleStatus.DRAFT) {
            throw new BusinessException("文章尚未发布");
        }
        this.status = ArticleStatus.DRAFT;
        this.publishedAt = null;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 归档文章
     */
    public void archive() {
        this.status = ArticleStatus.ARCHIVED;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 更新内容
     */
    public void updateContent(Title title, String content, String summary, String cover) {
        this.title = title;
        this.content = content;
        this.summary = summary;
        this.cover = cover;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 更新分类
     */
    public void updateCategory(Long categoryId) {
        this.categoryId = categoryId;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 更新标签
     */
    public void updateTags(List<Long> tagIds) {
        this.tagIds = tagIds;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * 增加浏览量
     */
    public void incrementViews() {
        this.views++;
    }
    
    /**
     * 增加点赞数
     */
    public void incrementLikes() {
        this.likes++;
    }
    
    /**
     * 减少点赞数
     */
    public void decrementLikes() {
        if (this.likes > 0) {
            this.likes--;
        }
    }
    
    /**
     * 判断是否为草稿
     */
    public boolean isDraft() {
        return this.status == ArticleStatus.DRAFT;
    }
    
    /**
     * 判断是否已发布
     */
    public boolean isPublished() {
        return this.status == ArticleStatus.PUBLISHED;
    }
    
    /**
     * 检查是否为作者本人
     */
    public boolean isAuthor(UserId userId) {
        return this.authorId.equals(userId);
    }
}
