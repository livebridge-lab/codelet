---
id: project-structure
title: 工程结构说明
---

## 相关工具及框架

|项目|说明|
|:---|:---|
|Java 8|开发语言，运行时环境|
|Spring Boot||
|Spring Cloud|分布式系统开发框架|
|Consul|服务自动发现与服务治理解决方案|
|Spring Cloud Consul||
|Spring Cloud OpenFeign|通过 REST API 实现服务之间的调用|
|Spring Cloud Netflix|实现断路器、智能路由、负载均衡等|
|MySQL Server|关系型数据库|
|Spring Data JPA|Java 持久化数据访问实现|
|Elasticsearch|全文检索引擎|
|Spring Data Elasticsearch|Elasticsearch 数据仓库|
|Redis|内存型数据库|
|Spring Data Redis|Redis 操作|
|Swagger|API 文档|
|ImageMagick|图像处理工具|
|FFmpeg|音频/视频处理工具|

## 工程结构说明

```text
/codelet-cloud
  ├─ commons                          通用模块
  ├─ auth                             认证/授权模块
  │   ├─ auth-commons                     通用模块，包含基本数据结构、注解、接口等的定义
  │   ├─ auth-command-api                 命令接口定义（FeignClient）
  │   ├─ auth-command                     命令接口实现
  │   ├─ auth-command-starter             命令接口启动器
  │   ├─ auth-query-api                   查询接口定义（FeignClient）
  │   ├─ auth-query                       查询接口实现
  │   └─ auth-query-starter               查询接口启动器
  ├─ user                             用户账号模块
  │   ├─ user-commons                     通用模块，包含基本数据结构、注解、接口等的定义
  │   ├─ user-command-api                 命令接口定义（FeignClient）
  │   ├─ user-command                     命令接口实现
  │   ├─ user-command-starter             命令接口启动器
  │   ├─ user-query-api                   查询接口定义（FeignClient）
  │   ├─ user-query                       查询接口实现
  │   └─ user-query-starter               查询接口启动器
  ├─ •••                              （其他业务模块）
  └─ starters                         启动器相关模块
      ├─ starter-commons                  启动器通用模块
      ├─ starter-commons-jpa              操作关系数据库时需要依赖此模块
      ├─ starter-commons-discovery        作为微服务启动时需要依赖此模块
      └─ monolithic                       All-in-One 部署方式启动模块示例
```

> 说明：
> * 一个业务模块是对一组业务紧密相关的数据实体操作的实现，这些数据实体构成一个业务领域。
> * 一个业务领域将被进一步划分为命令（Command）领域服务和查询（Query）领域服务，即 CQRS（命令与查询职责分离）。
> * 通常情况下，一个服务由三个模块构成，分别为 API 定义、业务实现模块和启动器（Starter）。
> * 其中，启动器将被编译并打包成可执行的 JAR 程序（Spring Boot 应用），最终发布到服务器以微服务的形式运行。

> 上图为模块的逻辑结构，各业务模块的源代码通过独立的代码库管理。

下图以认证/授权模块和用户账号模块为例描述模块之间的依赖关系：

![configure pipeline](/img/framework/development/02-01-dependencies.png)

> 说明：
> * 若一个业务模块不直接操作数据库，则其 Starter 不依赖 starter-commons-jpa；
> * 若所有模块通过一个 Starter 启动且不依赖其他服务则该 Starter 不依赖 starter-commons-discovery。

## 模块结构说明

下面以通用模块和认证/授权模块的命令部分为例对模块结构进行说明：

