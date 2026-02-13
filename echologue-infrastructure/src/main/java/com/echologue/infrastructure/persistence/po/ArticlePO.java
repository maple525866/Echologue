package com.echologue.infrastructure.persistence.po;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章持久化对象
 *
 * @author Echologue
 */
@Data
@TableName("article")
public class ArticlePO {
    
    /**
     * 文章ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 作者ID
     */
    private Long authorId;
    
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
     * 内容类型
     */
    private String contentType;
    
    /**
     * 状态
     */
    private String status;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
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
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    /**
     * 乐观锁版本号
     */
    @Version
    private Integer version;
}
