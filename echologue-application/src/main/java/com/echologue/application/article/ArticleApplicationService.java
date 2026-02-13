package com.echologue.application.article;

import cn.dev33.satoken.stp.StpUtil;
import com.echologue.application.article.dto.ArticleDTO;
import com.echologue.application.article.dto.CreateArticleCmd;
import com.echologue.application.article.dto.UpdateArticleCmd;
import com.echologue.application.user.UserApplicationService;
import com.echologue.application.user.dto.UserDTO;
import com.echologue.domain.article.model.Article;
import com.echologue.domain.article.model.ArticleId;
import com.echologue.domain.article.model.Title;
import com.echologue.domain.article.repository.IArticleRepository;
import com.echologue.domain.user.model.UserId;
import com.echologue.types.common.PageResult;
import com.echologue.types.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章应用服务
 *
 * @author Echologue
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleApplicationService {
    
    private final IArticleRepository articleRepository;
    private final UserApplicationService userApplicationService;
    
    /**
     * 创建文章
     */
    @Transactional(rollbackFor = Exception.class)
    public Long createArticle(CreateArticleCmd cmd) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId authorId = UserId.of(currentUserId);
        
        // 2. 创建文章聚合
        Title title = Title.of(cmd.getTitle());
        Article article = Article.create(authorId, title, cmd.getContent());
        
        // 3. 设置其他属性
        article.setSummary(cmd.getSummary());
        article.setCover(cmd.getCover());
        article.setCategoryId(cmd.getCategoryId());
        article.setTagIds(cmd.getTagIds());
        
        // 4. 保存文章
        Article savedArticle = articleRepository.save(article);
        
        log.info("创建文章成功，文章ID：{}", savedArticle.getId().getValue());
        return savedArticle.getId().getValue();
    }
    
    /**
     * 更新文章
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateArticle(UpdateArticleCmd cmd) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId userId = UserId.of(currentUserId);
        
        // 2. 查询文章
        Article article = articleRepository.findById(ArticleId.of(cmd.getArticleId()))
                .orElseThrow(() -> new BusinessException("文章不存在"));
        
        // 3. 校验作者权限
        if (!article.isAuthor(userId)) {
            throw new BusinessException("无权限修改此文章");
        }
        
        // 4. 更新内容
        Title title = Title.of(cmd.getTitle());
        article.updateContent(title, cmd.getContent(), cmd.getSummary(), cmd.getCover());
        article.updateCategory(cmd.getCategoryId());
        article.updateTags(cmd.getTagIds());
        
        // 5. 保存
        articleRepository.save(article);
        
        log.info("更新文章成功，文章ID：{}", cmd.getArticleId());
    }
    
    /**
     * 发布文章
     */
    @Transactional(rollbackFor = Exception.class)
    public void publishArticle(Long articleId) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId userId = UserId.of(currentUserId);
        
        // 2. 查询文章
        Article article = articleRepository.findById(ArticleId.of(articleId))
                .orElseThrow(() -> new BusinessException("文章不存在"));
        
        // 3. 校验作者权限
        if (!article.isAuthor(userId)) {
            throw new BusinessException("无权限发布此文章");
        }
        
        // 4. 发布
        article.publish();
        articleRepository.save(article);
        
        log.info("发布文章成功，文章ID：{}", articleId);
    }
    
    /**
     * 取消发布
     */
    @Transactional(rollbackFor = Exception.class)
    public void unpublishArticle(Long articleId) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId userId = UserId.of(currentUserId);
        
        // 2. 查询文章
        Article article = articleRepository.findById(ArticleId.of(articleId))
                .orElseThrow(() -> new BusinessException("文章不存在"));
        
        // 3. 校验作者权限
        if (!article.isAuthor(userId)) {
            throw new BusinessException("无权限操作此文章");
        }
        
        // 4. 取消发布
        article.unpublish();
        articleRepository.save(article);
        
        log.info("取消发布文章成功，文章ID：{}", articleId);
    }
    
    /**
     * 删除文章
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteArticle(Long articleId) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId userId = UserId.of(currentUserId);
        
        // 2. 查询文章
        Article article = articleRepository.findById(ArticleId.of(articleId))
                .orElseThrow(() -> new BusinessException("文章不存在"));
        
        // 3. 校验作者权限
        if (!article.isAuthor(userId)) {
            throw new BusinessException("无权限删除此文章");
        }
        
        // 4. 删除
        articleRepository.deleteById(ArticleId.of(articleId));
        
        log.info("删除文章成功，文章ID：{}", articleId);
    }
    
    /**
     * 获取文章详情
     */
    public ArticleDTO getArticleDetail(Long articleId) {
        // 1. 查询文章
        Article article = articleRepository.findById(ArticleId.of(articleId))
                .orElseThrow(() -> new BusinessException("文章不存在"));
        
        // 2. 增加浏览量
        article.incrementViews();
        articleRepository.save(article);
        
        // 3. 转换为DTO
        return convertToDTO(article);
    }
    
    /**
     * 获取已发布文章列表
     */
    public PageResult<ArticleDTO> getPublishedArticles(int page, int size) {
        // 1. 查询文章列表
        List<Article> articles = articleRepository.findPublished(page, size);
        Long total = articleRepository.countPublished();
        
        // 2. 转换为DTO
        List<ArticleDTO> articleDTOs = articles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // 3. 返回分页结果
        return PageResult.of(articleDTOs, total, (long) page, (long) size);
    }
    
    /**
     * 获取当前用户的文章列表
     */
    public PageResult<ArticleDTO> getMyArticles(int page, int size) {
        // 1. 获取当前用户ID
        Long currentUserId = StpUtil.getLoginIdAsLong();
        UserId authorId = UserId.of(currentUserId);
        
        // 2. 查询文章列表
        List<Article> articles = articleRepository.findByAuthorId(authorId, page, size);
        Long total = articleRepository.countByAuthorId(authorId);
        
        // 3. 转换为DTO
        List<ArticleDTO> articleDTOs = articles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // 4. 返回分页结果
        return PageResult.of(articleDTOs, total, (long) page, (long) size);
    }
    
    /**
     * 转换为DTO
     */
    private ArticleDTO convertToDTO(Article article) {
        // 查询作者信息
        UserDTO author = userApplicationService.getUserById(article.getAuthorId().getValue());
        
        return ArticleDTO.builder()
                .id(article.getId().getValue())
                .authorId(article.getAuthorId().getValue())
                .authorName(author.getUsername())
                .title(article.getTitle().getValue())
                .slug(article.getSlug().getValue())
                .summary(article.getSummary())
                .cover(article.getCover())
                .content(article.getContent())
                .status(article.getStatus().getCode())
                .categoryId(article.getCategoryId())
                .tagIds(article.getTagIds())
                .views(article.getViews())
                .likes(article.getLikes())
                .commentCount(article.getCommentCount())
                .publishedAt(article.getPublishedAt())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }
}