```text
/codelet-cloud
  ├─ commons
  │   ├─ src
  │   │   ├─ main
  │   │   │   ├─ java
  │   │   │   │   └─ net/codelet/cloud
  │   │   │   │       ├─ annotation                                 通用注解
  │   │   │   │       │   └─ SetReferenceData.java                  【注解】应用于控制器方法，用于设置响应数据的关联数据
  │   │   │   │       ├─ aspect                                     切面
  │   │   │   │       │   ├─ BaseAspect.java                        【抽象类】切面的基类，提供了获取上下文数据的方法
  │   │   │   │       │   ├─ JsonApiResponseAspect.java             【类/切面】用于将控制器的方法格式化为 JSON API 格式
  │   │   │   │       │   └─ SetReferenceDataAspect.java            【类/切面】用于设置控制器方法返回结果的关联数据
  │   │   │   │       ├─ config                                     全局配置
  │   │   │   │       │   ├─ CacheConfiguration.java                【类】应用缓存配置
  │   │   │   │       │   ├─ JacksonConfiguration.java              【类】Jackson 序列化/反序列化配置
  │   │   │   │       │   ├─ RedisClusterConfiguration.java         【类】Redis 集群连接配置
  │   │   │   │       │   ├─ RedisConfiguration.java                【类】Redis 配置
  │   │   │   │       │   ├─ SecurityConfiguration.java             【类】安全相关配置
  │   │   │   │       │   ├─ WebConfiguration.java                  【类】Web MVC 配置/消息国际化配置
  │   │   │   │       │   └─ WebSecurityConfiguration.java          【类】Web 安全配置（如 CSRF）
  │   │   │   │       ├─ constant                                   常量定义，如请求头、响应头等
  │   │   │   │       │   └─ ...                                    【接口】
  │   │   │   │       ├─ constoller                                 控制器相关
  │   │   │   │       │   ├─ BaseController.java                    【类】所有控制器基类，异常处理
  │   │   │   │       │   └─ HttpContext.java                       【抽象类】提供获取 Spring 应用上下文数据的方法
  │   │   │   │       ├─ dto                                        数据传输对象相关
  │   │   │   │       │   ├─ response                               响应数据封装
  │   │   │   │       │   │   ├─ JsonApiDTO.java                    【类】JSON API 响应数据基类
  │   │   │   │       │   │   ├─ JsonApiErrorDTO.java               【类】JSON API 响应数据的错误信息
  │   │   │   │       │   │   ├─ JsonApiBooleanDTO.java             【类】数据为布尔类型的 JSON API 响应数据
  │   │   │   │       │   │   ├─ JsonApiNumberDTO.java              【类】数据为数值类型的 JSON API 响应数据
  │   │   │   │       │   │   ├─ JsonApiWithDataDTO.java            【抽象类】数据为对象或列表类型的 JSON API 的基类
  │   │   │   │       │   │   ├─ JsonApiObjectDTO.java              【类】数据为对象的 JSON API 响应数据
  │   │   │   │       │   │   └─ JsonApiListDTO.java                【类】数据为列表的 JSON API 响应数据
  │   │   │   │       │   ├─ BaseDTO.java                           【类】数据传输对象的基类
  │   │   │   │       │   ├─ ContextDTO.java                        【类】HTTP 请求上下文封装对象
  │   │   │   │       │   ├─ OperatorDTO.java                       【类】HTTP 请求发起者信息
  │   │   │   │       │   ├─ EntityReference.java                   【类】引用数据描述
  │   │   │   │       │   ├─ PageDTO.java                           【类】分页查询结果
  │   │   │   │       │   ├─ PaginationDTO.java                     【类】分页查询参数
  │   │   │   │       │   └─ SortByDTO.java                         【类】分页查询排序设置
  │   │   │   │       ├─ entity                                     数据实体
  │   │   │   │       │   ├─ BaseEntity.java                        【类】数据实体的基类
  │   │   │   │       │   └─ BaseVersionedEntity.java               【类】带修订版本的数据实体的基类
  │   │   │   │       ├─ error                                      错误
  │   │   │   │       │   ├─ BaseError.java                         【抽象类】错误基类
  │   │   │   │       │   ├─ ServiceUnavailableError.java           【类】服务不可用错误
  │   │   │   │       │   ├─ UnauthorizedError.java                 【类】用户尚未登录错误
  │   │   │   │       │   ├─ AccessTokenExpiredError.java           【类】访问令牌已过期错误
  │   │   │   │       │   ├─ AccessTokenInvalidError.java           【类】访问令牌无效错误
  │   │   │   │       │   ├─ AuthenticationError.java               【类】认证错误
  │   │   │   │       │   ├─ AccessDeniedError.java                 【类】访问被拒绝错误
  │   │   │   │       │   ├─ NoPrivilegeError.java                  【类】权限不足错误
  │   │   │   │       │   ├─ ConflictError.java                     【类】操作冲突错误
  │   │   │   │       │   ├─ DuplicatedError.java                   【类】数据重复错误
  │   │   │   │       │   ├─ NotFoundError.java                     【类】资源不存在错误
  │   │   │   │       │   ├─ PayloadTooLargeError.java              【类】请求数据过大错误
  │   │   │   │       │   ├─ TooManyRquestsError.java               【类】请求过于频繁错误
  │   │   │   │       │   ├─ TimeoutError.java                      【类】超时错误
  │   │   │   │       │   ├─ UnsupportedMediaTypeError.java         【类】请求数据的媒体类型不被支持错误
  │   │   │   │       │   ├─ ValidationError.java                   【类】请求数据校验错误
  │   │   │   │       │   └─ BusinessError.java                     【类】业务错误
  │   │   │   │       ├─ feign                                      FeignClient 相关
  │   │   │   │       │   └─ ResponseDecoder.java                   【类】将其他服务返回的数据由 JSON API 格式解码
  │   │   │   │       ├─ filter                                     拦截器
  │   │   │   │       │   └─ HttpAccessControlFilter.java           【类】设置跨域请求头
  │   │   │   │       ├─ repository                                 数据仓库
  │   │   │   │       │   └─ BaseRepository.java                    【接口】提供 findByIdIn(Collection<String>) 方法
  │   │   │   │       ├─ service                                    服务相关
  │   │   │   │       │   ├─ DomainObjectService.java               【接口】提供设置关联数据的方法
  │   │   │   │       │   └─ StringRedisService.java                【抽象类】提供操作 Redis 的方法
  │   │   │   │       ├─ util                                       业务无关的工具类
  │   │   │   │       │   └─ ...
  │   │   │   │       └─ vo                                         值对象，通用的枚举
  │   │   │   │           └─ ...
  │   │   │   └─ resources
  │   │   │       ├─ messages.properties                            消息定义（英文）
  │   │   │       └─ messages_zh_CN.properties                      消息定义（中文）
  │   │   └─ test/java
  │   └─ pom.xml
  └─ auth
      ├─ auth-command-api
      │   ├─ src
      │   │   ├─ main
      │   │   │   ├─ java
      │   │   │   │   └─ net/codelet/cloud/auth/command
      │   │   │   │       ├─ dto                                    数据传输对象，如查询参数、请求数据（Request Body）定义
      │   │   │   │       │   └─ CredentialsDTO.java                【类】登录用户名/密码数据传输对象
      │   │   │   │       ├─ entity                                 数据实体定义
      │   │   │   │       │   └─ AccessTokenEntity.java             【类】访问令牌数据实体
      │   │   │   │       └─ api                                    REST 接口声明（FeignClient）
      │   │   │   │           └─ AuthenticationApi.java             【接口】认证接口
      │   │   │   └─ resources
      │   │   │       ├─ messages.properties                        消息定义（英文）
      │   │   │       └─ messages_zh_CN.properties                  消息定义（中文）
      │   │   └─ test/java
      │   └─ pom.xml
      ├─ auth-command
      │   ├─ src
      │   │   ├─ main
      │   │   │   ├─ java
      │   │   │   │   └─ net/codelet/cloud/auth/command
      │   │   │   │       ├─ controller                             REST 接口实现
      │   │   │   │       │   └─ AuthenticationController.java      【类】认证控制器
      │   │   │   │       ├─ service                                领域业务服务
      │   │   │   │       │   ├─ impl
      │   │   │   │       │   │   └─ AccessTokenServiceImpl.java    【类】认证服务
      │   │   │   │       │   └─ AccessTokenService.java            【接口】认证服务接口
      │   │   │   │       └─ repository                             数据仓库
      │   │   │   │           └─ AccessTokenRepository.java         【接口】访问令牌数据仓库
      │   │   │   └─ resources
      │   │   └─ test/java
      │   └─ pom.xml
      └─ auth-command-starter
          ├─ src
          │   ├─ main
          │   │   ├─ java
          │   │   │   └─ net/codelet/cloud/auth/command
          │   │   │       └─ AuthCommandStarter.java                Spring Boot 应用入口
          │   │   └─ resources
          │   │       └─ application.yml                            应用配置文件
          │   └─ test/java
          └─ pom.xml
```

