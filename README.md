# Echologue - Notion风格简洁博客系统

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Sa-Token](https://img.shields.io/badge/Sa--Token-1.37.0-blue.svg)](https://sa-token.cc/)
[![MyBatis-Plus](https://img.shields.io/badge/MyBatis--Plus-3.5.5-blue.svg)](https://baomidou.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## 📋 项目介绍

Echologue 是一个追求极简设计理念的现代博客系统，灵感来源于Notion的简洁美学。采用**DDD（领域驱动设计）架构**，旨在为用户提供一个专注于内容创作、阅读体验优雅、操作流畅的写作平台。

## 🏗 技术架构

### 后端技术栈

- **架构模式**: DDD（领域驱动设计）四层架构
- **核心框架**: Spring Boot 3.2.2
- **认证框架**: Sa-Token 1.37.0
- **ORM框架**: MyBatis-Plus 3.5.5
- **数据库**: MySQL 8.0+
- **API文档**: Knife4j 4.3.0
- **对象映射**: MapStruct 1.5.5

### DDD分层架构

```
├── echologue-types         # 【类型层】通用类型、枚举、异常
├── echologue-domain        # 【领域层】领域模型、聚合、领域服务
├── echologue-application   # 【应用层】应用服务、DTO、编排
├── echologue-infrastructure # 【基础设施层】仓储实现、持久化
├── echologue-interfaces    # 【接口层】REST控制器
└── echologue-start         # 【启动层】应用入口、配置
```

## 🚀 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/Echologue.git
cd Echologue
```

### 2. 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行初始化脚本
source echologue-start/src/main/resources/schema.sql
```

或直接在MySQL客户端执行 `schema.sql` 文件。

### 3. 修改配置

编辑 `echologue-start/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/echologue?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password  # 修改为你的数据库密码
```

### 4. 启动项目

```bash
# 方式1: Maven命令启动
mvn clean install
cd echologue-start
mvn spring-boot:run

# 方式2: IDEA启动
# 直接运行 com.echologue.EchoLogueApplication 主类
```

### 5. 访问应用

- **Swagger文档**: http://localhost:8080/doc.html
- **API基础路径**: http://localhost:8080/api

## 📚 API文档

项目启动后，访问 http://localhost:8080/doc.html 查看完整的API接口文档。

### 测试账号

| 用户名 | 邮箱 | 密码 | 角色 |
|-------|------|------|------|
| admin | admin@echologue.com | 123456 | 管理员 |
| testuser | test@echologue.com | 123456 | 普通用户 |

## 🎯 核心功能

### MVP版本（当前开发中）

- ✅ 用户注册/登录（基于Sa-Token）
- ✅ 文章CRUD（创建、编辑、发布、查看）
- ✅ 分类和标签管理
- 🚧 Notion风格阅读界面（前端开发中）

### 后续迭代

- [ ] Tiptap富文本编辑器
- [ ] 评论系统
- [ ] 点赞/收藏功能
- [ ] Elasticsearch全文搜索
- [ ] Redis缓存
- [ ] 文章版本历史
- [ ] 数据统计分析

## 📦 项目结构

```
Echologue/
├── pom.xml                         # 根POM，依赖管理
├── echologue-types/                # 类型定义层
│   └── src/main/java/com/echologue/types/
│       ├── common/                 # 通用类（Result、PageResult）
│       ├── enums/                  # 枚举定义
│       └── exception/              # 异常类
│
├── echologue-domain/               # 领域层
│   └── src/main/java/com/echologue/domain/
│       ├── user/                   # 用户领域
│       │   ├── model/             # 领域模型
│       │   ├── service/           # 领域服务
│       │   └── repository/        # 仓储接口
│       ├── article/                # 文章领域
│       └── category/               # 分类领域
│
├── echologue-application/          # 应用层
│   └── src/main/java/com/echologue/application/
│       ├── user/                   # 用户应用服务
│       └── article/                # 文章应用服务
│
├── echologue-infrastructure/       # 基础设施层
│   └── src/main/java/com/echologue/infrastructure/
│       ├── persistence/            # 持久化实现
│       │   ├── po/                # 持久化对象
│       │   ├── mapper/            # MyBatis Mapper
│       │   └── repository/        # 仓储实现
│       └── config/                 # 配置类
│
├── echologue-interfaces/           # 接口层
│   └── src/main/java/com/echologue/interfaces/
│       ├── controller/             # REST控制器
│       └── dto/                    # 请求/响应DTO
│
└── echologue-start/                # 启动层
    ├── src/main/java/com/echologue/
    │   ├── EchoLogueApplication.java  # 启动类
    │   └── config/                 # 全局配置
    └── src/main/resources/
        ├── application.yml
        └── schema.sql
```

## 🔧 开发指南

### DDD开发原则

1. **领域优先**: 先设计领域模型，再考虑技术实现
2. **充血模型**: 业务逻辑写在领域对象内部
3. **依赖倒置**: 领域层定义仓储接口，基础设施层实现
4. **聚合边界**: 一个事务只修改一个聚合
5. **值对象不可变**: 使用final字段

### 开发流程

1. **领域建模** → 设计聚合、实体、值对象
2. **定义仓储接口** → 在领域层定义数据访问接口
3. **实现应用服务** → 编排领域服务，处理业务流程
4. **实现基础设施** → 实现仓储接口，持久化数据
5. **实现接口层** → 提供REST API

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 License

本项目采用 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) 开源协议。
