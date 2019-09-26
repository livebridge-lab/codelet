---
id: step-by-step
title: 开发流程
---

## 开发流程

|环境|实施者|作业类型|作业内容|
|:---|:---|:---:|:---|
|-|设计人员|设计|分析业务，划分领域模型，设计数据实体，定义资源，设计 REST API|
|Git 服务器|持续集成管理员|配置|通过 Gitolite 创建业务模块的代码库，并将访问权限授予开发者|
|持续集成服务器|持续集成管理员|配置|在 Jenkins 中创建自动部署的 Pipeline 任务|
|Git 服务器|持续集成管理员|配置|为代码库添加 hooks/post-receive 脚本以触发 Jenkins 的自动部署任务|
|数据库服务器|数据库管理员|配置|创建业务领域的数据库（如果直接对数据库进行操作）|
|开发环境|开发人员|开发|克隆代码库到本地工作空间|
|开发环境|开发人员|开发|根据【模块结构说明】创建各 Maven 的 POM 模块|
|开发环境|开发人员|开发|&nbsp;&nbsp;创建业务领域通用模块|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;创建业务领域通用的数据实体、数据传输对象、注解等组件|
|开发环境|开发人员|开发|&nbsp;&nbsp;创建命令领域模块（如果业务上需要）和查询领域模块（如果业务上需要）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;创建接口定义模块（domain-command-api 及 domain-query-api）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义数据实体（Domain Entity）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义接口参数及返回值的数据传输对象（DTO）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义 REST API 接口（FeignClient）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;创建领域模型实现模块（domain-command 及 domain-query）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义数据实体的数据仓库接口|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定义领域模型服务接口并实现|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建 REST Controller（REST API 接口的实现）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;创建领域服务的启动器（domain-command-starter 及 domain-query-starter）|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;配置应用|
|开发环境|开发人员|开发|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;创建应用入口类（DomainCommandStarter.java 及 DomainQueryStarter.java）|
|开发环境|开发人员|开发|&nbsp;&nbsp;在根路径创建 Jenkinsfile 文件，填写自动部署 Pipeline 指令|
|开发环境|开发人员|测试|在开发环境进行测试|
|开发环境|开发人员|集成|将代码推送到代码库|
|Git 服务器|codelet|部署|执行 hooks/post-receive，向 Jenkins 发送 Pipeline 编译请求|
|持续集成服务器|codelet|部署|接收到 Pipeline 编译请求，从 Git 拉取代码，执行编译、测试、部署|
|持续集成服务器|codelet|部署|成功部署时，重新启动微服务|

## 数据实体（Domain Entity）定义

所有数据实体都应为 `net.codelet.cloud.entity.BaseEntity` 的派生类。

若要对一个数据实体进行版本管理，则这个数据实体应继承 `net.codelet.cloud.entity.BaseVersionedEntity`。

下面以用户业务为例：

![configure pipeline](/img/framework/development/03-01-entities.png)

```java
// net.codelet.cloud.user.entity.UserBaseEntity
@MappedSuperclass
public abstract class UserBaseEntity extends BaseVersionedEntity {

    @Column(nullable = false, length = 45)
    private String name;

    @Column(length = 255)
    private String logo;

    @Column(nullable = false, length = 32)
    private String username;

    /* Getters & Setters */
}
```

```java
// net.codelet.cloud.user.command.entity.UserCommandEntity
@Entity
@Table(name = "user")
public class UserCommandEntity extends UserBaseEntity {

    @Column(nullable = false, length = 60)
    private String password;

    /* Getter & Setter */
}
```

```java
// net.codelet.cloud.user.query.entity.UserQueryEntity
@Entity
@Table(name = "user")
public class UserQueryEntity extends UserBaseEntity {
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@MappedSuperclass`|标明当前类为实体数据实体的超类|
|`@Entity`|标明当前类为数据实体，注意，该注解不可与 `@MappedSuperclass` 一起使用|
|`@Table`|标明数据与数据实体映射的数据库表名|
|`@Column`|配置数据库表的列，如列名、是否可以为 `NULL`、最大长度等|

## 数据传输对象（DTO）定义

