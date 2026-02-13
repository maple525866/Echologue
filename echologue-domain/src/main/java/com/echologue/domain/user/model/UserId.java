package com.echologue.domain.user.model;

import lombok.Value;

/**
 * 用户ID值对象
 *
 * @author Echologue
 */
@Value
public class UserId {
    
    Long value;
    
    public static UserId of(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("用户ID不能为空或小于等于0");
        }
        return new UserId(id);
    }
}
