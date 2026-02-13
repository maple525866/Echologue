package com.echologue.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.echologue.infrastructure.persistence.po.ArticleTagPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文章标签关联Mapper
 *
 * @author Echologue
 */
@Mapper
public interface ArticleTagMapper extends BaseMapper<ArticleTagPO> {
}
