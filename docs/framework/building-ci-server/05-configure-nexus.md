---
id: configure-nexus
title: 创建私有 Maven 仓库
---

启动 Nexus Repository Manager OSS 服务后使用浏览器访问以下链接，进入首页，并通过 Sign In 按钮登录：

```text
http://192.168.1.247:8910
```

首次登录会提示 admin 账号的初始密码在服务器上的保存路径，并在初次登录后要求重置密码。

通过 Server administration and configuration 标签的 Security > Users 添加用户“codelet”，并授权为 nx-admin。

使用新用户登录，通过 Repository > Repositories 创建新仓库。

> 仓库类型：
> 
> |类型|说明|
> |:---|:---|
> |hosted|本地仓库|
> |proxy|代理仓库，用来代理远程公共仓库，如 Maven 中央仓库|
> |group|用于合并多个 hosted 或 proxy 仓库|
> 
> 版本策略：
> 
> |策略|说明|
> |:---|:---|
> |snapshot|快照，即调试版本，同一版本号内容可能会被修改|
> |release|发布版，同一版本号内容不可修改|

首先创建一个 maven2 (hosted) 类型的 Snapshot 仓库，属性如下：

|属性|值|说明|
|:---|:---|:---|
|name|codelet-cloud-snapshots||
|Maven 2 / Version policy|Snapshot|快照（调试）版|
|Maven 2 / Layout policy|Permissive||
|Storage / Blob store|default||
|Storage / Strict Content Type Validation|取消|不进行 Content Type 检查|
|Hosted / Deployment policy|Allow redeploy|快照版允许重新部署|
|Clean Policy / Available cleanup policies|None||

![codelet-cloud-snapshots](/img/framework/building-ci-server/05-01-snapshots.png)

再创建一个 maven2 (hosted) 类型的 Release 仓库，属性如下：

|属性|值|说明|
|:---|:---|:---|
|name|codelet-cloud-releases||
|Maven 2 / Version policy|Release|发行版|
|Maven 2 / Layout policy|Permissive||
|Storage / Blob store|default||
|Storage / Strict Content Type Validation|取消|不进行 Content Type 检查|
|Hosted / Deployment policy|Disable redeploy|发行版不允许重新部署|
|Clean Policy / Available cleanup policies|None||

![codelet-cloud-releases](/img/framework/building-ci-server/05-02-releases.png)

最后，创建一个 group 类型的 maven2 仓库，用来合并 codelet-cloud-snapshots、codelet-cloud-releases 和 Maven 中央库，属性如下：

|属性|值|说明|
|:---|:---|:---|
|name|codelet-cloud-public||
|Storage / Blob store|default||
|Storage / Strict Content Type Validation|取消|不进行 Content Type 检查|
|Group / Member repositories|codelet-cloud-releases<br>codelet-cloud-snapshots<br>maven-releases<br>maven-snapshots<br>maven-central||

![codelet-cloud-public](/img/framework/building-ci-server/05-03-public.png)

创建 Maven 配置文件 ~/.m2/settings.xml 并设置以下内容：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <pluginGroups>
        <pluginGroup>org.sonatype.plugins</pluginGroup>
    </pluginGroups>

    <proxies/>

    <servers>
        <server>
            <id>nexus</id>
            <username>codelet</username>
            <password>Pas5w0rd</password>
        </server>
    </servers>

    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <url>http://ciserver:8910/repository/codelet-cloud-public/</url>
        </mirror>
        <mirror>
            <id>repo1</id>
            <mirrorOf>central</mirrorOf>
            <name>Maven Central Repository #1</name>
            <url>http://repo1.maven.org/maven2/</url>
        </mirror>
        <mirror>
            <id>repo2</id>
            <mirrorOf>central</mirrorOf>
            <name>Maven Central Repository #2</name>
            <url>http://repo2.maven.org/maven2/</url>
        </mirror>
    </mirrors>

    <profiles>
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>central</id>
                    <url>http://central</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>central</id>
                    <url>http://central</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>

    <activeProfiles>
        <activeProfile>nexus</activeProfile>
    </activeProfiles>

</settings>
```

通过以上配置，在服务器上执行 Maven 部署命令时，编译结果将被发布到 Nexus Repository Manager OSS 的 codelet-cloud-public 中：

```shell
$ mvn clean deploy
```

![browse repositories](/img/framework/building-ci-server/05-04-browse.png)

Nexus 会为每次提交的 Snapshot 保留历史，为避免历史版本占用过多磁盘空间，需要创建 Snapshot 清理任务。

通过 System > Tasks 创建类型为 Maven - Delete SNAPSHOT 的任务，属性如下：

|属性|值|说明|
|:---|:---|:---|
|Task enabled|启用||
|Task name|codelet-cloud-clean-snapshots||
|Repository|codelet-cloud-snapshots||
|Minimum snapshot count|1|不论其他条件如何设置，都将至少保留一个 Snapshot|
|Snapshot retention (days)|0|保留最新的 Snapshot，删除所有其他 Snapshot|
|Task frequency|Advanced|使用 CRON 表达式设置任务的执行频率|
|CRON expression|0 */5 * * * ?|每五分钟执行一次|

![browse repositories](/img/framework/building-ci-server/05-05-clean-snapshots.png)

通过 System > Tasks 创建类型为 Admin - Compact blob store 的任务，属性如下：

|属性|值|说明|
|:---|:---|:---|
|Task enabled|启用||
|Task name|codelet-cloud-compact-store||
|Blob store|default|压缩对象 Blob Store|
|Task frequency|Advanced|使用 CRON 表达式设置任务的执行频率|
|CRON expression|30 */5 * * * ?|每五分钟执行一次|

![browse repositories](/img/framework/building-ci-server/05-06-compact-store.png)
