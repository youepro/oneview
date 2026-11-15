# 框架

AI 应用编排框架，简化模型调用、工具、检索与状态管理。

## 分册

- [LangChain](langchain.md)：链式编排、模型与工具抽象
- [LangGraph](langgraph.md)：有状态图编排，适合复杂 Agent

## 选择建议

- 简单链路与 RAG：LangChain
- 需要循环、分支、持久状态：LangGraph
- 关注生产可观测性与部署：结合平台化方案
