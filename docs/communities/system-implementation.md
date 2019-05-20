---
id: communities-system-implementation
title: 系统实现
---

> 文中提取关键词采用 [NodeJieba](https://github.com/yanyiwu/nodejieba) 组件。

## 社区话题/频道

#### 创建社区话题/频道

```nodejs
/**
 * 添加社区话题/频道。
 * @param {object}    topic             话题/频道信息
 * @param {string}    topic.title       话题/频道标题
 * @param {[object]}  topic.banners     话题/频道横幅图片
 * @param {string}    topic.description 话题/频道描述
 * @param {[string]}  topic.keywords    关键字
 * @param {number}    topic.weight      权重
 * @returns {*}
 */
async createTopic(topic) {

  // 获取话题/频道是否已存在
  let existed = await CommunityTopicModel.count({ title: topic.title, status: { $ne: 'deleted' } }) > 0;

  if (existed) {
    throw new Errors.BusinessError('error.topic_already_existed', '话题已存在');
  }

  // 提取关键词
  if (!topic.keywords || topic.keywords.length === 0) {
    topic.keywords = (nodejieba.extract(topic.description, 5) || []).map(keyword => {
      return keyword['word'];
    });
  }

  // 保存话题/频道信息并返回
  return (await (new CommunityTopicModel(topic)).save()).toObject();
}
```

#### 用户关注话题/频道

```nodejs
/**
 * 用户关注话题。
 * @param {object} operator   操作者信息
 * @param {string} topicId    话题/频道 ID
 * @returns {*}
 */
async followTopic(operator, topicId) {

  // 查询话题/频道信息
  let topic = await CommunityTopicModel.findOne({ id: topicId, status: 'normal' }).lean();

  if (!topic) {
    throw new Errors.NotFoundError('error.topic_not_found', '话题不存在');
  }

  // 用户是否已关注话题
  let followed = await CommunityRateModel.count({
    type: 'follow',
    targetType: 'topic',
    'target.id': topicId,
    'creator.id': operator.id
  }) > 0;

  if (followed) {
    throw new Errors.NotFoundError('error.user_already_followed_the_topic', '用户已关注此话题');
  }

  // 保存用户关注话题/频道信息
  return (await (new CommunityRateModel({
    type: 'follow',
    targetType: 'topic',
    target: { id: topic.id, title: topic.title, abstract: topic.description },
    creator: operator,
    createAt: new Date()
  })).save()).toObject();
}
```

## 社区评论/帖子

#### 创建社区评论/帖子

```nodejs
/**
 * 创建评论。
 * @param {object}   operator                   操作者信息
 * @param {string}   topicId                    话题/频道 ID
 * @param {object}   comment                    评论信息
 * @param {object}   comment.topic              评论所属话题/频道信息
 * @param {string}   comment.contentType        评论内容类型
 * @param {string}   comment.content            评论内容
 * @param {array}    comment.images             评论图片
 * @param {string}   comment.referenceId        回复对象评论 ID
 * @param {[string]} comment.keywords           评论内容关键词
 * @param {boolean}  comment.anonymous          是否匿名发表评论
 * @param {object}   comment.contextComment     评论主体
 * @param {object}   comment.referenceComment   评论回复对象
 * @param {[string]} comment.parentCommentIDs   评论上级 ID
 * @param {object}   comment.creator            评论者信息
 * @param {date}     comment.createAt           评论时间
 * @returns {Promise.<*>}
 */
async createComment(operator, topicId, comment) {

  // 查询话题/频道信息
  comment.topic = await CommunityTopicModel
    .findOne({ id: topicId, status: 'normal' })
    .select('-_id id title description')
    .lean();

  if (!comment.topic) {
    throw (new Errors.NotFoundError('error.comment_topic_not_found', '话题不存在'));
  }

  // TODO 用户是否满足在此话题、频道发布评论要求

  // 回复其他评论时将该评论作为回复对象
  if (comment.referenceId) {

    // 查询回复对象评论信息
    let referenceComment = await CommunityCommentModel
      .findOne({ id: comment.referenceId, 'topic.id': topicId })
      .select('-_id id abstract contentType content createAt creator')
      .lean();

    if (!referenceComment) {
      throw (new Errors.NotFoundError('error.comment_reference_not_found', '回复对象评论不存在'));
    }

    // 评论主体信息
    comment.contextComment = referenceComment.contextComment || referenceComment;
    // 评论回复对象信息
    comment.referenceComment = referenceComment;
    // 评论上级 ID
    comment.parentCommentIDs = (referenceComment.parentCommentIDs || []).concat(referenceComment.id);
  }

  // 提取评论关键词
  if (!comment.keywords || comment.keywords.length === 0) {
    comment.keywords = (nodejieba.extract(comment.content, 10) || []).map(keyword => {
      return keyword['word'];
    });
  }

  // 设置评论者信息
  comment.creator = operator;
  comment.creator.anonymous = comment.anonymous;

  // 保存评论信息
  let commentDoc = (await (new CommunityCommentModel(comment)).save()).toObject();

  // 更新上级评论数
  if (Array.isArray(comment.parentCommentIDs)
    && comment.parentCommentIDs.length > 0) {

    CommunityCommentModel.update(
      { id: { $in: comment.parentCommentIDs } },
      { $inc: { 'rates.replied': 1 } },
      { multi: true }
    ).catch(e => {
      console.error(e);
    });

  }

  // 返回评论信息
  return commentDoc;
}
```

#### 关注/收藏/点赞社区评论/帖子

```nodejs
/**
 * 用户关注/收藏/点赞评论。
 * @param {object} operator   操作者信息
 * @param {string} type       操作类型（`follow`：关注；`favorite`：收藏；`like`：点赞）
 * @param {string} commentId  评论/帖子 ID
 * @returns {Promise.<*>}
 */
async rateComment(operator, type, commentId) {

  // 查询评论/帖子信息
  let comment = await CommunityCommentModel.findOne({ id: commentId, status: 'normal' }).lean();

  if (!comment) {
    throw new Errors.NotFoundError('error.comment_not_found', '评论不存在');
  }

  // 用户是否已评价此评论/帖子
  let rated = await CommunityRateModel.count({
    type: type,
    targetType: 'comment',
    'target.id': commentId,
    'creator.id': operator.id
  }) > 0;

  if (rated) {
    let TYPE_TEXT = { follow: '关注', favorite: '收藏', like: '点赞' };
    throw new Errors.NotFoundError(`error.user_already_${type}_the_comment`, `用户已${TYPE_TEXT[type]}此评论`);
  }

  // 关注评论/帖子
  return (await (new CommunityRateModel({
    type: type,
    targetType: 'comment',
    target: { id: comment.id, title: comment.title, abstract: comment.abstract },
    creator: operator,
    createAt: new Date()
  })).save()).toObject();
}
```