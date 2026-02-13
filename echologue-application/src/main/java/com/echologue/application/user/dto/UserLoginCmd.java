package com.echologue.application.user.dto;

import lombok.Data;

/**
 * 用户登录命令
 *
 * @author Echologue
 */
@Data
public class UserLoginCmd {
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 密码
     */
    private String password;
}
