package com.echologue.domain.user.repository;

import com.echologue.domain.user.model.Email;
import com.echologue.domain.user.model.User;
import com.echologue.domain.user.model.UserId;
import com.echologue.domain.user.model.Username;

import java.util.Optional;

/**
 * 用户仓储接口（领域层定义，基础设施层实现）
 *
 * @author Echologue
 */
public interface IUserRepository {
    
    /**
     * 保存用户
     */
    User save(User user);
    
    /**
     * 根据ID查询用户
     */
    Optional<User> findById(UserId userId);
    
    /**
     * 根据邮箱查询用户
     */
    Optional<User> findByEmail(Email email);
    
    /**
     * 根据用户名查询用户
     */
    Optional<User> findByUsername(Username username);
    
    /**
     * 邮箱是否已存在
     */
    boolean existsByEmail(Email email);
    
    /**
     * 用户名是否已存在
     */
    boolean existsByUsername(Username username);
}
