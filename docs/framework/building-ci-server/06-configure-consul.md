---
id: configure-consul
title: 配置并启动 Consul
---

Consul 的服务被称为 Agent，Agent 分为两种角色：服务器及客户端。多个 Consul 服务器构成集群环境，Consul 客户端注册到 Consul 服务器，微服务注册到 Consul 客户端。

以下以一个服务器、一个客户端为例。

以 codelet 用户身份创建以下目录结构：

```text
📁 /var/codelet/consul
   📁 config
      📃 server.json    Consul 服务器启动配置
      📃 client.json    Consul 客户端启动配置
   📁 data
      📁 server         Consul 服务器数据保存路径
      📁 client         Consul 客户端数据保存路径
   📁 logs
      📁 server         Consul 服务器日志保存路径
      📁 client         Consul 客户端日志保存路径
```

Consul 服务所使用的端口：

|服务角色|用途|端口号|说明|备注|
|:---|:---|:---:|:---|:---|
|服务器|HTTP|8930|HTTP API||
|服务器|DNS|8931|解析 DNS 查询||
|服务器|LAN Serf|8932|处理局域网的 Gossip|Gossip：基于病毒传播方式的计算机点对点通信的处理（协议）|
|服务器|WAN Serf|8933|处理互联网的 Gossip||
|服务器|Server RPC|8934|处理其他 Agent 发送的请求||
|客户端|HTTP|8940|HTTP API||
|客户端|DNS|8941|解析 DNS 查询||
|客户端|LAN Serf|8942|处理局域网的 Gossip||
|客户端|WAN Serf|8943|处理互联网的 Gossip||

生成服务之间通信密钥：

```terminal
$ consul keygen
6UWWdBHIvk5xAt6l0jejBn3cTerut3u5Ik03710rbJM=
```

> 同一数据中心的所有服务器和客户端必须使用相同的密钥。

编辑 server.json 的内容：

```json
{
  "datacenter":     "codelet",
  "data_dir":       "./data/server",
  "pid_file":       "./logs/server/server.pid",
  "log_file":       "./logs/server/server.log",
  "log_level":      "trace",
  "encrypt":        "6UWWdBHIvk5xAt6l0jejBn3cTerut3u5Ik03710rbJM=",
  "client_addr":    "0.0.0.0",
  "retry_interval": "15s",
  "retry_join": [
  ],
  "rejoin_after_leave":      true,
  "leave_on_terminate":      false,
  "skip_leave_on_interrupt": true,
  "disable_update_check":    true,
  "ports": {
    "http":     8930,
    "dns":      8931,
    "serf_lan": 8932,
    "serf_wan": 8933,
    "server":   8934
  }
}
```

编辑 client.json 的内容：

```json
{
  "datacenter":     "codelet",
  "data_dir":       "./data/client",
  "pid_file":       "./logs/client/client.pid",
  "log_file":       "./logs/client/client.log",
  "log_level":      "trace",
  "encrypt":        "6UWWdBHIvk5xAt6l0jejBn3cTerut3u5Ik03710rbJM=",
  "client_addr":    "0.0.0.0",
  "retry_interval": "15s",
  "retry_join": [
    "ciserver:8932"
  ],
  "rejoin_after_leave":      true,
  "leave_on_terminate":      true,
  "skip_leave_on_interrupt": false,
  "disable_update_check":    true,
  "ports": {
    "http":     8940,
    "dns":      8941,
    "serf_lan": 8942,
    "serf_wan": 8943
  }
}
```

在 /var/codelet/consul 路径下执行以下命令启动服务器和客户端：

```terminal
$ consul agent -server -bootstrap-expect=1 -node=server247 -bind=192.168.1.247 \
         -config-file=./config/server.json -ui > ./server-logs/server.log &
$ consul agent -node=client247 -bind=192.168.1.247 \
         -config-file=./config/client.json -ui > ./client-logs/client.log &
```

此时可通过浏览器访问如下地址查看服务注册状态：

```text
http://192.168.1.247:8940
```

在各业务模块的 Starter 模块的 application.yml 中设置服务注册中心信息，以 user-query-starter 为例：

```text
spring:
    cloud:
        consul:
            host: ciserver
            port: 8940
            discovery:
                enabled: true
                tags: domain=user,type=query
```
