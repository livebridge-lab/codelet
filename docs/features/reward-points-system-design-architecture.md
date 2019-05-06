---
id: reward-points-system-design-architecture
title: 积分系统的架构
---

## 架构图

积分服务独立于其他业务服务单独存在，降低了代码之间的耦合性。可以独立部署，当积分相关流量激增时，方便扩容，提高了系统的健壮性。
![架构图](/img/reward-points-architecture.png)

## 积分规则引擎

在实际业务中，会经常根据实际运营情况调整积分奖励/惩罚的规则。如果把积分奖励/惩罚的规则写在业务代码中，就需要不断的修改原来的业务代码，
而这显然不是我们期望的。为了能够让业务代码与积分规则解耦，我们将积分规则用预定义的语义来编写，并通过积分引擎解析并做出业务决策。

### 规则引擎介绍

> [规则引擎](https://en.wikipedia.org/wiki/Business_rules_engine)由推理引擎发展而来，是一种嵌入在应用程序中的组件，实现了将业务决策从应用程序代码中分离出来，并使用预定义的语义模块编写业务决策。
接受数据输入，解释业务规则，并根据业务规则做出业务决策。

### 规则引擎的组成

![规则引擎组成](/img/reward-points-rule-engine.png)

- 事件：积分规则的使用场景（不同会员等级购买不同类型的商品奖励不同数量的积分）
- 规则：其中一组具体的条件（钻石会员购买电子类商品奖励商品总额的10%积分）
- 条件：单一条件（钻石会员、电子类商品）
- 元素：条件的组成单元（会员、商品）

### 开源规则引擎

#### Drools - 基于Java的开源规则引擎

Drools的最新稳定版本是7.20.0，最低支持JDK1.5，更多关于Drools的介绍，参考官网 [Drools - Business Rules Management System](http://drools.org/)

##### 定义DSL文件

创建面向具体业务的概念字典，并解析成DRL

```
[when] there is a person = $p:Person()
[then] print = System.out.println("hello world!");
``` 

......

#### Nools - 基于Javascript的开源规则引擎

......

