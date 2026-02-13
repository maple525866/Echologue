package com.echologue.interfaces.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import com.echologue.application.category.CategoryApplicationService;
import com.echologue.domain.category.model.Category;
import com.echologue.types.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类控制器
 *
 * @author Echologue
 */
@Tag(name = "分类管理", description = "分类的CRUD")
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryApplicationService categoryApplicationService;
    
    /**
     * 创建分类
     */
    @Operation(summary = "创建分类", description = "需要登录")
    @PostMapping
    @SaCheckLogin
    public Result<Long> createCategory(@RequestParam String name,
                                        @RequestParam String slug,
                                        @RequestParam(required = false) String description) {
        Long id = categoryApplicationService.createCategory(name, slug, description);
        return Result.success("创建成功", id);
    }
    
    /**
     * 更新分类
     */
    @Operation(summary = "更新分类", description = "需要登录")
    @PutMapping("/{id}")
    @SaCheckLogin
    public Result<Void> updateCategory(@PathVariable Long id,
                                        @RequestParam String name,
                                        @RequestParam String slug,
                                        @RequestParam(required = false) String description) {
        categoryApplicationService.updateCategory(id, name, slug, description);
        return Result.success("更新成功", null);
    }
    
    /**
     * 删除分类
     */
    @Operation(summary = "删除分类", description = "需要登录")
    @DeleteMapping("/{id}")
    @SaCheckLogin
    public Result<Void> deleteCategory(@PathVariable Long id) {
        categoryApplicationService.deleteCategory(id);
        return Result.success("删除成功", null);
    }
    
    /**
     * 查询所有分类
     */
    @Operation(summary = "查询所有分类")
    @GetMapping
    public Result<List<Category>> getAllCategories() {
        List<Category> categories = categoryApplicationService.getAllCategories();
        return Result.success(categories);
    }
    
    /**
     * 根据ID查询分类
     */
    @Operation(summary = "根据ID查询分类")
    @GetMapping("/{id}")
    public Result<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryApplicationService.getCategoryById(id);
        return Result.success(category);
    }
}
