package com.echologue.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.echologue.infrastructure.persistence.po.UserPO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户Mapper
 *
 * @author Echologue
 */
@Mapper
public interface UserMapper extends BaseMapper<UserPO> {
}
