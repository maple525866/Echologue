package com.echologue.application.user;

import cn.dev33.satoken.stp.StpUtil;
import com.echologue.application.user.dto.UserDTO;
import com.echologue.application.user.dto.UserLoginCmd;
import com.echologue.application.user.dto.UserRegisterCmd;
import com.echologue.domain.user.model.*;
import com.echologue.domain.user.repository.IUserRepository;
import com.echologue.types.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户应用服务
 *
 * @author Echologue
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserApplicationService {
    
    private final IUserRepository userRepository;
    
    /**
     * 用户注册
     */
    @Transactional(rollbackFor = Exception.class)
    public Long register(UserRegisterCmd cmd) {
        // 1. 校验用户名和邮箱是否已存在
        Username username = Username.of(cmd.getUsername());
        Email email = Email.of(cmd.getEmail());
        
        if (userRepository.existsByUsername(username)) {
            throw new BusinessException("用户名已存在");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("邮箱已被注册");
        }
        
        // 2. 创建用户聚合
        Password password = Password.create(cmd.getPassword());
        User user = User.register(username, email, password);
        
        // 3. 保存用户
        User savedUser = userRepository.save(user);
        
        log.info("用户注册成功，用户ID：{}", savedUser.getId().getValue());
        return savedUser.getId().getValue();
    }
    
    /**
     * 用户登录
     */
    public String login(UserLoginCmd cmd) {
        // 1. 根据邮箱查询用户
        Email email = Email.of(cmd.getEmail());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("邮箱或密码错误"));
        
        // 2. 校验用户状态
        if (!user.isNormal()) {
            throw new BusinessException("账号已被禁用，请联系管理员");
        }
        
        // 3. 校验密码
        if (!user.authenticate(cmd.getPassword())) {
            throw new BusinessException("邮箱或密码错误");
        }
        
        // 4. 生成Token
        Long userId = user.getId().getValue();
        StpUtil.login(userId);
        String token = StpUtil.getTokenValue();
        
        log.info("用户登录成功，用户ID：{}，Token：{}", userId, token);
        return token;
    }
    
    /**
     * 获取当前用户信息
     */
    public UserDTO getCurrentUserInfo() {
        // 1. 从Sa-Token获取当前用户ID
        Long userId = StpUtil.getLoginIdAsLong();
        
        // 2. 查询用户信息
        User user = userRepository.findById(UserId.of(userId))
                .orElseThrow(() -> new BusinessException("用户不存在"));
        
        // 3. 转换为DTO
        return convertToDTO(user);
    }
    
    /**
     * 根据ID获取用户信息
     */
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(UserId.of(userId))
                .orElseThrow(() -> new BusinessException("用户不存在"));
        
        return convertToDTO(user);
    }
    
    /**
     * 退出登录
     */
    public void logout() {
        StpUtil.logout();
        log.info("用户退出登录");
    }
    
    /**
     * 转换为DTO
     */
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId().getValue())
                .username(user.getUsername().getValue())
                .email(user.getEmail().getValue())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .status(user.getStatus().getCode())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
