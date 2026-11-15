# LangChain

## 核心抽象

- **Models**：LLM、ChatModel、Embedding
- **Prompts**：模板与消息
- **Chains**：可组合的调用链
- **Retrievers**：文档检索
- **Tools / Agents**：工具与智能体

## 示例

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是简洁的技术助手"),
    ("human", "{question}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini")
print(chain.invoke({"question": "解释 Kafka ISR"}).content)
```

## 待补充

- LCEL 表达式语言
- 回调与可观测性
- 与向量库集成
