# Spring Boot

约定优于配置，快速构建可独立运行的应用。

## 核心机制

- **自动配置**：`@EnableAutoConfiguration` + `spring.factories` / `AutoConfiguration.imports`
- **起步依赖**：`spring-boot-starter-*` 聚合常用依赖
- **外部化配置**：`application.yml`、环境变量、命令行优先级
- **内嵌容器**：Tomcat / Jetty / Undertow

## 常用组件

| 能力 | 依赖 |
| --- | --- |
| Web | spring-boot-starter-web |
| 数据访问 | spring-boot-starter-data-jpa / mybatis |
| 监控 | spring-boot-starter-actuator |
| 校验 | spring-boot-starter-validation |

## 示例

```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/demo
    username: root
    password: secret
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

## 待补充

- 自动配置原理与自定义 starter
- 启动流程与条件装配
