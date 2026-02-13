package com.echologue.domain.article.repository;

import com.echologue.domain.article.model.Article;
import com.echologue.domain.article.model.ArticleId;
import com.echologue.domain.user.model.UserId;

import java.util.List;
import java.util.Optional;

/**
 * 文章仓储接口
 *
 * @author Echologue
 */
public interface IArticleRepository {
    
    /**
     * 保存文章
     */
    Article save(Article article);
    
    /**
     * 根据ID查询文章
     */
    Optional<Article> findById(ArticleId articleId);
    
    /**
     * 根据作者ID查询文章列表（分页）
     */
    List<Article> findByAuthorId(UserId authorId, int page, int size);
    
    /**
     * 查询已发布文章列表（分页）
     */
    List<Article> findPublished(int page, int size);
    
    /**
     * 统计已发布文章总数
     */
    Long countPublished();
    
    /**
     * 统计作者文章总数
     */
    Long countByAuthorId(UserId authorId);
    
    /**
     * 根据分类ID查询文章列表
     */
    List<Article> findByCategoryId(Long categoryId, int page, int size);
    
    /**
     * 删除文章
     */
    void deleteById(ArticleId articleId);
}
