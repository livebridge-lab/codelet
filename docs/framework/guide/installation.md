---
id: installation
title: 环境搭建
---

## 所需组件

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

## 集成开发环境

* IntelliJ IDEA 2017.3 或 Eclipse Oxygen.2

## 设置 Maven 镜像库

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

## 主要依赖说明

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