---
id: others
title: 其它
---

## 国际化（i18n）

### 配置类

国际化配置类为 `wison-base` 工程的 `com.wison.config.WebConfiguration`。

### 消息定义文件

根据配置，需要将消息定义文件置于相应工程的 `classpath`（即 `src/main/resources`）路径下，并将其命名为 `messages_LANGUAGE.properties`，其中 `LANGUAGE` 为语言代码，如 `en`、`zh_CN` 等。

以 `wison-auth-api` 工程为例，`src/main/resources/message_zh_CN.properties` 为中文消息定义文件，`src/main/resources/messages.properties` 为默认消息定义文件。

### 消息的引用

以用户登录认证信息为例。

```java
public class CredentialDTO extends BaseDTO {

    @ApiModelProperty("登录用户名")
    @NotNull(message = "{error.validation.authentication.username-is-required}")
    private String username;

    @ApiModelProperty("登录密码")
    @NotNull(message = "{error.validation.authentication.password-is-required}")
    private String password;

    /* Getters & Setters */

}
```

```properties
# messages.properties
error.validation.authentication.username-is-required=username is required.
error.validation.authentication.password-is-required=password is required.
```

```properties
# messages_zh_CN.properties
error.validation.authentication.username-is-required=必须指定登录用户名。
error.validation.authentication.password-is-required=必须指定登录密码。
```

Spring 会根据客户端语言设置（`Accept-Language` 请求头）自动选择相应语言的消息。

## 其他说明

### 开发规范

* 组件的调用顺序为 `Controller` &gt; `Service` &gt; `Repository`，切勿在 `Controller` 直接使用 `Repository` 操作数据。
* 组件应通过在构造方法上使用 `@Autowired` 注解的方式注入（而不是在属性上使用 `@Autowired` 注解）。
* 除特殊需要，Redis 中的条目都应设置生命期，且不宜过长。

### Web 安全

* 所有请求必须携带 `User-Agent` 请求头，否则将返回访问被拒绝错误。
* 要求用户认证的接口必须携带 `Authorization` 请求头，否则将返回未认证错误。请求头形式为：
```http
Authorization: Bearer 用户访问令牌
```
* 所有无需用户认证但会产生新业务数据的请求（如获取短信验证码、发送验证邮件等）都应通过 CAPTCHA 校验（如要求用户识别图形验证码）进行保护。
* 用户登录认证请求初始无需进行 CAPTCHA 校验，但多次尝试失败后应进行 CAPTCHA 校验保护。
* 无论接口是否要求用户认证，客户端提供的用户访问令牌都必须有效。

## 常见问题

### Redis 持久化错误

错误信息：

> MISCONF Redis is configured to save RDB snapshots, but is currently not able to persist on disk. Commands that may modify the data set are disabled. Please check Redis logs for details about the error.

错误原因：未配置持久化文件。

处理办法：配置持久化文件。

```bash
> CONFIG SET dir /var/data
> CONFIG SET dbfilename redis.rdb
```

## 报表生成

### Jaspersoft Studio 使用说明

[下载 Jaspersoft Studio 使用说明](/file/jaspersoft-studio.zip)

### 数据结构

继承关系

* 所有报表的数据传输对象都应继承自 `com.wison.report.dto.BaseReportDTO`
* 所有带有列表的报表都应继承自 `com.wison.report.dto.BaseListReportDTO`
* 所有生成报表的控制器都应继承自 `com.wison.report.controller.BaseReportController`，并通过 `generateReportFile(...)` 方法根据 `com.wison.report.dto.BaseReportDTO` 的实例生成报表文件

> `com.wison.report.dto.BaseReportDTO` 将被转换为 `java.util.Map<String, Object>` 的实例作为参数（Parameters）传递给报表模板。

> 当报表数据传输对象为 `com.wison.report.dto.BaseListReportDTO` 的实例时，其 `items` 字段将作为报表模板的默认数据源（Data Source）。

设置报表名称（历史记录表示用）及编号前缀（用于生成报告编号）

```java
package com.wison.report.dto;

import java.util.Date;

public class PipelineFitUpInspectionApplicationPostDTO extends BaseReportDTO {

    /* Properties */

    public PipelineFitUpInspectionApplicationPostDTO() {
        super("管线组对检验申请", "PFI-");
    }

    /* Getters and Setters */

}
```

<footer><center>&copy; 2018 LiveBridge</center></footer>
