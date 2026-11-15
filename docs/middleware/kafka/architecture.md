# 架构与副本

## 基本组成

- **Producer / Consumer**：生产与消费客户端
- **Broker**：消息存储与转发节点
- **Controller**：负责分区 Leader 选举与集群元数据管理
- **Topic → Partition → Segment**：主题拆分为有序分区，分区再按段落盘

## 副本机制

| 角色 | 职责 |
| --- | --- |
| Leader | 处理读写请求 |
| Follower | 从 Leader 同步数据 |
| ISR | 与 Leader 保持同步的副本集合 |

- `HW`（High Watermark）：消费者可见的最大位移
- `LEO`（Log End Offset）：每个副本最后一条消息的位移
- 只有 ISR 中的副本才有资格被选为 Leader

## 读写流程

```text
Producer → 按 key/轮询选择分区 → 追加到 Leader 日志
Consumer → 按分区顺序拉取 → 维护自身 offset
```

## 待补充

- ISR 收缩与 `replica.lag.time.max.ms`
- Controller 故障转移
- 分区再均衡（Rebalance）策略
