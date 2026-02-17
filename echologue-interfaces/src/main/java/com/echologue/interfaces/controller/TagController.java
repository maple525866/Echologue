package com.echologue.interfaces.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import com.echologue.application.category.TagApplicationService;
import com.echologue.domain.category.model.Tag;
import com.echologue.types.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 标签控制器
 *
 * @author Echologue
 */
@io.swagger.v3.oas.annotations.tags.Tag(name = "标签管理", description = "标签的CRUD")
@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {
    
    private final TagApplicationService tagApplicationService;
    
    /**
     * 创建标签
     */
    @Operation(summary = "创建标签", description = "需要登录")
    @PostMapping
    @SaCheckLogin
    public Result<Long> createTag(@RequestParam(name = "name") String name,
                                   @RequestParam(name = "slug") String slug) {
        Long id = tagApplicationService.createTag(name, slug);
        return Result.success("创建成功", id);
    }
    
    /**
     * 更新标签
     */
    @Operation(summary = "更新标签", description = "需要登录")
    @PutMapping("/{id}")
    @SaCheckLogin
    public Result<Void> updateTag(@PathVariable(name = "id") Long id,
                                   @RequestParam(name = "name") String name,
                                   @RequestParam(name = "slug") String slug) {
        tagApplicationService.updateTag(id, name, slug);
        return Result.success("更新成功", null);
    }
    
    /**
     * 删除标签
     */
    @Operation(summary = "删除标签", description = "需要登录")
    @DeleteMapping("/{id}")
    @SaCheckLogin
    public Result<Void> deleteTag(@PathVariable(name = "id") Long id) {
        tagApplicationService.deleteTag(id);
        return Result.success("删除成功", null);
    }
    
    /**
     * 查询所有标签
     */
    @Operation(summary = "查询所有标签")
    @GetMapping
    public Result<List<Tag>> getAllTags() {
        List<Tag> tags = tagApplicationService.getAllTags();
        return Result.success(tags);
    }
    
    /**
     * 根据ID查询标签
     */
    @Operation(summary = "根据ID查询标签")
    @GetMapping("/{id}")
    public Result<Tag> getTagById(@PathVariable(name = "id") Long id) {
        Tag tag = tagApplicationService.getTagById(id);
        return Result.success(tag);
    }
}
