# 快速上手

## 启动单节点

```yaml
# docker-compose.yml
services:
  kafka:
    image: bitnami/kafka:3.7
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_NODE_ID: 0
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: 0@kafka:9093
      KAFKA_CFG_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
```

```bash
docker compose up -d
```

## 常用命令

```bash
# 创建 topic
docker compose exec kafka kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --topic demo --partitions 3 --replication-factor 1

# 生产消息
echo "hello kafka" | docker compose exec -T kafka kafka-console-producer.sh \
  --bootstrap-server localhost:9092 --topic demo

# 消费消息
docker compose exec kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic demo --from-beginning
```

## 下一步

- 阅读 [Kafka 概览](index.md) 了解分区与副本
- 结合业务确定 `acks`、副本数与消费位移策略
