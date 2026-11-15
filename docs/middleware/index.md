# 中间件

后端系统中承担消息、缓存、检索、代理与协调等职责的基础组件。

## 分册

| 组件 | 定位 |
| --- | --- |
| [Kafka](kafka/index.md) | 高吞吐分布式消息队列与流处理平台 |
| [Redis](redis/index.md) | 内存缓存与丰富数据结构 |
| [RocketMQ](rocketmq/index.md) | 阿里开源的消息队列，事务/顺序消息完善 |
| [RabbitMQ](rabbitmq/index.md) | 基于 AMQP 的消息队列，路由灵活 |
| [Elasticsearch](elasticsearch/index.md) | 分布式搜索与分析引擎 |
| [Nginx](nginx/index.md) | 反向代理、负载均衡与静态资源服务 |
| [ZooKeeper](zookeeper/index.md) | 分布式协调与元数据管理 |

## 选型思路

- 消息：高吞吐选 Kafka，事务/顺序消息选 RocketMQ，复杂路由选 RabbitMQ
- 缓存：热点数据与计数选 Redis，本地多级缓存配合使用
- 检索：全文检索与日志分析选 Elasticsearch
