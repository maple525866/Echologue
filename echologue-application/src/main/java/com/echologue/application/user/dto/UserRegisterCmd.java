package com.echologue.application.user.dto;

import lombok.Data;

/**
 * 用户注册命令
 *
 * @author Echologue
 */
@Data
public class UserRegisterCmd {
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 密码
     */
    private String password;
}
