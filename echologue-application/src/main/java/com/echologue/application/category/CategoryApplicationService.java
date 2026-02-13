package com.echologue.application.category;

import com.echologue.domain.category.model.Category;
import com.echologue.domain.category.repository.ICategoryRepository;
import com.echologue.types.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 分类应用服务
 *
 * @author Echologue
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryApplicationService {
    
    private final ICategoryRepository categoryRepository;
    
    /**
     * 创建分类
     */
    @Transactional(rollbackFor = Exception.class)
    public Long createCategory(String name, String slug, String description) {
        // 检查名称是否已存在
        if (categoryRepository.existsByName(name)) {
            throw new BusinessException("分类名称已存在");
        }
        
        Category category = Category.create(name, slug, description);
        Category saved = categoryRepository.save(category);
        
        log.info("创建分类成功，分类ID：{}", saved.getId());
        return saved.getId();
    }
    
    /**
     * 更新分类
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateCategory(Long id, String name, String slug, String description) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("分类不存在"));
        
        category.update(name, slug, description);
        categoryRepository.save(category);
        
        log.info("更新分类成功，分类ID：{}", id);
    }
    
    /**
     * 删除分类
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
        log.info("删除分类成功，分类ID：{}", id);
    }
    
    /**
     * 查询所有分类
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    /**
     * 根据ID查询分类
     */
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("分类不存在"));
    }
}
