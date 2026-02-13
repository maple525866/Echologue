package com.echologue.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.echologue.infrastructure.persistence.po.ArticlePO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 文章Mapper
 *
 * @author Echologue
 */
@Mapper
public interface ArticleMapper extends BaseMapper<ArticlePO> {
}
