---
id: communities-system-design
title: 分析与设计
---
## 需求分析

#### 搜索与视图
- `关键字搜索` 用户可以快速查找相关内容。
- `关注推送` 快速聚焦用户感兴趣或擅长的内容。
- `待回答问题` 回答者可以快速查看还未被评论的问题，并针对自己擅长和感兴趣的问题作出相关评论。
- `热门问题` 用户可以快速了解到当下其他用户所关注的问题。
- `相似问题` 用户可以在问题内更快捷的查看相关信息。
- `问题浏览量` 用户可以直观的了解到相关问题的热度。
- `问题解答量` 用户可以获知问题的用户参与度。
- `问题评价量` 用户可以快速分辨出问题及问题评论的价值。
- `用户排行榜` 用户可以满足自己的荣誉感和虚荣心。

#### 提出问题
- `问题模板` 提问者可以快速、规范的提出问题。
- `Markdown 编辑器` 提问者无需语法知识就可书写问题内容。
- `问题标签` 提问者可以让自己的问题更好的被回答者找到。

#### 展示与回复
- `问题回复` 用户可以就问题展开讨论。
- `回复通知` 问题相关者（提问者、评论者、关注者）可以及时了解问题的进展。
- `问题邀答` 用户可以快速的寻求到帮助。
- `问题评价` 用户可以根据评价情况判断问题的价值
- `回复评价` 用户可以根据评价情况判断回答/评论的价值。
- `问题关注` 问题关注者可以实时跟进问题的动态。
- `问题收藏` 用户可以收藏自己感兴趣的问题，方便今后查询。

#### 社区管理
- `用户等级` 用户可以根据不同的等级获得不同的权限，甚至成为管理者。
- `问题举报` 用户可以协助管理者共通营造社区氛围，极大的增加用户的参与感。

#### 运营统计
- `用户增长` 运营人员可以通过用户的增长趋势，及时调整运营策略。
- `用户活跃` 运营人员可以通过观察用户的行为习惯，及时调整运营重心。
- `用户留存` 运营人员可以通过用户的流失情况，及时调整运营方向。
- `问题增长` 运营人员可以通过问题的增长趋势，及时了解社区的整体活跃度。
- `问题有效` 运营人员可以通过问题的有效率，了解用户层级分布（高质量用户、一般用户、低质量用户）
- `问题关注` 运营人员可以通过问题的被关注情况，了解当前社区内用户关心的重点。
- `问题回复` 运营人员可以通过问题的被回复情况...

## 数据字典与业务规则
| 名词 | 英文 | 释义/规则 | 
| ------ | ------ | ------ |
| 关注推送 | Follow Question | 根据登录用户关注的标签，有针对性的推送相关的问题。 |
| 热门问题 | Hot Question | 一段时间内，浏览次数较多的问题，代表着多数用户所关心的问题。 |
| 相似问题 | Similar Question | 根据一定的规则，筛选出与当前问题相似或有共通点的问题。 |
| 提问者 | Questioner | 用户可以就自己疑惑的内容提出问题，以便寻求他人的帮助。 |
| 评论者 | Replier | 用户针对他人提出的问题或问题的评论发表自己的想法和言论。 |
| 关注者 | Follower | 用户针对某个特定问题想及时的跟进问题的动态。 |
| 问题邀答 | Question Invite | 用户可以就某个还未被解答但自己想尽快知道答案的问题邀请其他用户进行作答。 |
| 问题评价 | Question Rate | 包含`赞`（`like`）和`踩`（`dislike`）。用户发表自己对问题价值的看法，供其他用户参考。 |
| 回复评价 | Reply Rate | 用户发表自己对问题回复价值的看法，供其他用户参考。 |

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