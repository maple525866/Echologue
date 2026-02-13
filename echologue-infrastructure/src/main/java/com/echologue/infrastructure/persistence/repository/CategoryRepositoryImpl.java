package com.echologue.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.echologue.domain.category.model.Category;
import com.echologue.domain.category.repository.ICategoryRepository;
import com.echologue.infrastructure.persistence.mapper.CategoryMapper;
import com.echologue.infrastructure.persistence.po.CategoryPO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 分类仓储实现
 *
 * @author Echologue
 */
@Repository
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements ICategoryRepository {
    
    private final CategoryMapper categoryMapper;
    
    @Override
    public Category save(Category category) {
        CategoryPO po = convertToPO(category);
        
        if (po.getId() == null) {
            categoryMapper.insert(po);
        } else {
            categoryMapper.updateById(po);
        }
        
        return convertToDomain(po);
    }
    
    @Override
    public Optional<Category> findById(Long id) {
        CategoryPO po = categoryMapper.selectById(id);
        return Optional.ofNullable(po).map(this::convertToDomain);
    }
    
    @Override
    public List<Category> findAll() {
        LambdaQueryWrapper<CategoryPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(CategoryPO::getSort);
        return categoryMapper.selectList(wrapper).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        categoryMapper.deleteById(id);
    }
    
    @Override
    public boolean existsByName(String name) {
        LambdaQueryWrapper<CategoryPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CategoryPO::getName, name);
        return categoryMapper.selectCount(wrapper) > 0;
    }
    
    private Category convertToDomain(CategoryPO po) {
        return Category.builder()
                .id(po.getId())
                .name(po.getName())
                .slug(po.getSlug())
                .description(po.getDescription())
                .sort(po.getSort())
                .articleCount(po.getArticleCount())
                .createdAt(po.getCreatedAt())
                .build();
    }
    
    private CategoryPO convertToPO(Category category) {
        CategoryPO po = new CategoryPO();
        po.setId(category.getId());
        po.setName(category.getName());
        po.setSlug(category.getSlug());
        po.setDescription(category.getDescription());
        po.setSort(category.getSort());
        po.setArticleCount(category.getArticleCount());
        po.setCreatedAt(category.getCreatedAt());
        return po;
    }
}
