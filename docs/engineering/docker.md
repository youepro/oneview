# Docker

## 常用命令

```bash
docker ps -a
docker images
docker run -d --name app -p 8080:8080 app:latest
docker exec -it app sh
docker logs -f --tail 200 app
docker compose up -d
docker system df
```

## Dockerfile 示例

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 最佳实践

- 多阶段构建减小镜像体积
- 合并 RUN 减少层数，清理缓存
- 不把密钥写入镜像，使用环境变量/Secret
- 使用 `.dockerignore` 排除无关文件

## 待补充

- 网络与数据卷
- Compose 编排
- 镜像清理与磁盘占用排查
