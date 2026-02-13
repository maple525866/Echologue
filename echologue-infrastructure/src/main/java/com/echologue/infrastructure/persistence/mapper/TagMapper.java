package com.echologue.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.echologue.infrastructure.persistence.po.TagPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 标签Mapper
 *
 * @author Echologue
 */
@Mapper
public interface TagMapper extends BaseMapper<TagPO> {
}
