package com.echologue.interfaces.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章详情响应
 *
 * @author Echologue
 */
@Data
@Builder
@Schema(description = "文章详情响应")
public class ArticleDetailResponse {
    
    @Schema(description = "文章ID")
    private Long id;
    
    @Schema(description = "作者ID")
    private Long authorId;
    
    @Schema(description = "作者名称")
    private String authorName;
    
    @Schema(description = "标题")
    private String title;
    
    @Schema(description = "URL别名")
    private String slug;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "封面图")
    private String cover;
    
    @Schema(description = "文章内容")
    private String content;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "分类ID")
    private Long categoryId;
    
    @Schema(description = "标签ID列表")
    private List<Long> tagIds;
    
    @Schema(description = "浏览量")
    private Integer views;
    
    @Schema(description = "点赞数")
    private Integer likes;
    
    @Schema(description = "评论数")
    private Integer commentCount;
    
    @Schema(description = "发布时间")
    private LocalDateTime publishedAt;
    
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
    
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
