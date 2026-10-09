# GitHub Workflows

[English](./README.md) | 简体中文

面向使用 pnpm 的 JavaScript 和 TypeScript 项目的 GitHub Actions 工作流与仓库模板集合。`.github` 目录涵盖 PR 检查、代码风格自动修复、预览包发布、正式发布、贡献者欢迎、Issue 表单、依赖更新和赞助链接。

这些文件供复制到目标仓库后按需调整。工作流通过仓库事件触发，没有提供 `workflow_call` 入口。本仓库不包含应用代码、`package.json` 或 pnpm 锁文件，因此无法单独运行与项目包有关的任务。

## 工作流说明

下表中的路径均相对于 `.github/`。

| 文件 | 触发条件 | 含义与实际行为 | 适用场景 |
| --- | --- | --- | --- |
| [workflows/ci.yaml](./.github/workflows/ci.yaml) | Pull request | 配置 pnpm 和 Node.js LTS，通过 `pnpm i` 安装依赖，执行 `pnpm run lint`。 | 合并 PR 前检查代码风格。当前工作流没有运行测试或构建。 |
| [workflows/autofix.yml](./.github/workflows/autofix.yml) | 目标分支为 `main` 的 PR | 使用 `--frozen-lockfile` 安装依赖，执行 `pnpm lint --fix`，将产生的修改交给 autofix.ci 处理。 | 为提交到主分支的贡献提供自动代码风格修复。 |
| [workflows/semantic-pull-requests.yaml](./.github/workflows/semantic-pull-requests.yaml) | Pull request target：打开、编辑或同步 | 校验符合 Conventional Commits 风格的 PR 标题，拒绝以 ASCII 大写字母开头的主题。仅在配置的 `{owner}/{repo}` 仓库运行。 | 统一 PR 标题，便于审查和维护发布记录。 |
| [workflows/enforce-release-source.yml](./.github/workflows/enforce-release-source.yml) | 目标为 `release` 的 pull request target：打开、重新打开或编辑 | 如果来源不是配置仓库的 `main` 分支，则检查失败。 | 限制发布晋级只能通过同一仓库的 `main` 分支 PR 进行。需将该检查设为必需检查，才能阻止不符合要求的合并。 |
| [workflows/pkg.pr.new.yml](./.github/workflows/pkg.pr.new.yml) | 修改了 `src/**` 的 PR | 安装依赖，执行 `pnpm build` 和 `npx pkg-pr-new publish`。取消同一 PR 的旧运行。 | 发布预览包，便于在合并前试用源码修改。 |
| [workflows/release.yml](./.github/workflows/release.yml) | 推送匹配 `v*` 的标签 | 调用 `lonewolfyx-workflows/npm-public-actions@main`，指定 pnpm，然后携带 `GITHUB_TOKEN` 执行 `npx genereleaselog@latest`。 | 根据版本标签自动发布包并生成发布日志；使用前需修正下文说明的权限配置位置。 |
| [workflows/pr-contributor-welcome.yml](./.github/workflows/pr-contributor-welcome.yml) | Pull request target：关闭；任务仅处理配置仓库中已合并的 PR | 获取最多五条归属于作者的提交；返回数量小于三时，创建或维护欢迎评论。 | 根据提交数量启发式欢迎贡献者。该方式不能确认这是作者首次合并的 PR。 |
| [workflows/pr-contributor-welcome-v2.yml](./.github/workflows/pr-contributor-welcome-v2.yml) | Pull request target：关闭；任务仅处理配置仓库中已合并的 PR | 搜索作者已合并的 PR；搜索结果恰好为一条时发布欢迎评论。文案包含 npmx 社区链接。 | 在作者首个 PR 合并后发送欢迎消息，并将社区文案改为自己的项目内容。 |

## Issue 表单与仓库配置

