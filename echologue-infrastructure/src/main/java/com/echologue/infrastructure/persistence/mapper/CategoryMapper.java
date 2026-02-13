package com.echologue.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.echologue.infrastructure.persistence.po.CategoryPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 分类Mapper
 *
 * @author Echologue
 */
@Mapper
public interface CategoryMapper extends BaseMapper<CategoryPO> {
}
