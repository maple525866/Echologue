package com.echologue.domain.category.repository;

import com.echologue.domain.category.model.Tag;

import java.util.List;
import java.util.Optional;

/**
 * 标签仓储接口
 *
 * @author Echologue
 */
public interface ITagRepository {
    
    /**
     * 保存标签
     */
    Tag save(Tag tag);
    
    /**
     * 根据ID查询标签
     */
    Optional<Tag> findById(Long id);
    
    /**
     * 查询所有标签
     */
    List<Tag> findAll();
    
    /**
     * 根据ID列表查询标签
     */
    List<Tag> findByIds(List<Long> ids);
    
    /**
     * 删除标签
     */
    void deleteById(Long id);
    
    /**
     * 名称是否已存在
     */
    boolean existsByName(String name);
}
