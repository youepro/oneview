# JUC

`java.util.concurrent` 提供并发编程的核心工具。

## 锁与同步

- `ReentrantLock`：可中断、可超时、公平/非公平
- `ReadWriteLock` / `StampedLock`：读写分离
- `CountDownLatch` / `CyclicBarrier` / `Semaphore`

## 线程池

```java
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8, 16, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(1000),
    new ThreadPoolExecutor.CallerRunsPolicy());
```

- 参数：核心/最大线程数、队列、存活时间、拒绝策略
- 拒绝策略：Abort、CallerRuns、Discard、DiscardOldest

## 并发容器

- `ConcurrentHashMap`：分段/CAS，读多写少
- `CopyOnWriteArrayList`：读多写极少
- `BlockingQueue`：生产消费解耦

## 待补充

- AQS 原理
- 线程池监控与动态调整
