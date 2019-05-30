---
id: exchange_data_structure
title: 请求相应数据结构
---

在快速入门中，大家对框架应该有了初步的印象，接下来我们简单了解下目录约定规范。

## 继承关系

除非业务特殊需要，所有 HTTP 响应都应通过 `wison-base` 工程中定义的 `com.wison.response.JsonResponseBody` 或其派生类返回。

<!-- <img src="./images/json-response-body.png" alt="请求响应数据结构继承关系" title="请求响应数据结构继承关系" class="figure" style="max-width: 675px;"> -->

![请求响应数据结构继承关系](/img/json-response-body.png)

> 响应数据结构的定义位于 `wison-base` 工程的 `com.wison.response` 包内。

> `JsonResponseBody` 为基类，可用于描述不返回任何查询结果的响应。

> `JsonDataResponseBody` 为一个抽象类，其派生类 `JsonObjectResponseBody` 和 `JsonListResponseBody` 分别用于描述返回单个数据和返回列表数据的响应。

> 不仅仅是登录授权请求，任何需要认证信息的请求（要求设置 `Authorization` 请求头的请求）都可能返回用户访问令牌（`accessToken`）属性。当服务器响应数据中包含用户访问令牌时，客户端应该用取得的用户访问令牌更新本地缓存的用户访问令牌，并在后续请求中使用新的用户访问令牌。

## 响应数据结构说明

典型的响应数据的结构如下：

```json
{
  "success": true,
  "meta": {
    "count": 47,
    "pages": 5,
    "pageNo": 3,
    "pageSize": 10,
    "isFirstPage": false,
    "hasPreviousPage": true,
    "hasNextPage": true,
    "isLastPage": false
  },
  "links": {
    "first": "/users?page.no=1&page.size=10&sort=id%3Adesc",
    "previous": "/users?page.no=2&page.size=10&sort=id%3Adesc",
    "self": "/users?page.no=3&page.size=10&sort=id%3Adesc",
    "next": "/users?page.no=4&page.size=10&sort=id%3Adesc",
    "last": "/users?page.no=5&page.size=10&sort=id%3Adesc"
  },
  "data": [
    {
      "id": "BMEDYJ5S1DY5PPQH",
      "name": "guoq",
      "createdBy": { "$ref": "BMEDYH6EP4Q97Z0M" }
    },
    {
      "id": "BMEDYHJB21ULW3AY",
      "name": "jinhy",
      "createdBy": { "$ref": "BMEDYH6EP4Q97Z0M" }
    },
    ...
  ],
  "included": {
    "BMEDYH6EP4Q97Z0M": {
      "id": "BMEDYH6EP4Q97Z0M",
      "type": "system",
      "name": "System"
    }
  }
}
```

> `success` 字段用于标明处理是否成功，当值为 `false` 时将返回描述错误信息的 `error` 字段。

> 当查询列表时将会返回描述分页信息的 `meta` 字段。

> `links` 中携带业务相关链接。

> `data` 为返回的数据。当 `data` 中的一个字段的值为一个对象且包含（且仅包含）一个 `$ref` 字段时，表明该字段的值是对 `included` 中条目的引用。

> `included` 为一个字典，用于提供 `data` 中引用的数据。

## 设置引用数据

当响应数据的 `data` 中存在数据引用时，应获取相应的数据并将其设置到 `included` 字典中。

`JsonObjectResponseBody` 和 `JsonListResponseBody` 的实例提供一个 `setIncluded(EntityInterface)` 方法，用于取得指定数据实体的信息并将这些信息设置到 `included` 字段中。需要定义一个服务并实现 `wison-base` 的 `com.wison.service.EntityInterface` 接口，并在完成 `JsonObjectResponseBody` 或 `JsonListResponseBody` 的构造后将该服务的实例作为参数调用 `setIncluded(EntityInterface)` 方法。

下面以 `wison-auth` 工程中 `com.wison.auth.controller.UserController` 的 `JsonListResponseBody<UserProfile> search(HttpServletRequest, HttpServletResponse, UserCriteriaDTO, PageDTO)` 为例。

下面示例的目标是在完成数据（`BaseVersionedBizEntity` 的子类型）查询后，取得所有创建者、最后更新者及删除者等引用数据的信息，并将其设置到 `included` 字典中。

