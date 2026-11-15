# MySQL

## 核心主题

- **索引**：B+ 树、聚簇/二级索引、最左前缀、覆盖索引
- **事务**：ACID、隔离级别、MVCC
- **锁**：行锁、间隙锁、临键锁、死锁排查
- **优化**：执行计划、慢查询、分库分表

## 执行计划

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 1 ORDER BY created_at DESC LIMIT 20;
```

关注 `type`、`key`、`rows`、`Extra`（避免 `Using filesort`、`Using temporary`）。

## 优化清单

- 为高频查询建立合适复合索引
- 避免 `SELECT *`、隐式类型转换、前导模糊匹配
- 大分页用游标（`WHERE id > ?`）替代 `OFFSET`
- 事务尽量短小，避免长事务持锁

## 待补充

- MVCC 与 ReadView
- 主从复制与读写分离
