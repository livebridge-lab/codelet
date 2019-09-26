---
id: configure-jenkins
title: 配置 Jenkins
---

使用浏览器访问以下链接，选择安装社区推荐的插件（下文将主要用到 Pipeline）：

```text
http://192.168.1.247:8920
```

可选：通过 Manage Jenkins > Manage Plugins 安装 locale 插件，安装后可设置界面语言。

通过 Manage Jenkins > Manage Users 创建 codelet 用户。

通过 Manage Jenkins > Configure Global Security 取消 CSRF Protection，从而使得本地脚本可以调用 Jenkins 接口以触发 Pipeline 任务流。

通过 New Item 创建类型为 Pipeline 的新任务，命名为 codelet-cloud-user，该任务将在用户账号业务模块代码提交后自动对其进行编译及发布：

|属性|值|说明|
|:---|:---|:---|
|Pipeline / Definition|Pipeline script from SCM|标明从 SCM 读取 Pipeline 脚本|
|Pipeline / Definition / SCM|Git|标明 SCM 类型为 Git|
|Pipeline / Definition / SCM / Repositories / Repository URL|codelet@127.0.0.1:cloud/user|用户账号模块的 Git 库地址|
|Pipeline / Definition / SCM / Repositories / Credentials|none|无密码|
|Pipeline / Definition / SCM / Repositories / Branches to build|*/master|编译的分支|
|Pipeline / Definition / Script path|Jenkinsfile|标明 Pipeline 脚本文件路径，为模块跟路径的 Jenkinsfile 文件|

![create pipeline](/img/framework/building-ci-server/07-01-create-pipeline.png)
![configure pipeline](/img/framework/building-ci-server/07-02-configure-pipeline.png)

按照同样的方式为所有模块创建 Pipeline 任务。

在服务器上为每一个模块添加 Git 的 Hook 脚本，用于在代码库被更新时触发 Jenkins 的 Pipeline 任务流。

以用户账号模块为例，创建文件 ~/repositories/cloud/user.git/hooks/post-receive，设置以下内容，并将其设置为可执行：

```bash
#!/usr/bin/env bash
curl -I -X POST http://codelet:Pas5w0rd@127.0.0.1:8920/job/codelet-cloud-user/build
```

在每一个模块的根路径下添加一个名为 Jenkinsfile 的文件，并设置以下内容：

```groovy
pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'mvn clean deploy'
            }
        }
    }
}
```

> TODO: 添加自动测试的命令

> TODO: 通过 post 指令实现发布后自动重启服务

> 应先在服务器上通过手动的方式对项目进行一次整体部署，以确保子模块所依赖的模块都已发布到制品库。
