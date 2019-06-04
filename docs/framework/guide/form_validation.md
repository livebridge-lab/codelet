---
id: form_validation
title: 表单数据验证
---

为 DTO 的属性添加相应的注解，从而定义属性的有效性，如必要性、最大值、最小值、格式等。

为控制器方法的相应参数添加 `@Valid` 注解，从而在方法执行前执行参数的有效性检查。

## DTO 定义

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

## 校验注解示例

|注解|示例|说明|适用于|
|:---|:---|:---|:---|
|`@NotNull`|`@NotNull`|不可为 `null`|任何数据类型|
|`@NotEmpty`|`@NotEmpty`|不可为 `null` 或空|字符串、`Collection`、`Map`、数组|
|`@NotBlank`|`@NotBlank`|不可为 `null` 或空白|字符串|
|`@Size`|`@Size(min = 3, max = 16)`|长度必须在 3（含）到 16（含）之间|字符串、`Collection`、`Map`、数组|
|`@Min`|`@Min(0)`|不得小于 0|数值|
|`@Max`|`@Max(16)`|不得大于 16|数值|
|`@Pattern`|`@Pattern(regexp = "^[a-zA-Z][0-9a-zA-Z]{2,23}$")`|由英文字母及数字组成，且第一个字符必须为字母，且总长度必须在 3（含）到 24（含）位之间|字符串|
|`@Email`|`@Email`|必须符合电子邮箱地址格式|字符串|

> 更多内容请参照 `javax.validation.constraints` 下的注解的说明。

## 控制器方法定义

以用户登录认证接口为例。

```java
@Api(description = "用户认证/授权接口")
@RestController
public class AuthenticationController extends BaseController implements AuthenticationAPI {

    /* 属性定义及构造方法 */

    @Override
    @ApiOperation(value = "用户登录认证", notes = "获取访问令牌。")
    @RequestMapping(method = POST, value = "/authorizations", consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    @ResponseStatus(CREATED)
    public JsonObjectResponseBody<UserProfile> authenticate(@RequestBody @Valid CredentialDTO credentials) {
        /* 认证逻辑 */
    }

}
```

## 响应数据

若用户输入的参数不符合要求将返回如下形式的数据：

```json
{
    "success": false,
    "status": 400,
    "error": {
        "code": "error.validation",
        "status": 400,
        "fields": [
            {
                "name": "username",
                "type": "NotNull",
                "message": "必须指定登录用户名。"
            },
            {
                "name": "password",
                "type": "NotNull",
                "message": "必须指定登录密码。"
            }
        ]
    }
}
```