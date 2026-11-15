# RabbitMQ

基于 AMQP 协议的消息队列，路由模型灵活，适合业务解耦与任务分发。

## 核心概念

- **Exchange**：交换机，按路由规则分发消息
- **Queue**：队列，存储消息
- **Binding**：交换机与队列的绑定关系
- **Routing Key**：路由键

## 交换机类型

| 类型 | 路由规则 |
| --- | --- |
| direct | Routing Key 完全匹配 |
| fanout | 广播到所有绑定队列 |
| topic | 通配符匹配，如 `order.*` |
| headers | 按消息头匹配 |

## 可靠性

- 生产者确认 `publisher confirm`
- 队列与消息持久化
- 消费手动 ACK，配合死信队列处理失败消息

## 待补充

- 镜像队列 / Quorum Queue
- 消息积压与流控
