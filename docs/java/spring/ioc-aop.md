# IoC 与 AOP

## IoC 容器

- `BeanFactory` 与 `ApplicationContext`
- Bean 生命周期：实例化 → 属性填充 → 初始化 → 使用 → 销毁
- 依赖注入方式：构造器、Setter、字段
- 作用域：singleton、prototype、request、session

## 循环依赖

- 单例字段注入通过三级缓存解决
- 构造器注入无法解决，应重构依赖

## AOP

- 切面（Aspect）= 切点（Pointcut）+ 通知（Advice）
- 通知类型：Before、After、AfterReturning、AfterThrowing、Around
- 基于代理：JDK 动态代理（接口）或 CGLIB（类）
- 典型应用：事务、日志、权限、缓存

## 注意

- 同类内部方法调用不会走代理，事务/切面失效
- 可通过注入自身或 `AopContext` 解决
