---
id: configure-gitolite
title: 创建代码库并配置访问控制权限
---

在服务器上克隆 gitolite-admin：

```shell
$ git clone codelet@127.0.0.1:gitolite-admin
```

得到以下目录结构：

```text
📁 gitolite-admin
   📁 conf
      📃 gitolite.conf    用户群组定义、代码库定义、代码库权限设置，初始时 codelet 拥有对 gitolite-admin 的全部操作权限
   📁 keydir              用户公钥保存路径
      📃 codelet.pub      初始时仅有 codelet 一名用户
```

将用户在各自开发环境生成的公钥文件置于 keydir 路径下，然后编辑 gitolite.conf 文件：

```conf
@administrator = codelet jinhy                # 增加管理员 jinhy
@codelet-auth  = @administrator wenyy         # 定义用户组 codelet-auth
@codelet-user  = @administrator anwy          # 定义用户组 codelet-user
@codelet       = @codelet-auth @codelet-user  # 定义用户组 codelet，包含所有 codelet 团队成员
@org1          = @administrator someone1      # 定义用户组 org1，包含所有外包团队成员

repo gitolite-admin
    RW+ = @administrator  # 管理员可以读写 gitolite-admin，以配置代码库访问控制权限

repo cloud/auth           # 定义代码库 cloud/auth
    RW+ = @codelet-auth   # codelet-auth 的成员可以读写 cloud/auth
    R   = @codelet        # codelet 成员可以读取 cloud/auth

repo cloud/user           # 定义代码库 cloud/user
    RW+ = @codelet-user   # codelet-user 的成员可以读写 cloud/user
    R   = @codelet        # codelet 成员可以读取 cloud/user

repo org1/biz1            # 定义代码库 org1/biz1
    RW+ = @org1           # org1 的成员可以读写 org1/biz1
    R   = @codelet        # codelet 成员可以读取 org1/biz1
```

> 用户名为生成 SSH 公钥时通过 `-C` 参数指定的名称。

> `@` 用于定义用户群组，`@all` 代表所有用户。

将所有变更推送到 Git 库，通过以上配置：

* 若所定义的代码库不存在则创建代码库
* 管理员对所有代码库有读写权限
* codelet 所有成员对所有代码库有读取权限
* codelet 各模块负责小组对各自模块的代码库有读写权限
* 外部团队仅对各自模块的代码库有读写权限
