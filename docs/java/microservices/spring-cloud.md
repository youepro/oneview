# Spring Cloud

## 常用组件

| 能力 | 组件 |
| --- | --- |
| 注册中心 | Nacos / Eureka / Consul |
| 配置中心 | Nacos / Spring Cloud Config |
| 网关 | Spring Cloud Gateway |
| 负载均衡 | Spring Cloud LoadBalancer |
| 熔断限流 | Sentinel / Resilience4j |
| 链路追踪 | Micrometer Tracing / SkyWalking |

## 一次请求链路

```text
Client → Gateway → Service A → Service B
          │            │
          └── 注册中心 / 配置中心 / 链路追踪
```

## 待补充

- Gateway 路由与过滤器
- OpenFeign 调用与超时重试
- 分布式事务（Seata）
