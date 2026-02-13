package com.echologue.application.article.dto;

import lombok.Data;

import java.util.List;

/**
 * 创建文章命令
 *
 * @author Echologue
 */
@Data
public class CreateArticleCmd {
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 摘要
     */
    private String summary;
    
    /**
     * 封面图
     */
    private String cover;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 标签ID列表
     */
    private List<Long> tagIds;
}
