# Elasticsearch

基于 Lucene 的分布式搜索与分析引擎，常用于全文检索、日志分析和聚合统计。

## 核心概念

- **Index / Document / Field**：索引、文档与字段
- **Shard / Replica**：分片与副本，决定容量与可用性
- **Mapping**：字段类型与分词配置
- **Analyzer**：分词器，影响检索效果

## 写入与查询

- 写入近实时：默认 `refresh_interval=1s`
- 查询分 `query`（打分）与 `filter`（缓存、不打分）
- 聚合（Aggregation）用于统计与分组

## 待补充

- 倒排索引与分词原理
- 分片规划与扩容
- 慢查询与性能调优
