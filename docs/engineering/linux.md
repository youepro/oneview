# Linux

## 常用命令

```bash
top -Hp <pid>          # 查看线程 CPU
ps -ef | grep java
ss -lntp               # 端口监听
df -h && du -sh *
free -h
tail -f app.log
grep -rn "error" logs/
```

## 排查思路

1. `top` 找高 CPU/内存进程
2. `top -Hp` 定位线程，`jstack` 看堆栈
3. `iostat`/`vmstat` 判断 IO 与上下文切换
4. 磁盘满先查大文件与日志轮转

## 常用工具

- `htop`、`lsof`、`strace`、`tcpdump`
- `journalctl` 查看系统日志
- `crontab -e` 定时任务

## 待补充

- 性能排查实战
- Shell 脚本与自动化
