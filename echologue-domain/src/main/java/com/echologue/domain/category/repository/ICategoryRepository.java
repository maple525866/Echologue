package com.echologue.domain.category.repository;

import com.echologue.domain.category.model.Category;

import java.util.List;
import java.util.Optional;

/**
 * 分类仓储接口
 *
 * @author Echologue
 */
public interface ICategoryRepository {
    
    /**
     * 保存分类
     */
    Category save(Category category);
    
    /**
     * 根据ID查询分类
     */
    Optional<Category> findById(Long id);
    
    /**
     * 查询所有分类
     */
    List<Category> findAll();
    
    /**
     * 删除分类
     */
    void deleteById(Long id);
    
    /**
     * 名称是否已存在
     */
    boolean existsByName(String name);
}
