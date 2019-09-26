---
id: mac-os-x
title: Mac OS X 开发环境搭建
---

## 软件版本说明

项目工程开发及运行所需软件：

|项目|版本|说明|
|:---|:---:|:---|
|Java SE Development Kit|1.8.221|Java 开发工具包|
|ImageMagick|7.0.8-56|可选，图像处理|
|FFmpeg|4.1.4|可选，音频/视频处理|
|Git|2.22.0|软件配置管理（SCM: Software Configuration Management）|
|Maven|3.5.4|软件项目管理工具，制品库（Artifact Repository）|

可选软件：

|项目|版本|说明|
|:---|:---:|:---|
|NVM|0.33.11|Node.js 版本管理工具|
|Node.js|12.10.0|Node.js 运行时环境，用于执行自动化脚本|

集成开发环境：

|项目|版本|说明|
|:---|:---:|:---|
|IntelliJ IDEA Community|2019.2|[https://www.jetbrains.com/idea/download/#section=mac](https://www.jetbrains.com/idea/download/#section=mac)|
|SmartGit|19.1|[https://www.syntevo.com/smartgit/download/](https://www.syntevo.com/smartgit/download/)|

## 安装 Java SE Development Kit (JDK)

从[下载页面](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载适用于 Mac OS X x64 的 DMG 文件（jdk-8u221-macosx-x64.dmg），装载 DMG 镜像，执行安装程序。

若已安装过其他版本的 JDK，可通过以下命令查看已安装 JDK 的列表：

```shell
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (5):
    11.0.1, x86_64:       "Java SE 11.0.1"  /Library/Java/JavaVirtualMachines/jdk-11.0.1.jdk/Contents/Home
    1.8.0_221, x86_64:    "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_221.jdk/Contents/Home
    1.8.0_211, x86_64:    "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home
    1.8.0_191, x86_64:    "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_191.jdk/Contents/Home
    1.8.0_181, x86_64:    "Java SE 8"       /Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home

/Library/Java/JavaVirtualMachines/jdk-11.0.1.jdk/Contents/Home
```

通过更新 ~/.bash_profile 的 JAVA_HOME 全局变量更新默认 Java 版本：

```bash
export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_221`
```

## 安装 ImageMagick

仅在所开发的模块需要进行图像处理时必要。

通过 HomeBrew 安装 ImageMagick：

```shell
$ brew install imagemagick
```

## 安装 FFmpeg

仅在所开发的模块需要进行音频或视频处理时必要。

通过 HomeBrew 安装 FFmpeg：

```shell
$ brew install ffmpeg
```

## 安装 Git

通过 HomeBrew 安装 Git：

```shell
$ brew install git
```

> Mac OS X 出厂自带 Git，该操作将对 Git 版本升级。

## 安装 Maven

通过 HomeBrew 安装 Maven：

```shell
$ brew install maven@3.5
```

使用主机名访问服务器前开发环境需要先设置 /etc/hosts 文件：

```text
192.168.1.247  ciserver
```

在 ~/.m2/ 下创建文件 settings.xml 并设置以下内容以从 Nexus Repository Manager OSS 的 codelet-cloud-public 获取依赖包：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <pluginGroups/>

    <proxies/>

    <servers>
        <server>
            <id>nexus</id>
        </server>
    </servers>

    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>central</mirrorOf>
            <url>http://stagingserver:8910/repository/codelet-cloud-public/</url>
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

## 可选：安装 Node.js

首先安装 Node.js 版本管理工具：

```shell
$ git clone https://github.com/nvm-sh/nvm.git ~/.nvm
$ cd ~/.nvm
$ git checkout v0.34.0
$ . nvm.sh
```

将以下内容加入到 ~/.bash_profile 中

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

安装 Node.js：

```shell
$ nvm install v12.10.0
```

## 生成 SSH 密钥及公钥

为从代码库拉取代码，需要在本地生成 SSH 密钥及公钥，并将公钥文件提交给持续集成管理员。

公钥文件被部署到 Gitolite 中后，开发者方可通过公钥文件访问授权的代码库。

通过以下命令生成 SSH 密钥和公钥（将 yourname 替换为实际用户名）：

```shell
$ ssh-keygen -t rsa -C "yourname"
Enter file in which to save the key (/Users/Yourname/.ssh/id_rsa): /Users/Yourname/.ssh/yourname
Enter passphrase (empty for no passphrase): 
Enter same passphrase again:
```

生成的公钥文件为 ~/.ssh/yourname.pub。
