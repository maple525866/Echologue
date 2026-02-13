-- ========================================
-- Echologue 数据库初始化脚本
-- DDD架构 - 基于聚合设计
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `echologue` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `echologue`;

-- ========================================
-- 用户聚合（User Aggregate）
-- ========================================

-- 用户表（聚合根）
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（BCrypt加密）',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `bio` VARCHAR(500) DEFAULT NULL COMMENT '个人简介',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常 0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户统计表（聚合内实体）
DROP TABLE IF EXISTS `user_statistics`;
CREATE TABLE `user_statistics` (
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '文章数',
  `total_views` INT NOT NULL DEFAULT 0 COMMENT '总阅读量',
  `total_likes` INT NOT NULL DEFAULT 0 COMMENT '总获赞数',
  `follower_count` INT NOT NULL DEFAULT 0 COMMENT '粉丝数',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户统计表';

-- ========================================
-- 文章聚合（Article Aggregate）
-- ========================================

-- 文章表（聚合根）
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `author_id` BIGINT NOT NULL COMMENT '作者ID（引用User聚合）',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `slug` VARCHAR(200) DEFAULT NULL COMMENT 'URL别名',
  `summary` VARCHAR(500) DEFAULT NULL COMMENT '摘要',
  `cover` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `content` LONGTEXT COMMENT '文章内容（Markdown或JSON格式）',
  `content_type` VARCHAR(20) NOT NULL DEFAULT 'markdown' COMMENT '内容类型：markdown/json',
  `status` VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态：DRAFT-草稿 PUBLISHED-已发布 ARCHIVED-归档',
  `category_id` BIGINT DEFAULT NULL COMMENT '分类ID（引用Category聚合）',
  `views` INT NOT NULL DEFAULT 0 COMMENT '浏览量',
  `likes` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT NOT NULL DEFAULT 0 COMMENT '评论数',
  `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `version` INT NOT NULL DEFAULT 0 COMMENT '乐观锁版本号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_status` (`status`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 文章标签关联表（聚合内关系）
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag` (
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `tag_id` BIGINT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`article_id`, `tag_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- ========================================
-- 分类/标签聚合（Category/Tag Aggregate）
-- ========================================

-- 分类表（聚合根）
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(50) NOT NULL COMMENT 'URL别名',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '分类描述',
  `sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '文章数（冗余字段）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 标签表（聚合根）
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `slug` VARCHAR(50) NOT NULL COMMENT 'URL别名',
  `article_count` INT NOT NULL DEFAULT 0 COMMENT '文章数（冗余字段）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ========================================
-- 用户行为记录表（跨聚合）
-- ========================================

-- 点赞表
DROP TABLE IF EXISTS `user_like`;
CREATE TABLE `user_like` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `target_id` BIGINT NOT NULL COMMENT '目标ID（文章/评论）',
  `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型：ARTICLE/COMMENT',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
  KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞记录表';

-- 收藏表
DROP TABLE IF EXISTS `user_favorite`;
CREATE TABLE `user_favorite` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `article_id` BIGINT NOT NULL COMMENT '文章ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_article` (`user_id`, `article_id`),
  KEY `idx_article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏记录表';

-- ========================================
-- 初始化测试数据
-- ========================================

-- 插入测试用户
INSERT INTO `user` (`username`, `email`, `password`, `bio`) VALUES
('admin', 'admin@echologue.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员'),
('testuser', 'test@echologue.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '测试用户');
-- 密码均为：123456

-- 插入用户统计
INSERT INTO `user_statistics` (`user_id`) VALUES (1), (2);

-- 插入测试分类
INSERT INTO `category` (`name`, `slug`, `description`, `sort`) VALUES
('技术分享', 'tech', '技术相关文章', 1),
('生活随笔', 'life', '生活感悟', 2),
('阅读笔记', 'reading', '读书笔记', 3);

-- 插入测试标签
INSERT INTO `tag` (`name`, `slug`) VALUES
('Java', 'java'),
('Spring Boot', 'spring-boot'),
('DDD', 'ddd'),
('前端', 'frontend'),
('React', 'react');

-- ========================================
-- 完成
-- ========================================
