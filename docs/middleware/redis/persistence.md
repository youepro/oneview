# 持久化

## RDB

- 某一时刻的全量快照，文件紧凑、恢复快
- `save` 配置触发或 `BGSAVE` 手动触发
- 缺点：两次快照之间的数据可能丢失

## AOF

- 追加写命令日志，`appendfsync` 可选 `always` / `everysec` / `no`
- `everysec` 兼顾性能与安全，最多丢约 1 秒
- 文件较大时通过 `BGREWRITEAOF` 重写压缩

## 混合持久化

Redis 4.0+ 支持 `aof-use-rdb-preamble yes`：AOF 重写时先写 RDB 全量，再追加增量命令，兼顾恢复速度与数据安全。

## 选择建议

| 场景 | 建议 |
| --- | --- |
| 纯缓存，可重建 | 可关闭持久化 |
| 需要较高数据安全 | AOF `everysec` + 混合持久化 |
| 追求快速恢复 | RDB + 定期备份 |
