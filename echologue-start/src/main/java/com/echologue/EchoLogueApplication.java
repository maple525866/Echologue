package com.echologue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Echologue 启动类
 * Notion风格简洁博客系统 - DDD架构
 *
 * @author Echologue
 */
@SpringBootApplication
public class EchoLogueApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(EchoLogueApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("    Echologue 启动成功！");
        System.out.println("    Swagger文档: http://localhost:8080/swagger-ui/index.html");
        System.out.println("========================================\n");
    }
}