数据传输对象是一个简单的 POJO 对象，用于描述客户端提交给服务器的数据结构，如 HTTP 请求 URL 中的查询参数（Query String Parameters）、HTTP 请求体数据（HTTP Request Body）等。

所有数据传输对象都应为 `net.codelet.cloud.dto.BaseDTO` 的派生类。

所有分页查询参数对象都应为 `net.clodelet.cloud.dto.PaginationDTO` 的派生类。

下面以用户查询为例：

![configure pipeline](/img/framework/development/03-02-dtos.png)

```java
// net.codelet.cloud.user.query.dto.UserQueryDTO
public class UserQueryDTO extends PaginationDTO {

    @ApiModelPropery("用户姓名")
    private String name;

    @ApiModelPropery("登录用户名")
    private String username;

    /* Getters & Setters */
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@ApiModelProperty`|Swagger 注解，用于在 API 文档中对属性进行说明|

## 数据仓库（Repository）接口定义

Spring 框架会自动实现 `org.springframework.data.repository.Repository` 从而实现对数据库持久化数据的操作。

Spring Data JPA 还提供了两个 Repository 接口的扩展接口：

* `org.springframework.data.repository.CrudRepository`：定义了基本的 CRUD 操作
* `org.springframework.data.repository.PagingAndSortingRepository`：定义了基本分页查询操作

所有查询领域的数据仓库都应扩展自 `net.codelet.cloud.repository.BaseRepository`（以实现关联数据的取得）。

下面以用户查询为例：

![configure pipeline](/img/framework/development/03-03-repositories.png)

```java
// net.codelet.cloud.user.query.repository.UserQueryRepository
public interface UserQueryRepository extends BaseRepository {

    Page<UserQueryEntity> findByName(String name, Pageable pageable);

    Page<UserQueryEntity> findByUsername(String username, Pageable pageable)

    @Query("SELECT u FROM UserQueryEntity u WHERE u.name LIKE %:query.name% OR u.username LIKE %:query.username%")
    Page<UserQueryEntity> search(@Param("query") UserQueryDTO query, Pageable pageable);

    /* ... */
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@Query`|定义 JPA 查询语句|
|`@Param`|定义 JPA 查询语句中的参数|

## 领域业务服务实现

先定义领域业务服务的接口，再对接口进行实现。

数据实体的领域业务服务应实现 `net.codelet.cloud.service.DomainObjectService`。

领域业务服务之间不可互相调用，若存在共通业务逻辑，应提取到 Business 中。

如果需要操作 Redis 中的数据则需要继承 `net.codelet.cloud.service.StringRedisService`。

下面以用户查询为例：

```java
// net.codelet.cloud.user.query.service.UserQueryService
public interface UserQueryService {
    Page<UserQueryEntity> search(UserQueryDTO query, Pageable pageable);
    UserEntity get(String userId);
}
```

```java
// net.codelet.cloud.user.query.service.impl.UserQueryServiceImpl
@Component
public class UserQueryServiceImpl exends StringRedisService implements UserQueryService, DomainObjectService {

    private final UserQueryRepository userQueryRepository;

    @Autowired
    public UserQueryServiceImpl(StringRedisTemplate stringRedisTemplate, UserQueryRepository userQueryRepository) {
        super(stringRedisTemplate);
        this.userQueryRepository = userQueryRepository;
    }

    @Override
    public Page<UserQueryEntity> search(UserQueryDTO query, Pageable pageable) {
        return userQueryRepository.search(query, pageable);
    }

    @Override
    public get(String userId) {
        return userQueryRepository.findById(userId);
    }

    /* ... */
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@Component`|Spring 将调用构造方法，注入所需组件，并将实例化结果作为 Bean 注册到应用上下文中|
|`@Autowired`|作用与构造方法时，Spring 将根据方法的参数名从上下文中获取相应的 Bean 并注入到构造方法中|

## REST API 接口定义及实现

下面以用户查询为例：

```java
// net.codelet.cloud.user.query.api.UserQueryApi
@FeignClient(
    contextId = "user-query",
    name = "${services.user.query.name:user-query}"
)
public interface UserQueryApi {

    @GetMapping("/users")
    Page<UserQueryEntity> search(@SpringQueryMap UserQueryDTO query);

    @GetMapping("/users/{userId}")
    UserQueryEntity get(@PathVariable("userId") String userId);
}
```

