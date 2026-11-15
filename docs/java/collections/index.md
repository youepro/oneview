# 集合

## 常用实现

| 接口 | 实现 | 特点 |
| --- | --- | --- |
| List | ArrayList | 数组，随机访问快 |
| List | LinkedList | 链表，频繁头尾增删 |
| Map | HashMap | 数组 + 链表/红黑树 |
| Map | TreeMap | 有序，红黑树 |
| Map | ConcurrentHashMap | 线程安全 |
| Set | HashSet / TreeSet | 去重 / 排序 |

## HashMap 要点

- 默认容量 16，负载因子 0.75
- 链表长度超过 8 且容量 ≥ 64 转为红黑树
- 扩容为 2 倍，重新分布桶

## 选型建议

- 明确是否需要有序、线程安全、随机访问
- 预估容量，减少扩容带来的拷贝
- 自定义 key 正确实现 `hashCode` 与 `equals`
