package com.echologue.application.category;

import com.echologue.domain.category.model.Tag;
import com.echologue.domain.category.repository.ITagRepository;
import com.echologue.types.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 标签应用服务
 *
 * @author Echologue
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TagApplicationService {
    
    private final ITagRepository tagRepository;
    
    /**
     * 创建标签
     */
    @Transactional(rollbackFor = Exception.class)
    public Long createTag(String name, String slug) {
        // 检查名称是否已存在
        if (tagRepository.existsByName(name)) {
            throw new BusinessException("标签名称已存在");
        }
        
        Tag tag = Tag.create(name, slug);
        Tag saved = tagRepository.save(tag);
        
        log.info("创建标签成功，标签ID：{}", saved.getId());
        return saved.getId();
    }
    
    /**
     * 更新标签
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateTag(Long id, String name, String slug) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException("标签不存在"));
        
        tag.update(name, slug);
        tagRepository.save(tag);
        
        log.info("更新标签成功，标签ID：{}", id);
    }
    
    /**
     * 删除标签
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
        log.info("删除标签成功，标签ID：{}", id);
    }
    
    /**
     * 查询所有标签
     */
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }
    
    /**
     * 根据ID查询标签
     */
    public Tag getTagById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new BusinessException("标签不存在"));
    }
    
    /**
     * 根据ID列表查询标签
     */
    public List<Tag> getTagsByIds(List<Long> ids) {
        return tagRepository.findByIds(ids);
    }
}
