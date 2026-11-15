# PyTorch

## 基本流程

```python
import torch
from torch import nn

model = nn.Linear(10, 2)
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for x, y in dataloader:
    pred = model(x)
    loss = loss_fn(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

## 常用概念

- `Dataset` / `DataLoader`：数据加载与批处理
- `device`：CPU / GPU 迁移
- `state_dict`：权重保存与加载
- 混合精度：`torch.cuda.amp`

## 待补充

- 显存与性能优化
- 预训练模型微调
- 分布式训练（DDP）
