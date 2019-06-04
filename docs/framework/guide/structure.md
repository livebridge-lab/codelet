---
id: structure
title: 工程目录结构
---

在快速入门中，大家对框架应该有了初步的印象，接下来我们简单了解下目录约定规范。

## 目录结构

```tree
/codelet-parent
  │
  ├─ codelet-config                      配置服务/服务注册中心
  │   └─ src/main
  │       ├─ java
  │       │   └─ com/codelet/config
  │       │       └─ ConfigApp.java    配置服务/服务注册中心入口类
  │       └─ resources                 配置文件等（配置文件也可选用 Git 作为仓库）
  │
  ├─ codelet-base                        其他工程依赖的基础工程
  │   └─ src/main
  │       └─ java
  │           └─ com/codelet
  │               ├─ util              工具类，如 Java Bean 处理，IP 地址处理等
  │               ├─ constant          常量
  │               ├─ annotation        注解
  │               ├─ aspect            切面基类定义
  │               ├─ dto               数据传输对象基类
  │               ├─ entity            数据实体基类
  │               ├─ vo                DTO/Entity 定义中使用的值对象，如枚举等
  │               ├─ repository        自定义查询数据仓库基类
  │               ├─ feign             OpenFeign 相关设置，如 HTTP 请求头设置等
  │               ├─ filter            过滤器，如浏览器跨域请求头设置过滤器等
  │               ├─ service           通用服务接口
  │               ├─ exception         异常类
  │               └─ response          HTTP 响应数据结构定义
  │
  ├─ codelet-auth-api                    用户认证子系统的接口工程
  │   └─ src/main
  │       └─ java
  │           └─ com/codelet/auth
  │               ├─ dto               用户认证业务接口数据传输对象（如用户创建表单、查询参数等）
  │               ├─ entity            用户认证业务相关数据实体（如用户、组织、角色、访问令牌等）
  │               └─ api               用户认证业务接口定义
  │
  ├─ codelet-auth                        用户认证子系统的业务实现工程
  │   └─ src/main
  │       ├─ java
  │       │   └─ com/codelet/auth
  │       │       ├─ domain/model      领域模型
  │       │       │   ├─ repository    用户认证业务相关数据实体操作接口定义
  │       │       │   └─ service       用户认证业务逻辑实现
  │       │       ├─ controller        控制器（RESTful 接口定义）
  │       │       ├─ config            Spring Boot 配置类
  │       │       ├─ aspect            切面定义，如控制器调用权限检查等
  │       │       └─ AuthApp.java      用户认证业务服务入口类
  │       └─ resources
  │           ├─ developer             开发说明
  │           ├─ templates             FreeMarker 模板
  │           └─ swagger/dist          API 文档前端静态资源
  │
  ├─ codelet-docs-api                    文件管理子系统的接口工程
  │   └─ ...
  │
  ├─ codelet-docs                        文件管理子系统的业务实现工程
  │   └─ ...
  │
  ├─ codelet-bpm-api                     工作流子系统的接口更称
  │   └─ ...
  │
  └─ codelet-bpm                         工作流子系统的业务实现工程
      └─ ...
```

> `codelet-base` 工程提供基础数据结构及**业务无关**的处理逻辑。

> `codelet-auth-api`、`codelet-docs-api`、`codelet-bpm-api` 工程用于定义相应业务实现工程暴露的服务接口及相应的数据结构，从而使得其他服务可以调用相应的接口。

> `codelet-auth`、`codelet-docs`、`codelet-bpm` 是 Spring Boot 工程，实现具体业务，并最终作为 Web/SOAP 服务发布。

> 开发过程中注意要将接口及数据实体的定义与业务逻辑实现分离成 API 工程及业务实现工程。

## 工程间的依赖关系

![工程间依赖关系](/img/dependencies.png)

> 一个业务实现工程通过依赖另一个业务实现工程的 API 工程获得其暴露的服务接口及相关数据结构。例如，用户在使用文件管理子系统（`codelet-docs`）的服务操作数据时需要进行身份认证及权限检查，此时文件管理子系统需要调用用户认证子系统（`codelet-auth`）的服务，因此文件管理子系统需要依赖用户认证子系统的 API 工程（`codelet-auth-api`）以获取相关接口信息及相关数据结构（数据传输对象、数据实体等信息）。

