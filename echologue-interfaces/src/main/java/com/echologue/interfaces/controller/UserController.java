package com.echologue.interfaces.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import com.echologue.application.user.UserApplicationService;
import com.echologue.application.user.dto.UserDTO;
import com.echologue.application.user.dto.UserLoginCmd;
import com.echologue.application.user.dto.UserRegisterCmd;
import com.echologue.interfaces.dto.request.UserLoginRequest;
import com.echologue.interfaces.dto.request.UserRegisterRequest;
import com.echologue.interfaces.dto.response.UserInfoResponse;
import com.echologue.types.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 *
 * @author Echologue
 */
@Tag(name = "用户管理", description = "用户注册、登录、信息查询")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    /**
     * 用户注册
     */
    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<Long> register(@Valid @RequestBody UserRegisterRequest request) {
        UserRegisterCmd cmd = new UserRegisterCmd();
        cmd.setUsername(request.getUsername());
        cmd.setEmail(request.getEmail());
        cmd.setPassword(request.getPassword());
        
        Long userId = userApplicationService.register(cmd);
        return Result.success("注册成功", userId);
    }
    
    /**
     * 用户登录
     */
    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<String> login(@Valid @RequestBody UserLoginRequest request) {
        UserLoginCmd cmd = new UserLoginCmd();
        cmd.setEmail(request.getEmail());
        cmd.setPassword(request.getPassword());
        
        String token = userApplicationService.login(cmd);
        return Result.success("登录成功", token);
    }
    
    /**
     * 获取当前用户信息
     */
    @Operation(summary = "获取当前用户信息", description = "需要登录")
    @GetMapping("/info")
    @SaCheckLogin
    public Result<UserInfoResponse> getUserInfo() {
        UserDTO userDTO = userApplicationService.getCurrentUserInfo();
        
        UserInfoResponse response = UserInfoResponse.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .avatar(userDTO.getAvatar())
                .bio(userDTO.getBio())
                .status(userDTO.getStatus())
                .createdAt(userDTO.getCreatedAt())
                .build();
        
        return Result.success(response);
    }
    
    /**
     * 根据ID获取用户信息
     */
    @Operation(summary = "根据ID获取用户信息")
    @GetMapping("/{userId}")
    public Result<UserInfoResponse> getUserById(@PathVariable Long userId) {
        UserDTO userDTO = userApplicationService.getUserById(userId);
        
        UserInfoResponse response = UserInfoResponse.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .avatar(userDTO.getAvatar())
                .bio(userDTO.getBio())
                .createdAt(userDTO.getCreatedAt())
                .build();
        
        return Result.success(response);
    }
    
    /**
     * 退出登录
     */
    @Operation(summary = "退出登录", description = "需要登录")
    @PostMapping("/logout")
    @SaCheckLogin
    public Result<Void> logout() {
        userApplicationService.logout();
        return Result.success("退出成功", null);
    }
}
