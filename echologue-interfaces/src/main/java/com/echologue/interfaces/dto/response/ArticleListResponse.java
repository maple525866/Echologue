package com.echologue.interfaces.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章列表响应
 *
 * @author Echologue
 */
@Data
@Builder
@Schema(description = "文章列表响应")
public class ArticleListResponse {
    
    @Schema(description = "文章ID")
    private Long id;
    
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
    
    @Schema(description = "状态")
    private String status;
    
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
}
