---
id: develop_view
title: 开发流程
---

## 应用配置

Spring Boot 工程默认通过 `src/resources/` 下的 `application.properties` 文件对应用进行配置。

Spring Boot 工程的配置可以存放在多个配置文件中，每一个文件对应一个 `profile`，并命名为 `application-${profile}.properties`，例如，可以将通用配置保存在 `application.properties` 文件中，将开发环境和产品环境的配置分别保存在 `application-development.properties` 和 `application-production.properties` 文件中。

工程打包后，通过 Java 的 `-D` 参数指定 `spring.profiles.active` 全局变量即可选择要使用的配置（也可以在 `application.properties` 文件中设置）。

```bash
$ java -Dspring.profiles.active=production -jar ./wison-auth-0.0.1-SNAPSHOT.jar
```

Spring 常用配置：

|属性|示例值|说明|
|:---|:---|:---|
|server.port|`8810`|HTTP 服务端口号|
|spring.jpa.database-platform|`org.hibernate.dialect.MySQL5InnoDBDialect`|指定数据库平台|
|spring.jpa.hibernate.ddl-auto|`none`|是否根据数据实体定义自动执行 DDL|
|spring.jpa.show-sql|`false`|是否在日志中输出 SQL 语句|
|spring.datasource.url|`jdbc:mysql://127.0.0.1:3306/wison_auth?useSSL=false`|数据库连接字符|
|spring.datasource.username|`backend`|数据库用户名|
|spring.datasource.password|`******`|数据库用户密码|
|spring.redis.host|`127.0.0.1`|Redis 服务主机名|
|spring.redis.port|`6379`|Redis 服务端口|
|spring.redis.password|`******`|Redis 连接密码|
|spring.redis.database|`0`|Redis 数据库|

> `spring.jpa.hibernate.ddl-auto` 的可选值有 `none`（不执行 DDL 操作）、`create`（每次启动都会执行建表操作，将会清空原有数据）、`create-drop`（结束时清空所有表）、`update`（仅执行更新）、`validate`（仅校验数据实体定义与数据库是否一致）。

> **注意：不要在产品环境执行 DDL 操作。**

可以自定义应用配置，例如 `wison-auth` 工程扩展的应用配置：

|属性|示例值|说明|
|:---|:---|:---|
|application.security.access-token-key|`A1b2C3d4E5f6`|用户访问令牌加密密钥|
|application.security.access-token-ttl|`1296000`|用户访问令牌有效期（秒）|
|application.security.access-token-renew-frequency|`86400`|用户访问令牌刷新频率（秒）|
|application.cache.ttl.user-agent-id|`60`|用户代理字符串 ID 在缓存中的保存时长（秒）|
|application.cache.ttl.access-token-renewed-at|`10`|用户访问令牌最后更新时间在缓存中的保存时长（秒）|

配置信息的读取请参考 `wison-auth` 工程的 `com.wison.auth.config.SecurityConfiguration`：

```java
@Configuration
@PropertySource("classpath:application.properties") // 配置文件名
@ConfigurationProperties(prefix = "application.security") // 自定义配置的前缀
public class SecurityConfiguration {

    private String accessTokenKey;
    private long accessTokenTtl;
    private long accessTokenRenewFrequency;

    /* Getters/Setters ... */

}
```

> Spring 会将配置的属性名由 Kebab Case 转为 Camel Case，然后与 Java 对象的属性匹配，完成配置信息的注入。

配置信息的注入请参考 `wison-auth` 工程的 `com.wison.auth.domain.model.service.AccessTokenService`：

```java
@Component
@EnableConfigurationProperties(SecurityConfiguration.class)
public class AccessTokenService implements AccessTokenInterface {

    private final String accessTokenSecretKey;

    /**
     * 构造方法。
     */
    @Autowired
    public AccessTokenService(SecurityConfiguration securityConfiguration) {
        this.accessTokenSecretKey = securityConfiguration.getAccessTokenKey();
    }

    /* 业务逻辑 ... */

}
```

## Swagger 配置

Swagger 的视图层位于 Spring Boot 工程的 `src/main/resources/swagger/dist/` 中，配置文件为 `src/main/resources/swagger.properties`。

