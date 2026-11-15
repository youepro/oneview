# 数据类型

## 常用类型与场景

| 类型 | 典型命令 | 适用场景 |
| --- | --- | --- |
| String | `SET` `GET` `INCR` | 缓存对象、计数器、分布式锁 |
| Hash | `HSET` `HGETALL` | 存储对象的多个字段，按字段更新 |
| List | `LPUSH` `RPOP` `LRANGE` | 队列、时间线、最近列表 |
| Set | `SADD` `SMEMBERS` `SINTER` | 去重、共同好友、标签 |
| ZSet | `ZADD` `ZRANGE` `ZINCRBY` | 排行榜、延迟队列、带权重的集合 |

## 示例

```bash
# 计数器
SET page:view 0
INCR page:view

# 对象字段
HSET user:1 name "kafka" age 3
HGETALL user:1

# 排行榜
ZADD rank 100 alice
ZADD rank 90 bob
ZRANGE rank 0 -1 WITHSCORES
```

## 选型建议

- 能用一种结构满足需求时优先选用，避免多层嵌套
- 大 Key 拆分，单 Key 元素过多会阻塞主线程
- 批量操作使用 `MGET`、`HSET` 多字段或 Pipeline 降低 RTT
