# Git

## 常用命令

```bash
git status
git log --oneline --graph --decorate
git diff --staged
git switch -c feature/x
git rebase main
git cherry-pick <sha>
git reset --hard origin/main
```

## 分支模型

- `main`：稳定发布
- `feature/*`：功能开发
- `fix/*`：缺陷修复
- 合并前保持 rebase，提交历史线性

## 常见问题

| 问题 | 处理 |
| --- | --- |
| 提交到错分支 | `git cherry-pick` 到目标分支后 reset 原分支 |
| 误删分支 | `git reflog` 找到提交后重建 |
| 合并冲突 | 编辑冲突文件后 `git add` 继续 |
| 撤销未推送提交 | `git reset --soft HEAD~1` |

## 规范

- 提交信息简洁说明"做了什么"
- 一个提交只做一件事
