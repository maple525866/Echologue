package com.echologue.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.echologue.domain.category.model.Tag;
import com.echologue.domain.category.repository.ITagRepository;
import com.echologue.infrastructure.persistence.mapper.TagMapper;
import com.echologue.infrastructure.persistence.po.TagPO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 标签仓储实现
 *
 * @author Echologue
 */
@Repository
@RequiredArgsConstructor
public class TagRepositoryImpl implements ITagRepository {
    
    private final TagMapper tagMapper;
    
    @Override
    public Tag save(Tag tag) {
        TagPO po = convertToPO(tag);
        
        if (po.getId() == null) {
            tagMapper.insert(po);
        } else {
            tagMapper.updateById(po);
        }
        
        return convertToDomain(po);
    }
    
    @Override
    public Optional<Tag> findById(Long id) {
        TagPO po = tagMapper.selectById(id);
        return Optional.ofNullable(po).map(this::convertToDomain);
    }
    
    @Override
    public List<Tag> findAll() {
        return tagMapper.selectList(null).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Tag> findByIds(List<Long> ids) {
        return tagMapper.selectBatchIds(ids).stream()
                .map(this::convertToDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long id) {
        tagMapper.deleteById(id);
    }
    
    @Override
    public boolean existsByName(String name) {
        LambdaQueryWrapper<TagPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TagPO::getName, name);
        return tagMapper.selectCount(wrapper) > 0;
    }
    
    private Tag convertToDomain(TagPO po) {
        return Tag.builder()
                .id(po.getId())
                .name(po.getName())
                .slug(po.getSlug())
                .articleCount(po.getArticleCount())
                .createdAt(po.getCreatedAt())
                .build();
    }
    
    private TagPO convertToPO(Tag tag) {
        TagPO po = new TagPO();
        po.setId(tag.getId());
        po.setName(tag.getName());
        po.setSlug(tag.getSlug());
        po.setArticleCount(tag.getArticleCount());
        po.setCreatedAt(tag.getCreatedAt());
        return po;
    }
}
