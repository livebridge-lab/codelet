---
id: design-pattern-and-rules
title: 设计模式与规范
---

## 持续集成

为保证团队成员的代码能够有效地集成，需要遵守以下原则：

* 使用版本控制工具（SCM, Software Control Management） - Git & Gitolite
* 必须及时向版本控制库提交代码
* 及时将版本控制库的代码更新到本地
* 使用专门的集成服务器执行集成构建 - Jenkins
* 必须保证构建成功

如果构建失败，则需要优先解决构建过程中发生的错误，并在错误修复后手动启动一次构建。

## 设计原则及注意事项

* 遵循领域驱动设计（Domain-Driven Design）原则

  > 根据业务将数据模型划分为不同的领域，每一个领域形成独立的微服务。

* 遵循 CQRS（Command Query Responsibility Segregation）设计原则

  > 将一个领域的命令操作（Command，即增加、修改、删除）与查询操作（Query）进一步分离为独立的微服务。通常情况下，Command 领域模型对 MySQL 进行操作，并将数据信息同步到 Elasticsearch，再通过 Query 领域的数据模型从 Elasticsearch 查询数据。

* 遵循微服务（Microservice）设计原则

  > 当【微服务A】需要调用【微服务B】的业务逻辑时，【微服务A】只可通过【微服务B】的 FeignClient 接口调用【微服务B】的相应业务逻辑，而不是通过依赖【微服务B】直接使用其中的组件，从而实现不同领域之间业务的解耦。

* 接口及数据模型的定义与业务逻辑实现相分离

  > 对于一个领域的业务实现，将其分为接口及数据模型定义与业务逻辑实现两个模块，前者用于向其他领域的微服务提供 FeignClient 及相关数据模型定义，后者用于实现业务逻辑。

* 一个领域的 Starter 作为独立的模块

  > 每一个领域的 Starter 为一个独立的模块，从而使得每个领域的业务实现模块可以独立启动，同时也可以与其他业务实现的模块通过其他的 Starter 捆绑启动。

* 确保微服务可以独立运行也可以捆绑运行

  > 独立运行时每个微服务的模块通过各自的 Starter 启动，捆绑运行时多个微服务模块通过一个 Starter 启动。

  > 模块 `starters/monolithic` 的 `MonolithicStarter` 为一个 All-in-One 部署方式的 Starter 的示例。创建一个新的领域的微服务时，应将其 Query 和 Command 模块加入到 `starters/monolithic` 的依赖中，并尝试启动，以检查是否与其他微服务存在冲突。

  > 由于 All-in-One 部署方式下无微服务之间的调用，因此 MonolithicStarter 不需要启用服务自动发现（`@EnableDiscoveryClient`）和 FeignClient（`@EnableFeignClients`）。

* 确保当前微服务在非必要的微服务未部署时也可正常运行

  > 例如，若文档在一个系统中不需要标签功能，那么在这个系统中则无须部署标签相关微服务，且不会影响文档相关微服务的正常运行。

  > 通过 FeignClient 的 fallback 容错。

* FeignClient 调用的微服务的名称可通过应用属性配置

  > `@FeignClient` 注解的 `name` 参数使用 Property Key 设置，Property Key 的格式为 `services.领域名称.操作类型.name`，如 `services.user.query.name=user-query`。

  > 需要为 `@FeignClient` 注解的 `name` 参数设置默认值，如：
  > ```java
  > @FeignClient(
  >     contextId = "role-command",
  >     name = "${services.organization.command.name:organization-command}"
  > )
  > public class RoleCommandApi {}
  > ```
  > 从而使得一个模块与其他模块捆绑为一个新的微服务时，服务消费者可以以新的微服务的名称调用微服务。

* 接口设计遵循 RESTful 风格

  > 正确使用 HTTP 请求方法，如 POST（增加/执行）、PUT（替换更新）、PATCH（部分更新）、DELETE（删除）、GET（查询，幂等操作）等，其中，POST、PUT、PATCH、DELETE 操作应置于 Command 领域，GET 应置于 Query 领域。

  > 应将能够用于定位资源的充分且必要的参数作为路径参数，以准确地实现访问权限控制。

## Web 安全

* 所有请求必须携带 User-Agent 请求头，否则将返回访问被拒绝错误。

* 要求用户认证的接口必须携带 Authorization 请求头，否则将返回未认证错误。请求头形式为：

  > `Authorization: Bearer 访问令牌`

* 所有无需用户认证但会产生新业务数据的请求（如获取短信验证码、发送验证邮件等）都应通过 CAPTCHA 校验（如要求用户识别图形验证码）进行保护。

* 用户登录认证请求初始无需进行 CAPTCHA 校验，但多次尝试失败后应进行 CAPTCHA 校验保护。

* 无论接口是否要求用户认证，客户端提供的用户访问令牌都必须有效。
