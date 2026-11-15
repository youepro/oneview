# 可靠性

消息不丢失需要生产、存储、消费三段共同保证。

## 生产端

- `acks=all`：所有 ISR 副本写入后才确认
- 开启幂等：`enable.idempotence=true`，避免重试重复
- 需要跨分区原子写时使用事务

## 存储端

- `replication.factor >= 3`
- `min.insync.replicas = 2`
- `unclean.leader.election.enable=false`，避免落后副本当选丢数据

## 消费端

- 处理成功后手动提交位移，避免"先提交后处理"
- 重复消费用业务幂等兜底
- 关注消费 lag，及时扩容

## 典型配置

```properties
acks=all
enable.idempotence=true
replication.factor=3
min.insync.replicas=2
```

## 待补充

- 事务消息与 Exactly-Once 语义
- 消息积压的定位与处理
