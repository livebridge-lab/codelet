---
id: install-components
title: 服务器环境搭建
---

## 前提

* 持续集成服务器在私有网络中的 IP 地址为 `192.168.1.247`
* 下文中的所有组件将部署于同一台服务器，实际应用中可将 Git 服务器、Jenkins 服务器、Nexus Repository Manager OSS 服务器、Consul 服务器分离并以集群方式部署
* 服务器操作系统：CentOS 7
* 下文的 Shell 脚本中 `#` 提示符代表以 `root` 用户身份操作，`$` 提示符代表以 `codelet` 用户身份操作

## 软件版本说明

项目工程运行软件：

|项目|版本|说明|
|:---|:---:|:---|
|Java SE Development Kit|1.8.221|Java 开发工具包|
|ImageMagick|7.0.8-66|图像处理|
|YASM|1.3.0|汇编编译器，FFmpeg 依赖|
|FFmpeg|4.2.1|音频/视频处理|

持续集成工具：

|项目|版本|说明|
|:---|:---:|:---|
|Git|2.9.5|软件配置管理（SCM: Software Configuration Management）|
|Maven|3.5.4|软件项目管理工具，制品库（Artifact Repository）|
|Gitolite|3.6.11|Git 代码库权限管理|
|Nexus Repository Manager OSS|3.18.1|制品库管理|
|Consul|1.6.1|服务自动发现与服务治理|
|Jenkins|2.176.3|持续集成|

可选软件：

|项目|版本|说明|
|:---|:---:|:---|
|NVM|0.33.11|Node.js 版本管理工具|
|Node.js|12.10.0|Node.js 运行时环境，用于执行自动化脚本|

## 准备工作

更新包系统软件包：

```terminal
# yum update -y
```

安装用于编译源代码的开发工具包：

```terminal
# yum groupinstall -y 'Development Tools'
```

编辑 `/etc/hosts`，为当前服务器添加主机名“ciserver”：

```text
127.0.0.1  localhost ciserver
::1        localhost ciserver
```

新建用户 codelet：

```terminal
# adduser -p Pas5w0rd -U codelet
```

生成 SSH 密钥，设置文件名为“codelet”，不设置密码：

```terminal
# su codelet
$ ssh-keygen -t rsa -C "codelet"
Enter file in which to save the key (/home/codelet/.ssh/id_rsa): /home/codelet/.ssh/codelet
Enter passphrase (empty for no passphrase): 
Enter same passphrase again:
```

## 安装 Java SE Development Kit

