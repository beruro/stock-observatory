# 股票研究台

[打开网站](https://beruro.github.io/stock-observatory/)

A 股研究工作台：大盘、板块与个股行情/资金；约一年价格与成交量；季度财报；公告；带数据快照的研究时间线。默认隆基绿能，可添加其他 A 股。

**网站公开，研究记录仅存当前浏览器。** 不需要登录，不上传笔记、不跨设备同步。清理浏览器数据前，请导出 JSON 备份；换设备可合并导入，同编号笔记保留目标浏览器版本。未保存草稿刷新后会丢失。

## 运行

Node.js 22.13 或更新版本。

```sh
npm ci
npm run dev
```

打开 `http://127.0.0.1:5173/stock-observatory/`。

```sh
npm run test
npm run lint
npm run build
npm run preview
```

## 发布

推送 `main` 后，GitHub Actions 执行测试、检查、构建，再发布 `dist` 到 GitHub Pages。仓库 Settings → Pages 使用 GitHub Actions。基础路径固定为 `/stock-observatory/`，更改仓库名称时需相应修改 `vite.config.ts`。

## 数据及限制

行情、资金、K 线、财报和公告直接读取东方财富公开接口，不需要 API 密钥。来源可能延迟、限流或改变访问政策；页面保留当前会话的旧数据并提供重试。自动更新为可选的前台每分钟刷新，部分较慢变化数据使用短期缓存。没有交易接口或自动预测。

资金是供应商按成交规模分类的口径，不等于机构持仓。财报单季度数由同年累计数差分，缺少上一季度时标为缺失。银行等行业不适用的指标可能缺失。行情和研究草稿不承诺离线可用。

记录在 IndexedDB 中保存。存储事务、编辑冲突及备份格式在 `lib/library.ts`；数据源和缓存位于 `lib/market.ts`；转换和展示规则在 `lib/normalize.ts` 与 `lib/presentation.ts`。开发问题和验证见 `HANDOFF.md`，交互契约见 `docs/lifecycle.md`。
