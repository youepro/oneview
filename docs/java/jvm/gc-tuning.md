# GC 调优

## 常见回收器

| 回收器 | 特点 | 适用 |
| --- | --- | --- |
| Serial | 单线程，简单 | 小内存客户端 |
| Parallel | 多线程吞吐优先 | 批处理 |
| CMS | 低停顿（已废弃） | 旧版本 |
| G1 | 可预测停顿，分区域 | 主流服务端 |
| ZGC | 超低停顿 | 大堆低延迟 |

## 关键参数

```bash
-Xms4g -Xmx4g            # 堆固定，避免震荡
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/data/dump
```

## 排查思路

1. `jstat -gc` 观察回收频率与耗时
2. `jmap` / `jcmd` 导出堆转储
3. MAT 分析大对象与引用链
4. `GCViewer` 或 GC 日志分析停顿

## 待补充

- G1 记忆集与混合回收
- ZGC 染色指针原理