## 项目模块一览表

|名称|Git 库地址<br>codelet@ciserver|数据库|命令服务<br>端口号|查询服务<br>端口号|说明|
|:---|:---|:---|:---:|:---:|:---|
|cloud|cloud/parent|&nbsp;|&nbsp;|&nbsp;|Codelet Cloud 及相关文档|
|commons|cloud/commons|&nbsp;|&nbsp;|&nbsp;|通用组件|
|auth|cloud/auth|codelet_cloud_auth|8010|8011|登录、认证与授权|
|verification|cloud/verification|codelet_cloud_verification|8020|&nbsp;|电子邮箱、手机号码验证及 CAPTCHA|
|notification|cloud/notification|codelet_cloud_notification|8030|8031|邮件、短信发送及站内通知|
|user|cloud/user|codelet_cloud_user|8040|8041|用户账号|
|organization|cloud/organization|codelet_cloud_organization|8050|8051|组织、角色及基于角色的用户权限|
|tag|cloud/tag|codelet_cloud_tag|8060|8061|标签系统|
|file|cloud/file|codelet_cloud_file|8070|8071|文档管理|
|comment|cloud/comment|codelet_cloud_comment|8080|8081|批注、评论|
|community|cloud/community|codelet_cloud_community|8090|8091|社区、问答（Q/A）|
|post|cloud/post|codelet_cloud_post|8100|8101|帖子|
|wiki|cloud/wiki|&nbsp;|8110|8111|知识库|
|article|cloud/article|&nbsp;|8120|8121|文章、博客|
|task|cloud/task|codelet_cloud_task|8130|8131|任务管理（Scrum）|
|product|cloud/product|codelet_cloud_product|8140|8141|产品管理|
|service|cloud/service|codelet_cloud_service|8150|8151|服务产品管理|
|order|cloud/order|codelet_cloud_order|8160|8161|订单管理|
|statistics|cloud/statistics|codelet_cloud_statistics|8800|8801|数据统计|
|starters|cloud/starters|&nbsp;|&nbsp;|&nbsp;|启动器通用组件及示例|

## 私有 Maven 库

通过以下链接查看部署到 Nexus 的模块：

```text
http://ciserver:8910/#browse/browse:codelet-cloud-public:net%2Fcodelet%2Fcloud
```
