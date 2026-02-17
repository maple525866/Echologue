package com.echologue.interfaces.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import com.echologue.application.article.ArticleApplicationService;
import com.echologue.application.article.dto.ArticleDTO;
import com.echologue.application.article.dto.CreateArticleCmd;
import com.echologue.application.article.dto.UpdateArticleCmd;
import com.echologue.interfaces.dto.request.CreateArticleRequest;
import com.echologue.interfaces.dto.request.UpdateArticleRequest;
import com.echologue.interfaces.dto.response.ArticleDetailResponse;
import com.echologue.interfaces.dto.response.ArticleListResponse;
import com.echologue.types.common.PageResult;
import com.echologue.types.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 文章控制器
 *
 * @author Echologue
 */
@Tag(name = "文章管理", description = "文章的CRUD、发布、查询")
@RestController
@RequestMapping("/api/article")
@RequiredArgsConstructor
public class ArticleController {
    
    private final ArticleApplicationService articleApplicationService;
    
    /**
     * 创建文章
     */
    @Operation(summary = "创建文章", description = "需要登录")
    @PostMapping
    @SaCheckLogin
    public Result<Long> createArticle(@Valid @RequestBody CreateArticleRequest request) {
        CreateArticleCmd cmd = new CreateArticleCmd();
        cmd.setTitle(request.getTitle());
        cmd.setContent(request.getContent());
        cmd.setSummary(request.getSummary());
        cmd.setCover(request.getCover());
        cmd.setCategoryId(request.getCategoryId());
        cmd.setTagIds(request.getTagIds());
        
        Long articleId = articleApplicationService.createArticle(cmd);
        return Result.success("创建成功", articleId);
    }
    
    /**
     * 更新文章
     */
    @Operation(summary = "更新文章", description = "需要登录，只能修改自己的文章")
    @PutMapping("/{id}")
    @SaCheckLogin
    public Result<Void> updateArticle(@PathVariable(name = "id") Long id, 
                                       @Valid @RequestBody UpdateArticleRequest request) {
        UpdateArticleCmd cmd = new UpdateArticleCmd();
        cmd.setArticleId(id);
        cmd.setTitle(request.getTitle());
        cmd.setContent(request.getContent());
        cmd.setSummary(request.getSummary());
        cmd.setCover(request.getCover());
        cmd.setCategoryId(request.getCategoryId());
        cmd.setTagIds(request.getTagIds());
        
        articleApplicationService.updateArticle(cmd);
        return Result.success("更新成功", null);
    }
    
    /**
     * 发布文章
     */
    @Operation(summary = "发布文章", description = "需要登录，只能发布自己的文章")
    @PostMapping("/{id}/publish")
    @SaCheckLogin
    public Result<Void> publishArticle(@PathVariable(name = "id") Long id) {
        articleApplicationService.publishArticle(id);
        return Result.success("发布成功", null);
    }
    
    /**
     * 取消发布
     */
    @Operation(summary = "取消发布", description = "需要登录，只能操作自己的文章")
    @PostMapping("/{id}/unpublish")
    @SaCheckLogin
    public Result<Void> unpublishArticle(@PathVariable(name = "id") Long id) {
        articleApplicationService.unpublishArticle(id);
        return Result.success("取消发布成功", null);
    }
    
    /**
     * 删除文章
     */
    @Operation(summary = "删除文章", description = "需要登录，只能删除自己的文章")
    @DeleteMapping("/{id}")
    @SaCheckLogin
    public Result<Void> deleteArticle(@PathVariable(name = "id") Long id) {
        articleApplicationService.deleteArticle(id);
        return Result.success("删除成功", null);
    }
    
    /**
     * 获取文章详情
     */
    @Operation(summary = "获取文章详情")
    @GetMapping("/{id}")
    public Result<ArticleDetailResponse> getArticleDetail(@PathVariable(name = "id") Long id) {
        ArticleDTO articleDTO = articleApplicationService.getArticleDetail(id);
        
        ArticleDetailResponse response = ArticleDetailResponse.builder()
                .id(articleDTO.getId())
                .authorId(articleDTO.getAuthorId())
                .authorName(articleDTO.getAuthorName())
                .title(articleDTO.getTitle())
                .slug(articleDTO.getSlug())
                .summary(articleDTO.getSummary())
                .cover(articleDTO.getCover())
                .content(articleDTO.getContent())
                .status(articleDTO.getStatus())
                .categoryId(articleDTO.getCategoryId())
                .tagIds(articleDTO.getTagIds())
                .views(articleDTO.getViews())
                .likes(articleDTO.getLikes())
                .commentCount(articleDTO.getCommentCount())
                .publishedAt(articleDTO.getPublishedAt())
                .createdAt(articleDTO.getCreatedAt())
                .updatedAt(articleDTO.getUpdatedAt())
                .build();
        
        return Result.success(response);
    }
    
    /**
     * 获取已发布文章列表
     */
    @Operation(summary = "获取已发布文章列表", description = "分页查询")
    @GetMapping
    public Result<PageResult<ArticleListResponse>> getPublishedArticles(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        PageResult<ArticleDTO> pageResult = articleApplicationService.getPublishedArticles(page, size);
        
        List<ArticleListResponse> responseList = pageResult.getRecords().stream()
                .map(dto -> ArticleListResponse.builder()
                        .id(dto.getId())
                        .authorName(dto.getAuthorName())
                        .title(dto.getTitle())
                        .slug(dto.getSlug())
                        .summary(dto.getSummary())
                        .cover(dto.getCover())
                        .status(dto.getStatus())
                        .views(dto.getViews())
                        .likes(dto.getLikes())
                        .commentCount(dto.getCommentCount())
                        .publishedAt(dto.getPublishedAt())
                        .createdAt(dto.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        
        PageResult<ArticleListResponse> result = PageResult.of(
                responseList, 
                pageResult.getTotal(), 
                pageResult.getPage(), 
                pageResult.getSize()
        );
        
        return Result.success(result);
    }
    
    /**
     * 获取我的文章列表
     */
    @Operation(summary = "获取我的文章列表", description = "需要登录，查询当前用户的文章")
    @GetMapping("/my")
    @SaCheckLogin
    public Result<PageResult<ArticleListResponse>> getMyArticles(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        
        PageResult<ArticleDTO> pageResult = articleApplicationService.getMyArticles(page, size);
        
        List<ArticleListResponse> responseList = pageResult.getRecords().stream()
                .map(dto -> ArticleListResponse.builder()
                        .id(dto.getId())
                        .authorName(dto.getAuthorName())
                        .title(dto.getTitle())
                        .slug(dto.getSlug())
                        .summary(dto.getSummary())
                        .cover(dto.getCover())
                        .status(dto.getStatus())
                        .views(dto.getViews())
                        .likes(dto.getLikes())
                        .commentCount(dto.getCommentCount())
                        .publishedAt(dto.getPublishedAt())
                        .createdAt(dto.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        
        PageResult<ArticleListResponse> result = PageResult.of(
                responseList,
                pageResult.getTotal(),
                pageResult.getPage(),
                pageResult.getSize()
        );
        
        return Result.success(result);
    }
}
