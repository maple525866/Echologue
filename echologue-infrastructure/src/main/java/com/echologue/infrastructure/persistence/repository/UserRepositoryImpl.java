package com.echologue.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.echologue.domain.user.model.*;
import com.echologue.domain.user.repository.IUserRepository;
import com.echologue.infrastructure.persistence.mapper.UserMapper;
import com.echologue.infrastructure.persistence.po.UserPO;
import com.echologue.types.enums.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户仓储实现
 *
 * @author Echologue
 */
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements IUserRepository {
    
    private final UserMapper userMapper;
    
    @Override
    public User save(User user) {
        UserPO po = convertToPO(user);
        
        if (po.getId() == null) {
            // 新增
            userMapper.insert(po);
        } else {
            // 更新
            userMapper.updateById(po);
        }
        
        return convertToDomain(po);
    }
    
    @Override
    public Optional<User> findById(UserId userId) {
        UserPO po = userMapper.selectById(userId.getValue());
        return Optional.ofNullable(po).map(this::convertToDomain);
    }
    
    @Override
    public Optional<User> findByEmail(Email email) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getEmail, email.getValue());
        UserPO po = userMapper.selectOne(wrapper);
        return Optional.ofNullable(po).map(this::convertToDomain);
    }
    
    @Override
    public Optional<User> findByUsername(Username username) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getUsername, username.getValue());
        UserPO po = userMapper.selectOne(wrapper);
        return Optional.ofNullable(po).map(this::convertToDomain);
    }
    
    @Override
    public boolean existsByEmail(Email email) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getEmail, email.getValue());
        return userMapper.selectCount(wrapper) > 0;
    }
    
    @Override
    public boolean existsByUsername(Username username) {
        LambdaQueryWrapper<UserPO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserPO::getUsername, username.getValue());
        return userMapper.selectCount(wrapper) > 0;
    }
    
    /**
     * PO转Domain
     */
    private User convertToDomain(UserPO po) {
        return User.builder()
                .id(UserId.of(po.getId()))
                .username(Username.of(po.getUsername()))
                .email(Email.of(po.getEmail()))
                .password(Password.fromEncrypted(po.getPassword()))
                .avatar(po.getAvatar())
                .bio(po.getBio())
                .status(UserStatus.of(po.getStatus()))
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .build();
    }
    
    /**
     * Domain转PO
     */
    private UserPO convertToPO(User user) {
        UserPO po = new UserPO();
        if (user.getId() != null) {
            po.setId(user.getId().getValue());
        }
        po.setUsername(user.getUsername().getValue());
        po.setEmail(user.getEmail().getValue());
        po.setPassword(user.getPassword().getEncryptedValue());
        po.setAvatar(user.getAvatar());
        po.setBio(user.getBio());
        po.setStatus(user.getStatus().getCode());
        po.setCreatedAt(user.getCreatedAt());
        po.setUpdatedAt(user.getUpdatedAt());
        return po;
    }
}
