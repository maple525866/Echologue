package com.echologue.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.echologue.domain.article.model.Article;
import com.echologue.domain.article.model.ArticleId;
import com.echologue.domain.article.model.Slug;
import com.echologue.domain.article.model.Title;
import com.echologue.domain.article.repository.IArticleRepository;
import com.echologue.domain.user.model.UserId;
import com.echologue.infrastructure.persistence.mapper.ArticleMapper;
import com.echologue.infrastructure.persistence.mapper.ArticleTagMapper;
import com.echologue.infrastructure.persistence.po.ArticlePO;
import com.echologue.infrastructure.persistence.po.ArticleTagPO;
import com.echologue.types.enums.ArticleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 文章仓储实现
 *
 * @author Echologue
 */
@Repository
@RequiredArgsConstructor
public class ArticleRepositoryImpl implements IArticleRepository {
    
    private final ArticleMapper articleMapper;
    private final ArticleTagMapper articleTagMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Article save(Article article) {
        ArticlePO po = convertToPO(article);
        
        if (po.getId() == null) {
            // 新增
            articleMapper.insert(po);
        } else {
            // 更新
            articleMapper.updateById(po);
        }
        
        // 处理标签关联
        if (article.getTagIds() != null && !article.getTagIds().isEmpty()) {
            // 删除旧的标签关联
            LambdaQueryWrapper<ArticleTagPO> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ArticleTagPO::getArticleId, po.getId());
            articleTagMapper.delete(wrapper);
            
            // 插入新的标签关联
            for (Long tagId : article.getTagIds()) {
                ArticleTagPO tagPO = new ArticleTagPO(po.getId(), tagId);
                articleTagMapper.insert(tagPO);
            }
        }
        
        return convertToDomain(po, article.getTagIds());
    }
    
    @Override
    public Optional<Article> findById(ArticleId articleId) {
        ArticlePO po = articleMapper.selectById(articleId.getValue());
        if (po == null) {
            return Optional.empty();
        }
        
        // 查询标签
        List<Long> tagIds = findTagIdsByArticleId(articleId.getValue());
        
        return Optional.of(convertToDomain(po, tagIds));
    }
    
    @Override
    public List<Article> findByAuthorId(UserId authorId, int page, int size) {
        Page<ArticlePO> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ArticlePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticlePO::getAuthorId, authorId.getValue())
                .orderByDesc(ArticlePO::getCreatedAt);
        
        Page<ArticlePO> result = articleMapper.selectPage(pageParam, wrapper);
        
        return result.getRecords().stream()
                .map(po -> {
                    List<Long> tagIds = findTagIdsByArticleId(po.getId());
                    return convertToDomain(po, tagIds);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Article> findPublished(int page, int size) {
        Page<ArticlePO> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ArticlePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticlePO::getStatus, ArticleStatus.PUBLISHED.getCode())
                .orderByDesc(ArticlePO::getPublishedAt);
        
        Page<ArticlePO> result = articleMapper.selectPage(pageParam, wrapper);
        
        return result.getRecords().stream()
                .map(po -> {
                    List<Long> tagIds = findTagIdsByArticleId(po.getId());
                    return convertToDomain(po, tagIds);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    public Long countPublished() {
        LambdaQueryWrapper<ArticlePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticlePO::getStatus, ArticleStatus.PUBLISHED.getCode());
        return articleMapper.selectCount(wrapper);
    }
    
    @Override
    public Long countByAuthorId(UserId authorId) {
        LambdaQueryWrapper<ArticlePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticlePO::getAuthorId, authorId.getValue());
        return articleMapper.selectCount(wrapper);
    }
    
    @Override
    public List<Article> findByCategoryId(Long categoryId, int page, int size) {
        Page<ArticlePO> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ArticlePO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticlePO::getCategoryId, categoryId)
                .eq(ArticlePO::getStatus, ArticleStatus.PUBLISHED.getCode())
                .orderByDesc(ArticlePO::getPublishedAt);
        
        Page<ArticlePO> result = articleMapper.selectPage(pageParam, wrapper);
        
        return result.getRecords().stream()
                .map(po -> {
                    List<Long> tagIds = findTagIdsByArticleId(po.getId());
                    return convertToDomain(po, tagIds);
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteById(ArticleId articleId) {
        // 删除文章
        articleMapper.deleteById(articleId.getValue());
        
        // 删除标签关联
        LambdaQueryWrapper<ArticleTagPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticleTagPO::getArticleId, articleId.getValue());
        articleTagMapper.delete(wrapper);
    }
    
    /**
     * 查询文章的标签ID列表
     */
    private List<Long> findTagIdsByArticleId(Long articleId) {
        LambdaQueryWrapper<ArticleTagPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArticleTagPO::getArticleId, articleId);
        return articleTagMapper.selectList(wrapper).stream()
                .map(ArticleTagPO::getTagId)
                .collect(Collectors.toList());
    }
    
    /**
     * PO转Domain
     */
    private Article convertToDomain(ArticlePO po, List<Long> tagIds) {
        return Article.builder()
                .id(ArticleId.of(po.getId()))
                .authorId(UserId.of(po.getAuthorId()))
                .title(Title.of(po.getTitle()))
                .slug(Slug.of(po.getSlug()))
                .summary(po.getSummary())
                .cover(po.getCover())
                .content(po.getContent())
                .contentType(po.getContentType())
                .status(ArticleStatus.of(po.getStatus()))
                .categoryId(po.getCategoryId())
                .tagIds(tagIds)
                .views(po.getViews())
                .likes(po.getLikes())
                .commentCount(po.getCommentCount())
                .publishedAt(po.getPublishedAt())
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .version(po.getVersion())
                .build();
    }
    
    /**
     * Domain转PO
     */
    private ArticlePO convertToPO(Article article) {
        ArticlePO po = new ArticlePO();
        if (article.getId() != null) {
            po.setId(article.getId().getValue());
        }
        po.setAuthorId(article.getAuthorId().getValue());
        po.setTitle(article.getTitle().getValue());
        po.setSlug(article.getSlug().getValue());
        po.setSummary(article.getSummary());
        po.setCover(article.getCover());
        po.setContent(article.getContent());
        po.setContentType(article.getContentType());
        po.setStatus(article.getStatus().getCode());
        po.setCategoryId(article.getCategoryId());
        po.setViews(article.getViews());
        po.setLikes(article.getLikes());
        po.setCommentCount(article.getCommentCount());
        po.setPublishedAt(article.getPublishedAt());
        po.setCreatedAt(article.getCreatedAt());
        po.setUpdatedAt(article.getUpdatedAt());
        po.setVersion(article.getVersion());
        return po;
    }
}
