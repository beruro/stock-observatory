# 股票研究台交接

## 当前范围
用户已明确改为 GitHub Pages 公开网页、记录仅存在本机浏览器。发布目标是 `beruro/stock-observatory`，不使用先前的其他账号站点。默认隆基；最多 20 只 A 股自选；行情/资金/财报/公告；本机研究记录与快照；JSON 导出/合并导入。此前聊天周报任务已暂停，不重新创建。

## 实际问题与解决
- 纯静态托管没有服务端数据库。现采用 React + Vite 与 IndexedDB；本机写入置于同一事务，编辑/删除核对 updatedAt，跨页使用 BroadcastChannel 通知。旧服务端脚手架仅留在忽略目录 `work/previous-hosting/`。
- 东方财富四类接口实测支持 `https://beruro.github.io` 跨域请求；浏览器请求不能伪造 User-Agent/Referer，已移除并禁用 credentials。若未来供应商取消跨域支持，应显示不可用，不能伪造行情。
- 财报接口使用 reportName/columns/pageSize，旧 type/sty/ps 返回“报表名称不能为空”。RPT_F10_FINANCE_MAINFINADATA 和 RPT_DMSK_FN_INCOME 已实测。
- 平安银行和上证指数均为 000001，所有取值必须按完整 secid 区分，已有回归测试。
- 累计转单季必须相减同年上一期，缺期为 null。2026Q3 隆基营收 168.19 亿、净利 -10.29 亿、经营现金流 23.50 亿与原始公告核对一致。
- 手机 SVG 固定 viewBox 曾压扁文字，使用 ResizeObserver 按容器宽度绘制；资金表在手机将时点放到名称下，保留来源链接。placeholder 使用 --muted，白底对比度约 5.01。
- 浏览器 viewport 设置影响当前标签；截图前核对真实 innerWidth，并回到文档顶部，避免固定侧栏截图位移。
- 8787 被其他程序使用，未停止该程序。开发使用 5173，静态构建预览 4173。

## 运行与验证
`npm ci`；`npm run dev`；打开 `/stock-observatory/`。
`npm test`、`npm run lint`、`npm run build`；`npm run preview` 预览 dist。

本次 11 项自动测试通过：缺失数值/单季换算、代码与行情格式、旧数据保留、个股/指数区分、本机保存重读、编辑保留快照、独立记录、并发写入、旧版本冲突、导入往返及去重、错误备份拒绝、存储拒绝后恢复，以及真实数据读取路径的模拟失败/旧数据保留/重试恢复。
浏览器实测：无登录直接加载真实数据，添加平安银行，研究记录新建/编辑/刷新恢复，导出 JSON 并在另一本地 origin 成功合并恢复。桌面 1280、手机 390 已查看截图；无全页横向溢出，手机保留来源和资金时点。截图在 `.impeccable/review/pages-*.png`，本地验证记录与截图不发布。

## 开销与边界
本次构建 JS 291.94 KB / gzip 88.85 KB，CSS 19.08 KB / gzip 4.97 KB。没有后端、外部字体或图片。缓存与在途去重；行情 45 秒、历史 5 分钟、财报 1 小时、公告 10 分钟；每个远端请求最多 8 秒。自动更新可选，仅页面可见时每分钟触发。未验证大规模并发或供应商长期稳定性。
研究记录仅在此浏览器 origin，清理站点数据会删除记录；界面提示备份，导入不覆盖同 ID 的本机笔记。草稿在页面会话内按股票保留，刷新会丢失未保存内容。数据库无法访问或格式损坏时不静默重置。无自动下单、后台周报或大模型预测。

## 上线验收（2026-11-03）

静态应用提交 7956e56，GitHub Actions run 41600729342 全部成功。公开网址 https://beruro.github.io/stock-observatory/ 已通过浏览器实测：无登录、研究记录初始为空、真实行情/资金/公告与季度财报加载，控制台无错误。HTTP 200，单次 HTML 获取约 0.53 秒（本次环境测量，不代表完整首屏或普遍网络表现）。
本机存储告知、导出/导入、合并确认的窄范围 UI review disposition 为 ship；手机与桌面确认态均已截图。设计文档核对通过，新增控件复用原 token。线上截图 `.impeccable/review/github-pages-live.png`。只推送静态应用的独立 main 历史，旧托管记录保留本机 previous-hosting 分支，不推送。
