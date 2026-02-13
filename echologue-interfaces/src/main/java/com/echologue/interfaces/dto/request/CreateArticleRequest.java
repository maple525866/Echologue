package com.echologue.interfaces.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 创建文章请求
 *
 * @author Echologue
 */
@Data
@Schema(description = "创建文章请求")
public class CreateArticleRequest {
    
    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题", example = "我的第一篇博客")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    @Schema(description = "内容（Markdown格式）")
    private String content;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "封面图URL")
    private String cover;
    
    @Schema(description = "分类ID")
    private Long categoryId;
    
    @Schema(description = "标签ID列表")
    private List<Long> tagIds;
}
