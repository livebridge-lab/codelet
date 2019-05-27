---
id: analysis_design
title: 分析与设计
---

## 领域模型

![社区领域模型](/img/community-domain-model.png)

## 业务流程

社区核心业务：内容发布、内容搜索和内容查看。

#### 发布内容流程

![发布内容流程图](/img/communities-content-public-procedures.png)

## 关键交互

如有需要，此处可插入时序图。

## API 设计

### 社区规则类型

- 添加规则类型：```[post] /communities/rules/categories```
- 更新规则类型：```[patch] /communities/rules/categories```
- 获取规则类型：```[get] /communities/rules/categories```
- 规则类型详情：```[get] /communities/rules/categories/:categoryId```
- 删除规则类型：```[delete] /communities/rules/categories/:categoryId```

### 社区规则

- 添加规则：```[post] /communities/rules```
- 更新规则：```[patch] /communities/rules```
- 获取规则：```[get] /communities/rules```
- 规则详情：```[get] /communities/rules/:ruleId```
- 删除规则：```[delete] /communities/rules/:ruleId```

### 社区话题

- 添加版块：```[post] /communities/topics```
- 更新版块：```[patch] /communities/topics```
- 获取版块：```[get] /communities/topics```
- 版块详情：```[get] /communities/topics/:topicId```
- 删除版块：```[delete] /communities/topics/:topicId```

### 社区话题内容

- 添加内容：```[post] /communities/topics/:topicId/comments```
- 获取内容：```[get] /communities/topics/:topicId/comments```
- 内容详情：```[get] /communities/topics/:topicId/comments/:commentId```
- 删除内容：```[delete] /communities/topics/:topicId/comments/:commentId```

### 社区话题

- 关注话题：```[post] /communities/users/:userId/followed-topics/:topicId```
- 取消关注话题：```[delete] /communities/users/:userId/followed-topics/:topicId```
- 获取已关注的话题：```[get] /communities/users/:userId/followed-topics```

### 社区话题内容

- 获取发表的内容：```[get] /communities/users/:userId/comments```
- 阅读社区话题内容：```[post] /communities/users/:userId/read-comments/:commentId```
- 收藏社区话题内容：```[post] /communities/users/:userId/favorite-comments/:commentId```
- 取消收藏社区话题内容：```[delete] /communities/users/:userId/favorite-comments/:commentId```
- 对社区话题内容点赞：```[post] /communities/users/:userId/liked-comments/:commentId```
- 取消对社区话题内容点赞：```[delete] /communities/users/:userId/liked-comments/:commentId```

## 数据库设计

### 关系型数据库（MySQL）

![数据库设计图](/img/communities-dbs.png)

### 非关系型数据库（MongoDB）

![数据库设计图](/img/communities-dbs.png)