```java
// net.codelet.cloud.user.query.controller.UserQueryController
@Api(tags = {"用户账号"})
@RestController
public class UserQueryController extends BaseController implements UserQueryApi {

    private final UserQueryService userQueryService;

    @Autowired
    public UserQueryController(@Valid UserQueryService userQueryService) {
        this.userQueryService = userQueryService;
    }

    @Override
    @ApiOperation("查询用户")
    public Page<UserQueryEntity> search(UserQueryDTO query) {
        return userQueryService.search(query, query.toPageable());
    }

    @Override
    @ApiOperation("取得用户信息")
    public UserQueryEntity get(@ApiParam("用户 ID") String userId) {
        return userQueryService.get(userId);
    }
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@FeignClient`|Spring 框架将根据 REST API 接口实现 HTTP 客户端|
|`@GetMapping`|定义一个请求方法为 GET 的 REST 路由，另有 `@PostMapping`、`@PutMapping`、`@PatchMapping`、`@DeleteMapping` 等|
|`@SpringQueryMap`|将一个对象或 Map 以 Query 字符串形式传递（而不是作为请求数据 JSON 的形式）|
|`@PathVariable`|定义 REST API 路径参数|
|`@Api`|Swagger API 文档标签|
|`@RestController`|标明当前类为一个 REST 控制器|
|`@ApiOperation`|对 REST 路由进行说明|
|`@ApiParam`|对参数进行说明|
|`@Valid`|根据 POJO 类中属性的校验注解对属性进行校验，以保证数据的有效性，校验注解说明参照下表|

表单数据校验注解说明：

|注解|示例|说明|
|:---|:---|:---|
|`@NotNull`|`@NotNull`|不可为 null|
|`@NotEmpty`|`@NotEmpty`|不可为 null、空字符串、空集合|
|`@NotBlank`|`@NotBlank`|不可为 null 或空白字符|
|`@Size`|`@Size(min = 3, max = 16)`|字符串或集合长度必须在 3（含）到 16（含）之间|
|`@Min`|`@Min(0)`|不得小于 0|
|`@Max`|`@Max(16)`|不得大于 16|
|`@Pattern`|`@Pattern(regexp = "^[a-zA-Z][0-9a-zA-Z]{2,23}$")`|由英文字母及数字组成，且第一个字符必须为字母，且总长度必须在 3（含）到 24（含）位之间|
|`@Email`|`@Email`|必须符合电子邮箱地址格式|

## HTTP 响应数据的数据结构说明

控制器方法的返回结果将会被包装成 JSON API 的格式（参照 `net.codelet.cloud.aspect.JsonApiResponseAspect`）返回给客户端。

> 通过 FeignClient 调用其他服务时通过 `net.codelet.cloud.feign.ResponseDecoder` 对转换后的数据进行解码。 

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
  "data": [
    {
      "id": "BMEDYJ5S1DY5PPQH",
      "name": "郭强",
      "createdBy": {"$ref": "BMEDYH6EP4Q97Z0M"}
    },
    {
      "id": "BMEDYHJB21ULW3AY",
      "name": "姜旭光",
      "createdBy": {"$ref": "BMEDYH6EP4Q97Z0M"}
    }
  ],
  "included": {
    "BMEDYH6EP4Q97Z0M": {
      "name": "system"
    }
  }
}
```

![configure pipeline](/img/framework/development/03-04-json-api.png)

## 国际化（i18n）

国际化消息文件位于模块的 src/main/resources 下，文件名格式为 `messages_语言代码.properties`。

如：

* messages.properties：默认语言（英文）
* messages_zh_CN.properties：简体中文
* messages_jp.properties：日文

下面以用的登录为例：

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

```java
// net.codelet.cloud.auth.command.dto.CredentialDTO
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

> 客户端语言通过 `Accept-Language` 请求头设置。

## 启动类配置

下面以组织查询为例：

```java
// net.codelet.cloud.organization.query.OrganizationQueryStarter
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EnableFeignClients({"net.codelet.cloud.user.query.api"})
@EntityScan({"net.codelet.cloud"})
@EnableJpaRepositories({"net.codelet.cloud"})
@ComponentScan({"net.codelet.cloud"})
@EnableDiscoveryClient
public class OrganizationQueryStarter {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(OrganizationQueryStarter.class);
        application.addListeners(new ApplicationPidFileWriter("./organization-query.pid"));
    }
}
```