首先，用户服务接口应继承 `EntityInterface` 接口：

```java
public interface UserInterface extends EntityInterface {
    /* 方法定义 ... */
}
```

在用户服务中实现 `setIncluded(Map<String, BaseEntity>, List<T>)` 方法：

```java
@Component
public class UserService implements UserInterface {

    /* 成员声明/构造方法/方法实现 ... */

    @Override
    public <T extends BaseEntity> Map<String, BaseEntity> setIncluded(
        Map<String, BaseEntity> included,
        List<T> entities
    ) {

        Set<String> userIdSet = new HashSet<>();
        BaseVersionedBizEntity versionedBizEntity;

        // 取得所有引用目标用户的 ID
        for (T entity : entities) {
            versionedBizEntity = (BaseVersionedBizEntity) entity;
            userIdSet.add(versionedBizEntity.getCreatedBy());
            userIdSet.add(versionedBizEntity.getLastModifiedBy());
            userIdSet.add(versionedBizEntity.getDeletedBy());
        }

        // 查询引用目标用户的基本信息
        List<UserBasic> users = (List<UserBasic>) userBasicRepository
            .findAllById(new ArrayList<>(userIdSet));

        // 将应用目标用户信息设置到 included 字典中
        for (UserBasic userBasic : users) {
            included.put(userBasic.getId(), userBasic);
        }

        return included;
    }

}
```

控制器路由处理方法中，在完成响应数据构造后调用 `setIncluded(EntityInterface)` 方法。

```java
@Api(description = "用户接口")
@RestController
@RequestMapping(value = "/users")
public class UserController extends BaseController implements UserAPI {

    /* 成员声明/构造方法 ... */

    @Override
    @ApiOperation("查询用户信息")
    @RequestMapping(method = GET, consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    @ResponseStatus(OK)
    public JsonListResponseBody<UserProfile> search(
        HttpServletRequest request,
        HttpServletResponse response,
        UserCriteriaDTO criteria,
        PageDTO page
    ) {
        Page<UserProfile> users = userService.search(criteria, page);

        // 调用用户服务的 setIncluded(Map<String, BaseEntity>, List<T>) 方法
        // 参数分别为 JsonListResponseBody 实例的 included 属性及查询结果（从 users 取得的 List<UserProfile> 实例）
        return (new JsonListResponseBody<>(request, response, users)).setIncluded(userService);
    }

    /* 其他 REST 接口实现 ... */

}
```

由于在 `BaseVersionedBizEntity` 中 `createdBy`、`lastModifiedBy`、`deletedBy` 的类型为字符串，因此需要设置为在将响应数据序列化为 JSON 时将这些字段重构为 `{"$ref": String}` 的形式。

```java
@MappedSuperclass
public abstract class BaseVersionedBizEntity extends BaseBizEntity {

    @Column(nullable = false)
    @JsonIgnore
    private String createdBy;

    @Column(nullable = false)
    @JsonIgnore
    private String lastModifiedBy;

    @JsonIgnore
    private String deletedBy;

    /* 其他属性声明 ... */

    /* Getters/Setters ... */

    @JsonProperty(value = "createdBy", access = READ_ONLY)
    public ReferenceData getCreatedByRef() {
        return this.createdBy == null
            ? null
            : new ReferenceData(this.createdBy);
    }

    @JsonProperty(value = "lastModifiedBy", access = READ_ONLY)
    public ReferenceData getLastModifiedByRef() {
        return this.lastModifiedBy == null
            ? null
            : new ReferenceData(this.lastModifiedBy);
    }

    @JsonProperty(value = "deletedBy", access = READ_ONLY)
    public ReferenceData getDeletedByRef() {
        return this.deletedBy == null
            ? null
            : new ReferenceData(this.deletedBy);
    }

}
```

> 上述代码通过 `@JsonIgnore` 注解忽略了 `createdBy`、`lastModifiedBy`、`deletedBy` 属性，并通过 `@JsonProperty` 注解重新定义了这三个属性返回的数据结构。

> `ReferenceData` 在 `BaseEntity` 中定义，仅包含一个字段 `$ref`。

