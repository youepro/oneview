# LangGraph

基于图的状态化编排框架，适合需要循环、分支和持久状态的 Agent。

## 核心概念

- **State**：共享状态，随节点流转
- **Node**：处理函数
- **Edge**：固定跳转
- **Conditional Edge**：按条件分支
- **Checkpointer**：持久化状态，支持中断/恢复

## 示例结构

```python
from langgraph.graph import StateGraph, END

graph = StateGraph(dict)
graph.add_node("plan", plan)
graph.add_node("act", act)
graph.add_edge("plan", "act")
graph.add_conditional_edges("act", should_continue, {"continue": "plan", "end": END})
app = graph.compile()
```

## 待补充

- Human-in-the-loop 中断
- 多智能体协作
- 状态持久化与恢复