注解说明：

|注解|说明|
|:---|:---|
|`@SpringBootApplication`|表示当前模块为一个 Spring Boot 应用|
|`@EnableFeignClients`|Spring 将根据指定包内带有 @FeignClient 注解的接口生成 FeignClient Bean|
|`@EntityScan`|扫描指定包下的数据实体|
|`@EnableJpaRepositories`|Spring 将根据指定的包内的 Repository 接口的定义生成数据仓库的 Bean|
|`@ComponentScan`|扫描置顶包下的组件、服务、配置等 Bean|
|`@EnableDiscoveryClient`|当前模块的服务启动后将注册到服务注册中心|

## 应用配置

Spring Boot 工程通过 src/resources/ 下的 application.yml 文件对应用进行配置。

工程的配置可以存放在多个配置文件中，每一个文件对应一个 profile，并命名为 application-profile.yml，

例如，可以将通用配置保存在 application.yml 文件中，将开发环境和产品环境的配置分别保存在 application-development.yml 和 application-production.yml 文件中。

工程打包后，通过 Java 的 `-D` 参数指定 `spring.profiles.active` 全局变量即可选择要使用的配置（也可以在 application.yml 文件中设置）。

```shell
$ java -Dspring.profiles.active=production -jar ./user-query-0.0.1-SNAPSHOT.jar
```

application.yml 示例：

```yaml
server:
    port: 8041

spring:
    application:
        name: user-query
    cloud:
        consul:
            host: 192.168.1.247
            port: 8940
            discovery:
                enabled: true
                tags: domain=user,type=query
    jpa:
        database-platform: org.hibernate.dialect.MySQL5InnoDBDialect
        show-sql: false
        hibernate:
            ddl-auto: none
    datasource:
        url: jdbc:mysql://192.168.1.247:3306/codelet_cloud_user?useUnicode=true&characterEncoding=utf-8&useSSL=false

        username: codelet
        password: 1qazxsw2
        hikari:
            connection-timeout: 60000
            minimum-idle: 5
            maximum-pool-size: 50
            idle-timeout: 120000
            max-lifetime: 240000
            auto-commit: true
    redis:
        host: 192.168.1.247
        port: 6301
        password: 1qazxsw2
        database: 0
    mail:
        default-encoding: UTF-8
        host: smtp.mail.com
        port: 25
        protocol: smtp
        username: codelet@mail.com
        password: Pa5sw0rd
        properties:
            mail:
                smtp:
                    auth: true
                    starttls:
                        enable: true
                        required: true
                    connectionTimeout: 60000
                    tiimeout: 60000
                    writetimeout: 60000
debug: false
```

连接到 Redis 集群时使用如下配置：

```yaml
spring:
    redis:
        cluster:
            nodes: 192.168.1.247:6301,192.168.1.248:6301,192.168.1.249:6301
            max-redirects: 8
        password: 1qazxsw2
        database: 0
```

可以自定义配置，例如：

```yaml
application:
    security:
        access-token-key: MXviFblBleCahWxkR8pXEXq3smAmpLWDqbvl
        access-token-ttl: 1296000
        access-token-renew-frequency: 86400
    cache:
        ttl:
            user-agent-id: 60
            access-token-renewed-at: 15
```

将应用配置注入到 Bean 中：

```java
@Configuration
@PropertySource("classpath:application.yml")
@ConfigurationProperties(prefix = "application.security")
public class SecurityConfiguration {

    private String accessTokenKey;

    private long accessTokenTtl;

    private long accessTokenRenewFrequency;

    /* Getters/Setters ... */
}
```

还可以使用 @Value 注解：

```java
@Component
public class SecurityConfiguration {

    @Value("${application.security.access-token-key:Default}")
    private String accessTokenKey;

    @Value("${application.security.access-token-ttl}")
    private long accessTokenTtl;

    @Value("${application.security.access-token-renew-frequency}")
    private long accessTokenRenewFrequency;

    /* Getters/Setters ... */
}
```
