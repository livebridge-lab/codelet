---
id: doc9
title: 系统架构
---
## 开发环境搭建

### 所需组件

* JDK：[1.8.171](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) - Java 开发工具包
* Maven：[3.5.4](http://maven.apache.org/download.cgi) - Java 依赖包管理工具
* Redis：[4.0.1](http://download.redis.io/releases/) - 内存型数据库
* MySQL：[5.7.21](https://www.mysql.com/) - 关系型数据库
* Elasticsearch：[5.5.0](https://www.elastic.co/downloads/elasticsearch) - 全文检索引擎
* ImageMagick：[6.9.2-10](http://www.imagemagick.org/script/download.php) - 图像处理工具
* FFmpeg：[3.4.2](http://ffmpeg.org/download.html) - 音频/视频处理工具
* MooseFS：[3.0.97](https://moosefs.com/download/) - 分布式文件系统

> Elasticsearch 用于文件管理子系统的文件查询以及各子系统的日志查询。

> 需要为 Elasticsearch 添加中文分词插件 [IK](https://github.com/medcl/elasticsearch-analysis-ik/tree/master)，注意选择与 Elasticsearch 匹配的版本。

> ImageMagick 和 FFmpeg 在开发环境作为可选组件，当需要处理媒体文件时使用。

> MooseFS 仅在产品环境必须。

### 集成开发环境

* IntelliJ IDEA 2017.3 或 Eclipse Oxygen.2

### 设置 Maven 镜像库

配置 settings.xml 文件，添加镜像以提高依赖包的下载速度。

```xml
<mirrors>
  <mirror>
    <id>repo1</id>
    <mirrorOf>central</mirrorOf>
    <name>Maven Repo #1</name>
    <url>http://repo1.maven.org/maven2/</url>
  </mirror>
  <mirror>
    <id>repo2</id>
    <mirrorOf>central</mirrorOf>
    <name>Maven Repo #2</name>
    <url>http://repo2.maven.org/maven2/</url>
  </mirror>
</mirrors>
```

下载 [settings.xml](/file/settings.xml)，并将其置于个人 Maven 本地库根路径下（`~/.m2/`）。

在工程的根路径下（即 `pom.xml` 文件所在位置）执行以下命令工程代码将被编译并打包（打包文件将被输出到各子工程的 `target` 路径下）：

```bash
$ mvn package
```

> 打包文件的类型通过 `pom.xml` 的 `<package>` 设置，可选值如 `jar`、`war`、`pom`。

> 当存在子工程时，父级工程的打包类型应设置为 `pom`，父级工程不会被打包成 `.jar` 或 `.war` 文件。

执行以下命令将工程代码编译、打包，并将打包文件将被安装到 Maven 本地库中（`~/.m2/repository/`）：

```bash
$ mvn install
```

> 通过将代码编译、打包、安装使工程代码可以被其他工程依赖使用。

有时需要先清理已安装到本地库中的包，再执行安装：

```bash
$ mvn clean install
```

### 主要依赖说明

Maven 工程通过 `pom.xml` 文件（位于工程的根路径下）配置工程基本信息，其中 `<dependencies>` 元素内的节点为工程所依赖的库。

|Group ID|Artifact ID|版本|说明|参考|
|:---|:---|:---|:---|:---|
|org.springframework|spring-web|5.0.6.RELEASE|Spring Web 基础支持|&nbsp;|
|org.springframework|spring-orm|5.0.6.RELEASE|Spring ORM 基础支持|&nbsp;|
|org.springframework.data|spring-data-commons|2.0.7.RELEASE|Spring Data|&nbsp;|
|org.springframework.data|spring-data-redis|2.0.2.RELEASE|Spring Data Redis|&nbsp;|
|org.springframework.boot|spring-boot-starter-web|2.0.2.RELEASE|Spring Boot Web 应用启动器|&nbsp;|
|org.springframework.boot|spring-boot-configuration-processor|2.0.2.RELEASE|Spring Boot 配置处理器|&nbsp;|
|org.springframework.boot|spring-boot-starter-aop|2.0.2.RELEASE|Spring Boot AOP 支持|&nbsp;|
|org.springframework.boot|spring-boot-starter-data-jpa|2.0.2.RELEASE|Spring Data JPA|&nbsp;|
|org.springframework.boot|spring-boot-starter-security|2.0.2.RELEASE|Spring Security|&nbsp;|
|org.springframework.boot|spring-boot-starter-mail|2.0.2.RELEASE|邮件发送|&nbsp;|
|org.springframework.cloud|spring-cloud-config-server|2.0.0.RELEASE|配置中心服务器|&nbsp;|
|org.springframework.cloud|spring-cloud-starter-netflix-eureka-server|2.0.0.RELEASE|Eureka 服务器（注册中心）|&nbsp;|
|org.springframework.cloud|spring-cloud-starter-netflix-eureka-client|2.0.0.RELEASE|Eureka 客户端|&nbsp;|
|org.springframework.cloud|spring-cloud-starter-openfeign|2.0.0.RELEASE|Eureka 服务的 HTTP 客户端|&nbsp;|
|org.springframework.security|spring-security-web|5.0.5.RELEASE|Spring Security|&nbsp;|
|org.apache.tomcat.embed|tomcat-embed-core|8.5.31|HTTP 服务支持，如 HTTP 请求及响应|&nbsp;|
|com.fasterxml.jackson.core|jackson-core|2.9.0|Jackson 核心库|[GitHub: Jackson](https://github.com/FasterXML/jackson)|
|com.fasterxml.jackson.core|jackson-databind|2.9.0|Jackson 数据绑定|&nbsp;|
|com.fasterxml.jackson.core|jackson-annotations|2.9.0|Jackson 注解|&nbsp;|
|org.hibernate|hibernate-core|5.2.17.Final|Hibernate 核心库|&nbsp;|
|org.hibernate.javax.persistence|hibernate-jpa-2.1-api|1.0.2|JPA 实现，数据实体定义等|&nbsp;|
|mysql|mysql-connector-java|5.1.46|MySQL 的 Java 连接器|&nbsp;|
|redis.clients|jedis|2.9.0|[Redis](https://redis.io/) 的 Java 客户端|[GitHub: Jedis](https://github.com/xetorthio/jedis)|
|io.jsonwebtoken|jjwt|0.9.0|[JSON Web Token](https://jwt.io/) 的 Java 实现|[GitHub: Java JWT](https://github.com/jwtk/jjwt)|
|io.springfox|springfox-swagger2|2.9.0|基于 [Swagger](https://swagger.io/) 的 API 文档生成工具|[Springfox Reference Documentation](http://springfox.github.io/springfox/docs/current/#maven)|
|io.swagger|swagger-core|2.0.2|API 文档相关注解|&nbsp;|

> Spring Boot 内置 [Tomcat](http://tomcat.apache.org/) 服务器，因此 Spring Boot 工程可打包成可执行并独立提供 HTTP 服务的 JAR 包。

> JPA 即 [Java 持久化 API](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html)，[Hibernate](http://hibernate.org/) 是一个 ORM 框架，即 JPA 的实现，[Spring Data JPA](https://projects.spring.io/spring-data-jpa/) 通过使用 ORM（如 Hibernate）提供了数据仓库（Repository）层的实现。

> Spring Boot 通过 `src/main/resources` 下的 `bootstrap.properties` 和 `application[-配置名].properties` 文件对应用进行配置，其中 `bootstrap.properties` 在应用启动前加载，用于指定应用的名称、配置服务器的连接等。

> 配置中心服务向其他服务提供通用的配置文件，配置文件命名格式为 `应用名[-配置名].properties`，如 `wison-production.properties`，不指定配置名时代表默认配置。一个应用可以同时使用多个配置（通过 Java 的 `-D` 启动参数或 `bootstrap.properties` 中的 `spring.profiles.active` 配置），且存在默认配置时首先加载默认配置。

> Eureka 是 Spring 的服务注册与服务自动发现系统，通过 OpenFeign 可以调用在 Eureka 注册中心注册的服务，从而实现服务间的调用。

## 工程结构

> 工程库包含 `master`、`development`、`wison-auth`、`wison-docs`、`wison-bpm` 等分支，分别为主、开发、用户认证子系统、文件管理子系统和业务流程管理子系统分支。

> 请分别在子系统分支上开发相应的业务，并在发布前从开发分支拉取最新代码并将子系统分支上的代码合并到开发分支上，合并后请确保能够顺利通过编译再将代码推送到工程代码库。

### 工程目录结构

```tree
/wison-parent
  │
  ├─ wison-config                      配置服务/服务注册中心
  │   └─ src/main
  │       ├─ java
  │       │   └─ com/wison/config
  │       │       └─ ConfigApp.java    配置服务/服务注册中心入口类
  │       └─ resources                 配置文件等（配置文件也可选用 Git 作为仓库）
  │
  ├─ wison-base                        其他工程依赖的基础工程
  │   └─ src/main
  │       └─ java
  │           └─ com/wison
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
  ├─ wison-auth-api                    用户认证子系统的接口工程
  │   └─ src/main
  │       └─ java
  │           └─ com/wison/auth
  │               ├─ dto               用户认证业务接口数据传输对象（如用户创建表单、查询参数等）
  │               ├─ entity            用户认证业务相关数据实体（如用户、组织、角色、访问令牌等）
  │               └─ api               用户认证业务接口定义
  │
  ├─ wison-auth                        用户认证子系统的业务实现工程
  │   └─ src/main
  │       ├─ java
  │       │   └─ com/wison/auth
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
  ├─ wison-docs-api                    文件管理子系统的接口工程
  │   └─ ...
  │
  ├─ wison-docs                        文件管理子系统的业务实现工程
  │   └─ ...
  │
  ├─ wison-bpm-api                     工作流子系统的接口更称
  │   └─ ...
  │
  └─ wison-bpm                         工作流子系统的业务实现工程
      └─ ...
```

> `wison-base` 工程提供基础数据结构及**业务无关**的处理逻辑。

> `wison-auth-api`、`wison-docs-api`、`wison-bpm-api` 工程用于定义相应业务实现工程暴露的服务接口及相应的数据结构，从而使得其他服务可以调用相应的接口。

> `wison-auth`、`wison-docs`、`wison-bpm` 是 Spring Boot 工程，实现具体业务，并最终作为 Web/SOAP 服务发布。

> 开发过程中注意要将接口及数据实体的定义与业务逻辑实现分离成 API 工程及业务实现工程。

### 工程间的依赖关系

![工程间依赖关系](/img/dependencies.png)

> 一个业务实现工程通过依赖另一个业务实现工程的 API 工程获得其暴露的服务接口及相关数据结构。例如，用户在使用文件管理子系统（`wison-docs`）的服务操作数据时需要进行身份认证及权限检查，此时文件管理子系统需要调用用户认证子系统（`wison-auth`）的服务，因此文件管理子系统需要依赖用户认证子系统的 API 工程（`wision-auth-api`）以获取相关接口信息及相关数据结构（数据传输对象、数据实体等信息）。

## 开发流程

### 应用配置

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

### Swagger 配置

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

### 数据传输对象（DTO）定义

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

### 数据实体（Entity）定义

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

### 数据仓库（Repository）接口定义

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

### Redis 缓存操作

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

### 业务服务（Domain Service）

业务服务通过调用数据仓库接口对数据库数据、文件等信息进行一系列操作，实现具体业务逻辑。根据开发规范，应先为业务服务定义接口，在对其进行实现。

关于配置信息读取、数据仓库接口绑定、Redis 连接注入等内容已在上文进行了说明。

### 路由及控制器（Request Mapping &amp; Controller）

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

### 访问其他服务提供的接口

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

### 控制器权限检查（除 `wison-auth` 工程以外的业务实现工程）

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

## 请求响应数据结构

### 继承关系

除非业务特殊需要，所有 HTTP 响应都应通过 `wison-base` 工程中定义的 `com.wison.response.JsonResponseBody` 或其派生类返回。

<!-- <img src="./images/json-response-body.png" alt="请求响应数据结构继承关系" title="请求响应数据结构继承关系" class="figure" style="max-width: 675px;"> -->

![请求响应数据结构继承关系](/img/json-response-body.png)

> 响应数据结构的定义位于 `wison-base` 工程的 `com.wison.response` 包内。

> `JsonResponseBody` 为基类，可用于描述不返回任何查询结果的响应。

> `JsonDataResponseBody` 为一个抽象类，其派生类 `JsonObjectResponseBody` 和 `JsonListResponseBody` 分别用于描述返回单个数据和返回列表数据的响应。

> 不仅仅是登录授权请求，任何需要认证信息的请求（要求设置 `Authorization` 请求头的请求）都可能返回用户访问令牌（`accessToken`）属性。当服务器响应数据中包含用户访问令牌时，客户端应该用取得的用户访问令牌更新本地缓存的用户访问令牌，并在后续请求中使用新的用户访问令牌。

### 响应数据结构说明

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

### 设置引用数据

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

## 表单数据校验

为 DTO 的属性添加相应的注解，从而定义属性的有效性，如必要性、最大值、最小值、格式等。

为控制器方法的相应参数添加 `@Valid` 注解，从而在方法执行前执行参数的有效性检查。

### DTO 定义

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

### 校验注解示例

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

### 控制器方法定义

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

### 响应数据

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