Swagger 的配置参考 `wison-auth` 工程的 `com.wison.auth.config.Swagger2Configuration`：

```java
@Configuration
@EnableSwagger2
@PropertySource("classpath:swagger.properties")
public class Swagger2Configuration {

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(
                new ApiInfoBuilder()
                    .title("用户认证系统 API 文档")
                    .description("惠生业务流程管理系统")
                    .version("v0.0.1")
                    .build()
            )
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.wison.auth.controller"))
            .paths(PathSelectors.any())
            .build();
    }

}
```

在 `swagger.properties` 中配置 API 描述文件的访问路由，并修改 `src/main/resources/swagger/dist/index.html` 中相应的链接：

```text
springfox.documentation.swagger.v2.path=/docs/swagger.json
```

下面以通过 `/docs/` 为路由访问生成的文档为例设置 MVC 应用（参考 `wison-auth` 工程的 `com.wison.auth.Application`）：

```java
@SpringBootApplication(scanBasePackages = {"com.wison"})
@EntityScan("com.wison")
@EnableJpaRepositories("com.wison")
@ComponentScan({"com.wison"})
public class Application implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/docs").setViewName("redirect:/docs/");
        registry.addViewController("/docs/").setViewName("forward:/docs/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/docs/**").addResourceLocations("classpath:/swagger/dist/");
    }

    public static void main(String[] args) {
        (new SpringApplication(Application.class)).run(args);
    }

}
```