首先，从[下载页面](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载 Java SE Development Kit 的 Linux x64 版本的 tar 文件。

将下载的压缩包解压并移动到 `/opt/` 下：

```terminal
# tar -xf jdk-8u221-linux-x64.tar.gz
# mv ./jdk1.8.0_211 /opt/jdk1.8.0_221
# alternatives --install /usr/bin/java java /opt/jdk1.8.0_221/bin/java 2
```

若已安装其他版本 Java（或系统已自带 Open JDK 等 Java）执行以下命令并选择刚刚安装的版本：

```terminal
# alternatives --config java
```

安装 JDK 工具：

```terminal
# alternatives --install /usr/bin/jar jar /opt/jdk1.8.0_221/bin/jar 2
# alternatives --install /usr/bin/javac javac /opt/jdk1.8.0_211/bin/javac 2
# alternatives --set jar /opt/jdk1.8.0_221/bin/jar
# alternatives --set javac /opt/jdk1.8.0_221/bin/javac
```

将以下内容添加到文件 `~/.bashrc` 中：

```text
export JAVA_HOME=/opt/jdk1.8.0_221
export JRE_HOME=/opt/jdk1.8.0_221/jre
export PATH=$PATH:/opt/jdk1.8.0_221/bin:/opt/jdk1.8.0_221/jre/bin
```

## 安装 ImageMagick

下载并安装 ImageMagick：

```terminal
# wget https://imagemagick.org/download/linux/CentOS/x86_64/ImageMagick-7.0.8-66.x86_64.rpm
# wget https://imagemagick.org/download/linux/CentOS/x86_64/ImageMagick-libs-7.0.8-66.x86_64.rpm
# yum install -y ImageMagick-7.0.8-66.x86_64.rpm ImageMagick-libs-7.0.8-66.x86_64.rpm
```

> 官方下载页面地址：[https://imagemagick.org/script/download.php](https://imagemagick.org/script/download.php)

## 安装 FFmpeg

下载并安装汇编编译器 YASM：

```terminal
# wget http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
# tar -xf yasm-1.3.0.tar.gz 
# cd yasm-1.3.0
# ./configure
# make && make install
```

> 官方下载页面地址：[http://yasm.tortall.net/Download.html](http://yasm.tortall.net/Download.html)

下载并安装 FFmpeg：

```terminal
# wget https://ffmpeg.org/releases/ffmpeg-4.2.1.tar.bz2
# tar -xf ffmpeg-4.2.1.tar.bz2
# cd ffmpeg-4.2.1
# ./configure
# make && make install
```

> 官方下载页面地址：[http://ffmpeg.org/download.html](http://ffmpeg.org/download.html)

## 安装 Git

Git 的编译依赖 perl 的 ExtUtils，若尚未安装则需要先执行以下命令：

```terminal
# yum install perl-ExtUtils-CBuilder perl-ExtUtils-MakeMaker
```

下载 Git 源代码并编译安装：

```terminal
# wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.9.5.tar.gz
# tar -xf git-2.9.5
# cd git-2.9.5
# ./configure
# make && make install
```

> 官方下载页面地址：[https://git-scm.com/download/linux](https://git-scm.com/download/linux)

## 安装 Apache Maven

```terminal
# yum install -y maven
```
## 安装 Gitolite

克隆 Gitolite 代码库并将 Gitolite 安装到 ~/.gitolite 下：

```terminal
$ git clone git://github.com/sitaramc/gitolite
$ mkdir -p ~/.gitolite/{bin,logs}
$ gitolite/install -to ~/.gitolite/bin
```

> 项目的 GitHub 主页：[https://github.com/sitaramc/gitolite](https://github.com/sitaramc/gitolite)

初始化 Gitolite：

```terminal
$ ~/.gitolite/bin/gitolite setup -pk ~/.ssh/codelet.pub
```

完成初始化后，Gitolite 会生成 /home/codelet/repositories 路径，初始包含两个库，testing 和 gitolite-admin。

其中，testing 为测试库，可删除；gitolite-admin 用于管理其他库的访问控制权限。

> Gitolite 通过将用户的公钥信息添加到 ~/.ssh/authorized_keys 中从而实现用户可以免密码访问代码库。为阻止这些用户通过 SSH 免密码登录到服务器，Gitolite 将禁用 codelet 用户的 SSH 远程登录。因此，若需要以 codelet 身份执行一些操作，则需要通过其他用户（如 root）登录到系统再切换到 codelet 用户。在实际的部署中也可以通过专门的用户（如 git）管理代码库。

## 安装 Nexus Repository Manager OSS

从[下载页面](https://www.sonatype.com/download-nexus-repo-oss)下载 `NEXUS REPOSITORY MANAGER OSS 3.X - UNIX`，并将其解压。

得到以下目录结构：

```text
📁 nexus-3.18.1-01
   📁 etc
      📃 nexus-default.properties    应用配置文件
      ...
   📁 bin
      📃 nexus                       Nexu 启动脚本
      📃 nexus.vmoptions             Java 虚拟机配置文件
      ...
```

通过 nexus-default.properties 的 application-port 设置 Nexus 服务端口号：

```text
application-port=8910
```

通过 nexus.vmoptions 设置 Java 虚拟机启动参数：

```text
-Xms1536m
-Xmx1536m
-XX:MaxDirectMemorySize=1536m
```

启动 Nexus Repository Manager OSS：

```terminal
$ nexus-3.18.1-01/bin/nexus start
```

> 通过以下命令停止 Nexus Repository Manager OSS：
> ```terminal
> $ nexus-3.18.1-01/bin/nexus stop
> ```

## 安装 Consul

下载 Linux / 64bit 版本的可执行文件的压缩包，解压并将可执行文件移动到 /usr/local/bin/ 下：

```terminal
# wget https://releases.hashicorp.com/consul/1.6.1/consul_1.6.1_linux_amd64.zip
# unzip consul_1.6.1_linux_amd64.zip
# mv consul /usr/local/bin/
```

> 官方下载页面：[https://www.consul.io/downloads.html](https://www.consul.io/downloads.html)

## 安装 Jenkins

从[下载页面](https://jenkins.io/download/)下载 LTS 版本的 WAR 文件（Generic Java package (.war)）。

启动 Jenkins 服务：

```terminal
$ java -Dfile.encoding=UTF-8 \
       -XX:PermSize=256m -XX:MaxPermSize=512m -Xms256m -Xmx512m \
       -Djava.io.tmpdir=/var/codelet/jenkins/temp \
       -jar ./jenkins.war --httpPort=8920 > /var/codelet/jenkins/jenkins.log &
```

## 可选：安装 Node.js

首先安装 Node.js 版本管理工具：

```terminal
$ git clone https://github.com/nvm-sh/nvm.git ~/.nvm
$ cd ~/.nvm
$ git checkout v0.34.0
$ . nvm.sh
```

将以下内容加入到 ~/.bashrc 中：

```terminal
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

安装 Node.js：

```terminal
$ nvm install v12.10.0
```
