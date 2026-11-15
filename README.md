# OneView 技术笔记

整理中间件、Java 后端、AI 技术框架与工程实践的知识库。

- 线上地址：https://youepro.github.io/oneview/
- 仓库地址：https://github.com/youepro/oneview

## 技术栈

- 静态站点：MkDocs + Material for MkDocs
- 导航：mkdocs-awesome-pages-plugin（按目录自动生成）
- 部署：GitHub Actions 构建后推送 `gh-pages` 分支，由 GitHub Pages 托管

## 目录结构

```
docs/
├── index.md              首页
├── middleware/           中间件：Kafka、Redis、RocketMQ、RabbitMQ、Elasticsearch、Nginx、ZooKeeper
├── java/                 Java 后端：JVM、并发、集合、Spring、微服务、MySQL
├── ai/                   AI 技术：LLM、RAG、Agent、框架、深度学习
└── engineering/          工程实践：Git、Docker、Linux
```

每个目录的 `index.md` 为该分册入口；`.pages` 用于控制该目录的标题与排序（可选）。

## 本地开发

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

mkdocs serve            # 打开 http://127.0.0.1:8000 实时预览
mkdocs build --clean    # 仅构建到 site/
pkill -f "mkdocs serve"
```

## 发布流程

源文件始终在 **`doc` 分支**维护，`gh-pages` 是构建产物，请勿手动编辑。

```
doc 分支 docs/*.md ──push──> CI(pages.yml) ──mkdocs gh-deploy──> gh-pages 分支 ──> Pages 线上
```

### 自动发布（日常）

```bash
git add -A
git commit -m "docs: update ..."
git push origin doc
```

推送后 GitHub Actions 自动构建并更新 `gh-pages`，约 1 分钟生效。

### 手动发布

方式一：在 GitHub 手动触发 CI（无需本地环境）

1. 打开 https://github.com/youepro/oneview/actions/workflows/pages.yml
2. 点击 **Run workflow**，分支选择 `doc`，运行
3. 等待工作流变绿

方式二：本地一条命令直接发布

```bash
# 在 doc 分支、仓库根目录
pip install -r requirements.txt
mkdocs gh-deploy --force --remote-branch gh-pages
```

该命令会本地构建并强推 `gh-pages`，GitHub Pages 随后自动重建。

## 新增内容

- 现有目录下新增 `.md`：自动出现在导航中，无需改配置
- 新主题：新建目录 + `index.md`
- 需要自定义顺序或标题：编辑该目录的 `.pages`

## 常见问题

- 发布后页面未更新：GitHub Pages 有约 10 分钟 CDN 缓存（`max-age=600`），强刷或加 `?v=时间戳` 访问
- 不要直接修改 `gh-pages` 分支，每次部署会被覆盖
- 在线编辑：直接访问仓库 `doc` 分支的 `docs/` 目录修改 md 后提交

## 分支说明

| 分支 | 用途 |
| --- | --- |
| `doc` | 文档源文件，日常维护 |
| `gh-pages` | 构建产物，由 CI 自动更新 |
| `main` | 其他部署方式（Cloudflare）使用 |