通过以上配置，应用启动后便可通过 `/docs/` 路径查看 API 文档，例如 `wison-auth` 的 API 文档路径为 [http://114.115.217.120:8810/docs/](http://114.115.217.120:8810/docs/)。

## 数据传输对象（DTO）定义

数据传输对象是一个简单的 POJO 对象，用于描述客户端提交给服务器的数据结构，如 HTTP 请求 URL 中的查询参数（Query String Parameters）、HTTP 请求体数据（HTTP Request Body）等。

所有的数据传输对象都应当继承 `wison-base` 工程的 `com.wison.dto.BaseDTO`。

请在业务实现工程各自的 API 工程定义数据传输对象。

数据查询接口的分页参数请使用 `wison-base` 工程的 `com.wison.dto.PageDTO`。

下面以 `wison-auth-api` 工程的 `com.wison.auth.dto.UserCriteriaDTO` 作为用户查询条件，`wison-base` 工程的 `com.wison.dto.PageDTO` 作为分页设置为例。

```java
public class UserCriteriaDTO extends BaseDTO {

    @ApiModelProperty("姓名")
    private String name;

    @ApiModelProperty("用户登录账号状态")
    private List<String> status;

    /* Getters/Setters ... */

}
```

> `@ApiParam` 注解用于在生成的 API 文档中对字段进行说明。

例如，客户端发送以下请求时

```http
GET /users?name=%E6%9D%8E&status=active&status=disabled&page.no=3&page.size=10&sort=name:asc&sort=id:desc
```

服务器将获得如下查询条件参数

```json
{
  "name": "李",
  "status": ["active", "disabled"]
}
```

以及如下分页参数

```json
{
  "page": {
    "no": 3,
    "size": 10
  },
  "sort": ["name:asc", "id:desc"]
}
```

> `page.no` 为要取得的页号，`page.size` 为分页大小，`sort` 为排序字段的数组。

> Spring Boot 会根据数据传输对象的数据结构自动将查询参数设置到数据传输对象中，具体示例参考下文的**路由及控制器（Request Mapping &amp; Controller）**部分。

上例将使用如下 SQL 语句执行用户查询：

```sql
SELECT
  *
FROM
 `users`
WHERE
  `name` LIKE '%李%'
  AND `status` IN ('active', 'disabled')
ORDER BY
  `name` ASC,
  `id` DESC
LIMIT 20, 10;
```

> Spring Data JPA 数据仓库的查询接口接受一个类型为 `Pageable` 的分页参数，可通过 `PageDTO` 的 `toPageable()` 方法取得。

## 数据实体（Entity）定义

数据实体用于与数据库中的表进行映射。

所有的数据传输对象都应当继承 `wison-base` 工程的 `com.wison.entity.BaseEntity`。如果数据实体中需要包含通用业务信息（如创建时间、最后更新时间等），那么数据实体需要继承 `com.wison.entity.BaseBizEntity`；如果需要对数据实体进行版本管理（如乐观锁），那么数据实体需要继承 `com.wison.entity.BaseVersionedBizEntity`。

> 通过继承 `com.wison.entity.BaseEntity`，数据实体将在构造时生成一个全局唯一 ID（由英文及数字构成的长度为 16 的字符串）。

请在业务实现工程各自的 API 工程定义数据实体。

下面以 `wison-auth-api` 工程的用户数据实体的定义为例。我们将定义四个新的类：`UserBase`、`UserProfile`、`User` 和 `UserBasic`。其中 `UserBase` 是一个抽象类，用于定义用户实体的基本属性。`UserProfile` 和 `User` 继承自 `UserBase`，`UserProfile` 不包含用户登录密码字段，用于查询用户基本信息，`User` 包含用户所有信息，用于对用户数据进行创建、读取及更新。`UserBasic` 直接继承自 `BaseEntity`，仅包含用户最基本的识别信息，用于查询数据实体的创建者、最更新者等信息。

> **注意：当多个数据实体对应同一个数据库表时仅可通过属性完整的数据实体对数据库数据进行写操作。**

<!-- <img src="./images/base-entity.png" alt="数据实体继承关系" title="数据实体继承关系" class="figure" style="max-width: 775px;"> -->

![数据实体继承关系](/img/base-entity.png)

```java
@MappedSuperclass
public abstract class UserBase extends BaseVersionedBizEntity {

    @Column(nullable = false, length = 16)
    private String type;

    @Column(length = 128)
    private String logo;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(length = 32)
    private String username;

    @Column(length = 64)
    private String email;

    @Column(length = 16)
    private String mobile;

    /* Getters/Setters ... */

}
```

> `@MappedSuperclass` 注解用于标明当前类为数据实体的超类。

```java
@Entity
@Table(name = "users")
public class UserProfile extends UserBase {
}
```

> `@Entity` 注解用于标明当前类为数据实体，`@Table` 注解用于标明与之映射的数据库表名。

> 注意：`UserProfile` 没有扩展任何属性是因为一个 Java 类不能同时拥有 `@MappedSuperclass` 和 `@Entity` 注解。

```java
@Entity
@Table(name = "users")
public class User extends UserBase {

    @Column(nullable = false, length = 60)
    private String password;

    /* Getter/Setter ... */

}
```

```java
@Entity
@Table(name = "users")
public class UserBasic extends BaseEntity {

    private String type;

    private String logo;

    private String name;

    /* Getters/Setters ... */

}
```

## 数据仓库（Repository）接口定义

Spring Data JPA 对数据仓库层进行了基本的封装，以便于对数据库数据进行操作。

在 Spring Boot 工程中定义一个数据仓库接口并操作数据的步骤：

* 定义一个接口，该接口继承 `CrudRepository<T, ID>` 接口（或其他继承了 `CrudRepository<T, ID>` 接口的接口）
* 为 Spring Boot 应用入口类添加 `@EntityScan` 和 `@EnableJpaRepositories` 注解，从而让 Spring Boot 在应用启动时自动实例化数据仓库接口
* 为服务绑定数据仓库接口

`CrudRepository<T, ID>` 定义了一些对数据库数据进行基本操作的方法，如 `<S extends T> S save(S)`、`Optional<T> findById(ID id)`、`Iterable<T> findAll()`、`long count()`、`void deleteById(ID id)` 等，也可以在自定义的接口中按照一定的命名规则扩展其他方法，Spring Boot 将会根据方法的返回值、方法的名称及参数自动实现这些方法。

`PagingAndSortingRepository<T, ID>` 继承自 `CrudRepository<T, ID>`，增加了支持分页查询的方法，如 `Iterable<T> findAll(Sort sort)` 和 `Page<T> findAll(Pageable pageable)`。

但是根据 Spring Data JPA 命名规则定义的查询方法难以实现动态查询条件的查询，此时需要通过 Java 的 `EntityManager` 构建查询。

下面以 `wison-auth` 工程的用户数据实体操作（位于 `com.wison.auth.domain.model.repository` 包中）为例进行说明。

首先，定义用户基本信息操作数据仓库接口：

```java
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String> {

    Boolean existsByUsernameAndDeletedIsFalse(String username);

    UserProfile findByUsernameAndDeletedIsFalse(String username);

    @Query("SELECT u FROM UserProfile u WHERE u.username = 'system'")
    UserProfile findSystemUser();

}
```

为 Spring Boot 应用添加 `@EntityScan` 和 `@EnableJpaRepositories` 注解：

```java
@SpringBootApplication(scanBasePackages = {"com.wison"})
@EntityScan("com.wison")
@EnableJpaRepositories("com.wison")
@ComponentScan({"com.wison"})
public class Application implements WebMvcConfigurer {

    public static void main(String[] args) {
        (new SpringApplication(Application.class)).run(args);
    }

}
```

将用户基本信息操作数据仓库接口绑定到服务中：

```java
@Component
public class UserService implements UserInterface {

    private final UserProfileRepository userProfileRepository;

    /**
     * 构造方法。
     */
    @Autowired
    public UserService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    /* 业务逻辑 ... */

}
```

至此便可以在 `UserService` 中调用 `UserProfileRepository` 从父级接口继承的方法以及自定义的 `Boolean existsByUsernameAndDeletedIsFalse(String username)`、`UserProfile findByUsernameAndDeletedIsFalse(String username)`、`UserProfile findSystemUser()` 等方法。

> 如上所述，Spring Boot 应用启动时 Spring 框架会根据 `Boolean existsByUsernameAndDeletedIsFalse(String username)` 的定义实现该方法，其查询逻辑为登录用户名等于 `username` 参数且已删除状态为 `false`，并根据返回值的类型执行存在性检查。`UserProfile findByUsernameAndDeletedIsFalse(String username)` 查询逻辑与 `Boolean existsByUsernameAndDeletedIsFalse(String username)` 相同，但返回值为 `UserProfile` 对象。而 `UserProfile findSystemUser()` 方法由于使用了 `@Query` 注解，Spring 会使用注解中的 SQL 语句进行查询。

如果要为 `UserProfileRepository` 添加支持动态查询条件的方法，需要定义一个自定义数据仓库接口及其实现，使 `UserProfileRepository` 继承该接口，Spring 框架在启动时将会自动将其实现注入到 `UserProfileRepository` 中。

> 根据命名规范，自定义数据仓库接口应命名为 `UserProfileRepositoryCustom`，其实现命名为 `UserProfileRepositoryImpl`。

```java
public interface UserProfileRepositoryCustom {

    Page<UserProfile> search(UserCriteriaDTO criteriaDTO, Pageable pageable);

}
```

```java
public class UserProfileRepositoryImpl extends BaseRepository implements UserProfileRepositoryCustom {

    @Override
    public Page<UserProfile> search(UserCriteriaDTO criteriaDTO, Pageable pageable) {
        return getSQLQueryBuilder(UserProfile.class)
            .in("type", criteriaDTO.getType())
            .like("name", criteriaDTO.getName())
            .is("username", criteriaDTO.getUsername())
            .is("mobile", criteriaDTO.getMobile())
            .is("email", criteriaDTO.getEmail())
            .in("status", criteriaDTO.getStatus())
            .paginate(pageable)
            .exec()
            .page();
    }

}
```

> 所有自定义数据仓库应继承 `wison-base` 中定义的 `com.wision.repository.BaseRepository`，`BaseRepository` 提供了通过 `EntityManager` 构建数据库查询的基本方法，也可以直接获得 `EntityManager` 构建复杂的查询。`EntityManager` 的使用方法参考 `BaseRepository` 的定义。

更新 `UserProfileRepository` 使其继承 `UserProfileRepositoryCustom`：

```java
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String>, UserProfileRepositoryCustom {

    /* 扩展的方法 ... */

}
```

## Redis 缓存操作

要操作 Redis 数据库中的数据，首先需要定义一个 Redis 的配置类，通过该类读取 `application.properties` 中 Redis 服务器的连接配置并建立连接。

下面以 `wison-auth` 工程的 `com.wison.auth.config.RedisConfiguration` 为例。

```java
@Configuration
@PropertySource("classpath:application.properties")
public class RedisConfiguration {

    @Value("${spring.redis.host}")
    private String redisHostName;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Value("${spring.redis.password}")
    private String redisPassword;

    @Value("${spring.redis.database}")
    private int redisDatabase;

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {

        RedisStandaloneConfiguration redisConfig
            = new RedisStandaloneConfiguration();

        redisConfig.setHostName(redisHostName);
        redisConfig.setPort(redisPort);
        redisConfig.setPassword(RedisPassword.of(redisPassword));
        redisConfig.setDatabase(redisDatabase);

        return new JedisConnectionFactory(redisConfig);
    }

    @Bean
    RedisTemplate<Object, Object> redisTemplate() {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(jedisConnectionFactory());
        return redisTemplate;
    }

    @Bean
    RedisCacheManager cacheManager() {
        return RedisCacheManager.create(jedisConnectionFactory());
    }

}
```

在 `UserService` 中取得 Redis 连接：

```java
@Component
public class UserService implements UserInterface {

    private final StringRedisConnection stringRedisConnection;

    /**
     * 构造方法。
     */
    @Autowired
    public UserService(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisConnection = stringRedisTemplate.execute(
            (RedisCallback<StringRedisConnection>) connection
                -> (StringRedisConnection) connection
        );
    }

    private void testRedisConnection() {
        stringRedisConnection.set("hello", "world!");
        stringRedisConnection.expire("hello", 15);
        System.out.println("hello, " + stringRedisConnection.get("hello"));
    }

    /* 业务逻辑 ... */

}
```

## 业务服务（Domain Service）

业务服务通过调用数据仓库接口对数据库数据、文件等信息进行一系列操作，实现具体业务逻辑。根据开发规范，应先为业务服务定义接口，在对其进行实现。

关于配置信息读取、数据仓库接口绑定、Redis 连接注入等内容已在上文进行了说明。

## 路由及控制器（Request Mapping &amp; Controller）

控制器中定义了系统向外界暴露的服务的实现。

所有控制器都应继承 `wison-base` 工程的 `com.wison.controller.BaseController`，`BaseController` 提供了取得 HTTP 请求实例、HTTP 响应实例、上下文对象以及业务错误处理等方法。

所有控制器中的路由处理方法都应返回 `wison-base` 工程的 `com.wison.response.JsonResponseBody` 的实例，`JsonResponseBody` 的具体说明参考下文的**请求响应数据结构**部分。

下面以 `wison-auth` 工程的 `com.wison.auth.controller.UserController` 为例进行说明。

```java
@Api(description = "用户接口")
@RestController
@RequestMapping(value = "/users")
public class UserController extends BaseController implements UserAPI {

    private final UserInterface userService;

    /**
     * 构造方法。
     */
    @Autowired
    public UserController(UserInterface userService) {
        this.userService = userService;
    }


    /**
     * 创建用户账号。
     */
    @Override
    @ApiOperation(value = "创建用户", notes = "创建用户登录账号，需要系统管理员权限。")
    @RequestMapping(method = POST, consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    @ResponseStatus(CREATED)
    public JsonObjectResponseBody<UserProfile> create(
        @RequestBody @ApiParam("用户信息") UserDTO userDTO
    ) {
        ContextDTO context = getContext();
        UserProfile createdUser = userService.create(context.getOperator().getId(), userDTO);
        return new JsonObjectResponseBody<>(context, createdUser);
    }

    /**
     * 查询用户。
     */
    @Override
    @ApiOperation("查询用户信息")
    @RequestMapping(method = GET, consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    public JsonListResponseBody<UserProfile> search(
        UserCriteriaDTO criteria,
        PageDTO page
    ) {
        ContextDTO context = getContext();
        Page<UserProfile> users = userService.search(criteria, page);
        return (new JsonListResponseBody<>(context, users)).setIncluded(userService);
    }

    /**
     * 取得用户信息。
     */
    @Override
    @ApiOperation(value = "取得用户详细信息", notes = "取得当前登录用户信息时将路径参数 <code>userId</code> 设置为 \"<code>current</code>\"。")
    @RequestMapping(method = GET, value = "/{userId}", consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    public JsonObjectResponseBody<UserProfile> get(
        @PathVariable(name = "userId") @ApiParam("用户 ID") String userId
    ) {

        ContextDTO context = getContext();

        if (userId.equals("current")) {
            userId = context.getOperator().getId();
        }

        UserProfile userProfile = userService.get(userId);

        if (userProfile == null) {
            throw new NotFoundError();
        }

        return (new JsonObjectResponseBody<>(context, userProfile)).setIncluded(userService);
    }

    /* 其他 REST 接口实现 ... */

}
```

> `@Api`、`@ApiOperation`、`@ApiParam` 注解用于生成 API 文档说明。

> `@RestController` 注解标明当前类为一个 REST 控制器。

> `@RequestMapping` 注解用于定义路由，该注解位于类上时标明其中所有路由的前缀，路由中的路径参数使用大括号括起，注解的参数 `method`、`value`、`consumes`、`produces` 分别代表支持的请求方法、路径、支持的请求的 Content-Type 以及响应的 Content-Type。例如，访问上述 `JsonObjectResponseBody<UserProfile> get(HttpServletRequest, HttpServletResponse, String)` 方法的路由为 `GET /users/{userId}`，当要取得用户 ID 为 `BMEDYH6EP4Q97Z0M` 的用户信息时请求 URI 为 `GET /users/BMEDYH6EP4Q97Z0M`。

> 使用了 `@RequestBody` 注解的参数将被注入请求体中的数据（HTTP Request Body）；使用了 `@PathVariable` 注解的参数将从请求路径中取得相应的值；未使用注解的参数将从查询参数中取得相应的值（如 `JsonListResponseBody<UserProfile> search(HttpServletRequest, HttpServletResponse, UserCriteriaDTO, PageDTO)` 的查询条件参数和分页参数）。

> `@ResponseStatus` 注解标明了请求被成功处理时的 HTTP 状态码，默认为 `200 OK`，创建新资源的请求应返回 `201 Created`。

## 访问其他服务提供的接口

提供接口的服务需要将自己的启动类标注为 Eureka 客户端（`@EnableEurekaClient` 注解）并注册到 Eureka 注册中心。

> 参考 `wison-auth` 的启动类设置及应用配置。

在向外提供服务的控制器的接口定义上添加 `@FeignClient("服务ID")` 注解，从而使得调用方在启动时可以将该接口实例化为 Feign 客户端。

> 参考 `wison-auth-api` 的 `com.wison.auth.api.UserFeignAPI`。

```java
@FeignClient("wison-auth")
@RequestMapping("/users")
public interface UserFeignAPI {

    @RequestMapping(method = POST, consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    JsonObjectResponseBody<UserProfile> create(@RequestBody UserDTO userDTO);

    @RequestMapping(method = GET, value = "/{userId}", produces = APPLICATION_JSON_VALUE)
    JsonObjectResponseBody<UserProfile> get(@PathVariable("userId") String userId);

    /* ... */

    @RequestMapping(method = DELETE, value = "/{userId}", produces = APPLICATION_JSON_VALUE)
    JsonResponseBody delete(@PathVariable("userId") String userId, @RequestParam("version") long version);

}
```

> 作为 Feign 客户端时存在以下限制：
> 1. 必须通过 `@RequestMapping` 注解定义路由且必须指定 `method` 参数，若使用 `@GetMapping` 等注解将会报请求方法未指定错误
> 1. 不可通过对象（复合数据类型）定义查询参数，且查询参数必须通过 `@RequestParam` 注解定义
> 1. 参数的注解（`@PathVariable` 和 `@RequestParam`）必须指定参数名

使用接口的服务需要将自己的启动类标注为 Eureka 客户端（`@EnableEurekaClient` 注解）及启用 Feign 客户端（`@EnableFeignClients` 注解），并在应用配置中设置注册中心地址。

> 参考 `wison-docs` 的启动类设置及应用配置。

此时便可通过提供方定义的接口访问服务。

> 参考 `wison-docs` 的 `com.wison.docs.controller.FileController`。

```java
@RestController
@RequestMapping("/files")
public class FileController extends BaseController implements FileAPI {

    private UserFeignAPI userFeignAPI;

    /**
     * 构造方法。
     */
    @Autowired
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    public FileController(UserFeignAPI userFeignAPI) {
        this.userFeignAPI = userFeignAPI;
    }

    @Override
    @RequestMapping(method = GET, value = "/groups/{groupId}/docs", consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    public JsonListResponseBody<Document> search(@PathVariable String groupId, FileCriteriaDTO fileCriteriaDTO) {

        JsonObjectResponseBody<UserProfile> response = userFeignAPI.get("current");

        /* 业务实现 ... */

        return new JsonListResponseBody<>(getContext(), documents);
    }

    /* 其他接口定义 ... */
}
```

> Feign 向其他服务发送请求时请求头 `Origin`、`User-Agent`、`Authorization`、`Accept-Language` 将从当前 HTTP 请求实例中取得并设置，客户端远程 IP 地址将被作为 `X-Forwarded-For` 请求头被设置。具体实现参考 `wison-base` 的 `com.wison.feign.RequestHeadersInterceptor`。

> 当访问的接口返回业务错误时，错误将会被当作异常抛出。具体实现参考 `wison-base` 的 `com.wison.feign.ResponseErrorDecoder`。

> IDE 可能无法确认相应的接口能否被实例化（因为发起请求的服务中没有实现类而 IDE 可能未加入对 `@FeignClient` 注解的支持），因此需要在自动绑定的代码上添加 `@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")` 注解以忽略警告。

> 注意：此处的 `UserFeignAPI` 是 `wison-auth` 提供的用户账号相关接口的子集，排除了分页多条件查询方法 `JsonListResponseBody<UserProfile> search(UserCriteriaDTO criteria, PageDTO page);`（`UserAPI` 通过扩展 `UserFeignAPI` 定义该方法），这是因为没有被标注的对象参数会被 Feign 视为 Request Body，而一个请求只能定义一个 Request Body 参数。因此，通过 Feign 调用时，若需要多个查询参数，必须通过 `@RequestParam` 注解分别定义（而 Spring REST Controller 解析请求时可以将多个查询参数设置到一个对象中）。

## 控制器权限检查（除 `wison-auth` 工程以外的业务实现工程）

要实现控制器上的权限检查，需要依赖 `wison-auth-api` 工程，并在控制器实现的方法上使用 `@WithPrivilege` 注解。

```java
@RestController
public class FileController extends BaseController implements FileAPI {

    /* 成员定义、构造方法、接口实现 ... */

    /**
     * 上传文件。
     */
    @RequestMapping(method = POST, value = "/groups/{groupId}/docs", consumes = ALL_VALUE, produces = APPLICATION_JSON_VALUE)
    @ResponseStatus(CREATED)
    @WithPrivilege(privileges = Privileges.DOCUMENT)
    public JsonResponseBody post(@PathVariable String groupId) {
        /* 业务实现 */
        return new JsonResponseBody();
    }

    /* 其他接口实现 ... */
}

```

> `@WithPrivilege` 注解包括以下几个参数：
> 1. `required`，用户是否必须已完成认证，默认为 `true`
> 1. `type`，认证类型，默认为 `Bearer`
> 1. `groupId`，组织 ID 参数在路径参数中的参数名称，默认为 `groupId`
> 1. `resourceType`，目标资源的类型
> 1. `resourceId`，目标资源 ID 参数在路径参数中的参数名称
> 1. `privileges`，所需权限

> 权限检查的执行逻辑：
> 1. 若不要求用户必须已完成认证且请求头中未包含授权信息（`Authorization` 请求头）则通过检查并结束
> 1. 否则，若未设置授权信息，或授权类型不正确，或授权信息无效则返回相应的错误
> 1. 从请求路径中取得组织 ID 和目标资源 ID
> 1. 通过授权信息取得用户信息，并判断用户是否在指定的组织拥有操作指定资源的权限

> `groupId` 和 `resourceId` 是否必要取决于具体业务逻辑。

