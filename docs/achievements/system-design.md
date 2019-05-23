---
id: achievement-system-design
title: 系统设计
---

## 业务流程图

  成就系统最核心的业务即成就的维护和解锁。

#### 解锁流程

![解锁成就](/img/achievement-flow-chart.png)

## API 设计

### 系统维度API

#### 成就规则类型

- 添加规则类型：```[post] /achievements/categories```
- 更新规则类型：```[patch] /achievements/rules/categories```
- 获取规则类型：```[get] /achievements/rules/categories```
- 规则类型详情：```[get] /achievements/rules/categories/:categoryId```
- 删除规则类型：```[delete] /achievements/rules/categories/:categoryId```

#### 成就规则

- 添加规则：```[post] /achievements/rules```
- 更新规则：```[patch] /achievements/rules```
- 获取规则：```[get] /achievements/rules```
- 规则详情：```[get] /achievements/rules/:ruleId```
- 删除规则：```[delete] /achievements/rules/:ruleId```

#### 用户解锁

- 解锁成就：```[post] /achievements/unlock```


## 数据库设计

![数据库设计图](/img/achievements-dbs.png)
