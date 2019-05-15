---
id: reward-points-system-design
title: 系统设计
---

## 业务流程图

因为积分的获取和消耗通常是掺杂在其他业务中，所以举几个典型的例子来表达积分获取和消耗的业务流程。

### 签到送积分
![签到送积分](/img/reward-points-sign-in.png)

### 购物送积分
![购物送积分](/img/reward-points-shopping.png)

### 邀请好友送积分
![参与活动送积分](/img/reward-points-activities.png)

## 实体建模

## API设计

### 系统维度API

系统维度的接口集合，主要供运营端使用。

#### 积分规则

- 创建积分规则：```[post] /rules?category=reward-points```
- 获取积分规则列表：```[get] /rules?category=reward-points&skip=:skip&limit=:limit```
- 获取积分规则详情：```[get] /rules/:ruleID```
- 更新积分规则：```[patch] /rules/:ruleID```
- 删除积分规则：```[delete] /rules/:ruleID```

#### 积分统计

- 按日期统计积分发放/消耗数量：```[get] /statistics/reward-points?year=:year&month=:month&day=:day&io=:io&skip=:skip&limit=:limit```

#### 用户积分管理

- 查看所有用户积分：```[get] /accounts?category=reward-points```
- 查看用户积分详情：```[get] /uers/:userID/accounts/:accountID```
- 更新用户积分：```[patch] /users/:userID/accounts/:accountID```

### 用户维度API

用户维度的接口集合，用户获取与消耗积分相关的接口。

#### 积分获取

- 积分获取：```[post] /reward-points?category=:category&activityID=:activityID```

#### 积分查看

- 查看积分余额：```[get] /users/:userID/accounts?category=reward-points```
- 查看积分明细：```[get] /users/:userID/accounts/accountID/transactions?io=:io&skip=skip&limit=:limit```
- 查看已过期积分：```[get] /users/:userID/expired-reward-points?skip=:skip&limit=:limit```

#### 积分消耗

- 积分消耗：

## 数据库设计

![数据库设计](/img/reward-points-DB.png)