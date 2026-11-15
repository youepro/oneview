# Nginx

高性能的反向代理与 Web 服务器，常用于负载均衡、静态资源、反向代理和网关。

## 常见用途

- 反向代理后端服务
- 负载均衡（轮询、加权、ip_hash）
- 静态资源与缓存
- TLS 终止、gzip、限流

## 示例

```nginx
upstream backend {
    server 127.0.0.1:8080 weight=3;
    server 127.0.0.1:8081;
}

server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 待补充

- 负载均衡算法与健康检查
- 限流（limit_req / limit_conn）
- 常见 502/504 排查