| 文件 | 含义与实际行为 | 适用场景 |
| --- | --- | --- |
| [ISSUE_TEMPLATE/bug-report.yml](./.github/ISSUE_TEMPLATE/bug-report.yml) | 必填项为问题描述、复现链接和预期行为；添加 `bug` 标签。 | 收集可定位和复现的缺陷报告。 |
| [ISSUE_TEMPLATE/feature-suggestion.yml](./.github/ISSUE_TEMPLATE/feature-suggestion.yml) | 必填项为使用场景和期望方案，可补充替代方案及上下文；添加 `enhancement`。 | 收集具有明确动机的功能建议。 |
| [ISSUE_TEMPLATE/documentation.yml](./.github/ISSUE_TEMPLATE/documentation.yml) | 要求描述文档问题，可补充预期页面位置及上下文；添加 `documentation`。 | 反馈文档缺失或表述不清的问题。 |
| [ISSUE_TEMPLATE/help-wanted.yml](./.github/ISSUE_TEMPLATE/help-wanted.yml) | 要求描述用户目标，可补充已尝试的方法及上下文；添加 `help`。 | 收集使用问题和支持请求。 |
| [ISSUE_TEMPLATE/config.yml](./.github/ISSUE_TEMPLATE/config.yml) | 允许创建空白 Issue，并定义带占位符的联系链接。 | 配置 Issue 类型选择页，引导用户前往支持渠道。 |
| [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) | 提供关联 Issue、背景和修改说明栏目，以及贡献检查清单。 | 统一 PR 描述；需将已有的代码托管平台相关清单调整为本项目要求。 |
| [renovate.json5](./.github/renovate.json5) | 继承 `github>config-preset/renovate-config`，设置 `automerge: true`。 | 启用 Renovate 后配置依赖更新；需确认共享预设和自动合并策略适合目标仓库。 |
| [FUNDING.yml](./.github/FUNDING.yml) | 配置 `lonewolfyx` 的 GitHub Sponsors、Open Collective 和 Buy Me a Coffee 账号。 | 展示目标维护者的赞助入口。 |

## 使用方法

1. 将需要的文件复制到目标仓库的 `.github` 目录。
2. 按照下表完成项目专属配置。
3. 对涉及项目包的工作流，提供 `package.json`、pnpm 配置和 `pnpm-lock.yaml`。定义所选工作流使用的 `lint` 和 `build` 脚本；使用 autofix 时，lint 脚本必须支持 `--fix`。
4. 按需配置所选外部服务，包括 Renovate、autofix.ci、预览包发布和正式包发布。
5. 创建 PR 验证所选检查。在依赖检查控制合并前，通过分支保护或规则集将对应检查设为必需检查。

## 使用前需要调整的内容

| 配置或文件 | 调整要求 |
| --- | --- |
| `{owner}/{repo}` | 替换发布来源检查、标题检查和两个欢迎工作流中的所有占位符，否则仓库条件会使任务跳过。 |
| 分支与路径过滤 | 根据分支策略、源码目录和发布约定调整 `main`、`release`、`src/**` 和 `v*` 标签模式。 |
| 欢迎工作流 | 选择一个版本。两者使用相同的工作流名称和并发组表达式，同时启用可能相互取消运行。调整欢迎文案，并替换 v2 中的 npmx Discord 和贡献者身份领取链接。 |
| `ISSUE_TEMPLATE/config.yml` | 将 `[label title name]`、`[label link]` 和 `[label description]` 替换为实际字符串，或删除该占位联系条目。 |
| Bug 复现链接 | 将 `lonewolfyx/package-name` 和 `playground` 路径替换为项目实际的复现地址。 |
| PR 检查清单 | 将 `forges` 文案、provider/capability/fixture 相关要求，以及 `pnpm check:all`、`pnpm capability-matrix` 等命令替换为自己的贡献要求。当前 CI 只运行 lint。 |
| Issue 标签 | 确认目标仓库存在 `bug`、`enhancement`、`documentation` 和 `help` 标签，或修改表单以匹配现有标签。 |
| 赞助与 Renovate | 按需替换赞助账号，并确认共享 Renovate 预设符合项目的依赖更新策略。 |
| 发布权限 | 将 action 步骤中的 `contents: write` 和 `id-token: write` 移到 release 任务或工作流层级。GitHub 的 `permissions` 配置位于工作流或任务层级，当前步骤层级的写法无效。参见 [GitHub 工作流语法文档](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idpermissions)。同时为所选发布 action 配置发布身份验证。 |

