---
name: "股票研究台"
description: "蓝墨导航、白色研究正文与整齐数字列组成的个人 A 股研究工作台。"
colors:
  accent: "#385ac0"
  accent-hover: "#2b489e"
  nav: "#182b50"
  ink: "#1d293d"
  muted: "#637086"
  ground: "#f2f5f9"
  paper: "#ffffff"
  border: "#e0e5ed"
  control-border: "#cbd4e3"
  focus: "#6489e3"
  up: "#c83843"
  down: "#137b61"
  danger: "#b12c36"
  nav-up: "#ff8d95"
  nav-down: "#6cd6b7"
  nav-text: "#eef3fc"
  nav-muted: "#b4c4df"
  nav-selected: "#304970"
  nav-hover: "#243b63"
  research-surface: "#e7ecfa"
  research-ink: "#263d79"
  table-surface: "#f8fafd"
  outlook-surface: "#e3e9f4"
  outlook-ink: "#4d5c73"
  stronger-surface: "#e9e4f6"
  stronger-ink: "#674598"
  weaker-surface: "#f2e5d4"
  weaker-ink: "#7f551c"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "27px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "16px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  control:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "13px"
    fontWeight: 550
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.55
  price:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  index:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.3
  note:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  small: "4px"
  field: "6px"
  control: "7px"
  row: "8px"
  panel: "12px"
spacing:
  compact: "4px"
  small: "8px"
  label: "12px"
  medium: "16px"
  section: "20px"
  panel: "22px"
  section-large: "24px"
  gutter: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "8px 13px"
  button-text:
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    padding: "2px 0"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    width: "100%"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  watch-selected:
    backgroundColor: "{colors.nav-selected}"
    textColor: "{colors.nav-text}"
    rounded: "{rounded.row}"
    padding: "14px 24px 14px 12px"
  outlook-observe:
    backgroundColor: "{colors.outlook-surface}"
    textColor: "{colors.outlook-ink}"
    rounded: "{rounded.small}"
    padding: "3px 7px"
  outlook-stronger:
    backgroundColor: "{colors.stronger-surface}"
    textColor: "{colors.stronger-ink}"
    rounded: "{rounded.small}"
    padding: "3px 7px"
  outlook-weaker:
    backgroundColor: "{colors.weaker-surface}"
    textColor: "{colors.weaker-ink}"
    rounded: "{rounded.small}"
    padding: "3px 7px"
  research-entry:
    backgroundColor: "{colors.research-surface}"
    textColor: "{colors.research-ink}"
    rounded: "{rounded.panel}"
    padding: "22px"
---

# Design System: 股票研究台

## Overview

**Creative North Star: "投资委员会审阅材料"**

以投资委员会审阅材料为视觉参照：蓝墨色导航提供稳定定位，白色正文承载图表、财报与笔记，淡蓝紫色只标出研究入口和判断状态。数字列齐整，边界轻，信息密度适合长期查阅。

中文功能文字使用系统无衬线字体，价格与正文通过字号和字重分层；它是研究工作界面，没有独立的展示字体或装饰性图片。A 股红涨绿跌是数据语义，蓝色是操作与选择语义。所有已实现画面由代码、文字和 SVG 构成。

本文件从 `app/globals.css`、`app/workbench.tsx`、`app/stock-panels.tsx`、`app/research.tsx`、`app/price-chart.tsx` 以及 `.impeccable/review/` 的桌面和手机截图提取。前置 token 描述当前实现，非新的视觉提案；未采用的基础组件库不构成本系统的依据。

**Key Characteristics:**

- 蓝墨色固定导航与浅色阅读区域。
- 表格右对齐数字，全文使用等宽数字特性。
- 白色平面容器、细分隔线和克制的圆角。
- 来源、数据时点与旧数据反馈保留在相应内容附近。
- 桌面分栏，手机顺序阅读；研究记录与当时快照相邻。

## Colors

主色是克制的审阅蓝，深蓝只承担导航；白纸、灰蓝底与深墨正文保持连续阅读。

### Primary

- **审阅蓝**（`accent`）：主要按钮、选中标签页、文字链接和价格曲线；`accent-hover` 仅用于主按钮悬停。
- **蓝墨导航**（`nav`）：侧栏与手机顶部自选区。选中行与悬停行使用独立的蓝灰底，导航文字和涨跌颜色采用对应的浅色变体。

### Secondary

- **研究纸页**（`research-surface` / `research-ink`）：研究入口的淡蓝紫底与蓝墨文字。
- **判断标签**：观察使用灰蓝，逻辑增强使用紫色，逻辑减弱使用棕色。它们是状态标记，不是交易推荐。
- **行情方向**（`up` / `down`）：A 股正值为红、负值为绿；负号与正号同时提供方向线索。`danger` 只表示确认删除的动作。

### Neutral

- **正文墨色**（`ink`）：标题、正文与主要数值。
- **辅助灰蓝**（`muted`）：来源、标签、时间与浅底表单占位文字。占位文字保持全不透明。
- **底纸与正文纸**（`ground` / `paper`）：页面背景与面板分离；表头使用更浅的灰蓝底。
- **分隔与输入边线**（`border` / `control-border`）：容器边界与字段轮廓。`focus` 为键盘焦点使用。

**The Semantic Color Rule.** 蓝色用于操作、选择和价格曲线；红绿表达数值方向。研究逻辑增强与减弱使用紫色、棕色标签，避免与当日涨跌混淆。

## Typography

**Body Font:** token 中的系统无衬线栈，优先使用操作系统与中文字体。
**Label/Mono Font:** 无独立等宽字体；数字通过 `font-variant-numeric: tabular-nums` 对齐。

**Character:** 功能性、紧凑、易比较。当前没有独立展示字角色，因此不为未来页面补造 display token。

### Hierarchy

- **Headline**：股票名称；桌面值见 token，手机按断点降为 24px，最窄断点的股票名称为 25px。
- **Title**：面板和记录标题；手机面板标题为 14px。
- **Price / Index**：当前价格与指数的独立数字层级；最窄断点分别为 30px 和 14px。
- **Body / Note**：界面基础文字与研究正文；研究正文采用更宽松行距，并保留用户换行。
- **Control / Label**：操作与字段标注；表格正文为 12px，表头为 11px。现有局部辅助文字还有 10px，手机页脚与图表脚注出现 9px，这些紧凑例外不列为可复用的正文 token。

**The Aligned Evidence Rule.** 数值使用 tabular-nums；表格名称列左对齐、数值列右对齐，空值保留破折号。

## Layout

桌面采用固定侧栏（226px）和流动主区，正文最大宽度 1700px，默认水平留白 32px。顶部操作栏高 74px。行情区域由流动主列与 284px 辅列组成，列间距 22px；主要内容块之间通常为 20px。研究编辑器与时间线为等分双列，间距 26px。

- 宽度至少 1500px：正文水平留白增至 40px，辅助列为 310px，图表高 290px。
- 宽度至多 1190px：侧栏为 196px，正文留白 22px；行情转为单列，研究入口与公告在下方形成双列。财报摘要转三列。
- 宽度至多 800px：导航回到文档流顶部，自选横向滚动；主区占满宽度，正文留白 20px；编辑器与时间线转单列，顶部栏高 64px。
- 宽度至多 520px：正文留白 16px，行情标题和来源纵向排列；资金表将时间移到行名称下，保留查看来源入口。行情详情为三列、资金结构及财报摘要为两列，辅助区域按阅读顺序堆叠。

指数带保持四列；财报表格在独立滚动区域中保留列宽。图表使用真实容器宽度计算 SVG 坐标，避免手机文字被水平压缩。全局不以横向页面滚动承载布局。

## Elevation & Depth

阅读区以平面、底色与细边界区分层次，没有常驻面板投影。浅蓝紫研究入口通过底色获得强调，研究时间线直接放在页面底纸上，以分隔线分条。

### Shadow Vocabulary

- **浮动状态通知**（`0 8px 28px #15294b1a`）：底部 toast 使用，样式来源为 `--shadow`。
- **已选区间**（`0 1px 3px #1d293d12`）：仅用于分段控件内部的白色选中按钮。

**The Flat Reading Surface Rule.** 正文容器以底色和细边框建立层级；仅选中的区间按钮与浮动状态通知使用阴影。

## Shapes

圆角属于清晰的功能层级：标签及区间项使用 small，字段与快照使用 field，操作按钮使用 control，自选行及通知使用 row，面板及研究入口使用 panel。本机记录标识为圆形。容器边界为 1px 实线，不使用装饰裁切。

图标为描边 SVG，通常在 14–18px；品牌图形和空态可稍大。没有栅格图片或需要延续的摄影风格。

## Components

### Buttons

紧凑的文字动作与实体主要动作。

- **Primary**：审阅蓝底、白字，最小高度 36px，参数见 token。用于保存、发起研究等主要动作。
- **Secondary**：白底与输入边线，用于刷新、取消；悬停为浅蓝底并加深边线。
- **Text**：蓝字、可配描边图标；悬停显示下划线。
- **Focus / Disabled**：全局焦点线为 2px，偏移 3px；禁用按钮半透明、不可点击。手机按钮缩为 12px 字号及 7px 10px 内边距。
- **Loading**：刷新图标以 1 秒线性旋转；保存使用“保存中…”文字。没有常驻装饰动画。

### Chips

研究判断标签为静态文字标签，采用小圆角与低饱和底色，无交互悬停。观察、增强、减弱各有独立语义颜色，标签文字始终明确写出状态。

### Cards / Containers

白色面板由边线与圆角定义，默认无投影。面板标题默认内边距为 20px 22px 15px，手机为 17px 16px 13px。内部表格可全宽贴合边界，正文与脚注再对齐同一内边距。研究入口使用淡蓝紫底，内容内边距见 token。

### Inputs / Fields

研究字段为白底、输入边线与 field 圆角；标签始终在字段上方，间隔 8px，字段组之间 18px。输入字号 13px、字重 400；多行正文的行距为 1.8，可垂直调整大小。占位色使用 muted 且 opacity 为 1。侧栏搜索是深色背景的单独变体，使用 nav-muted 占位色。

字段沿用全局可见焦点线；校验失败和加载失败在邻近区域显示浅暖色反馈与重试操作。错误与禁用状态不靠 placeholder 表达。

### Navigation

自选项以蓝灰底显示当前选择，名称和代码在左、价格和涨跌在右。删除动作桌面悬停或键盘聚焦时出现，手机常显。详情标签页以蓝字与底部 2px 线标记选择；未选项保持辅助灰蓝。小屏自选转为顶部横向列表，研究标签页仍保持同一顺序。

### Evidence Tables and Chart

表头为浅底与轻字重，数据行以细横线分隔；层级名称左对齐，变化、金额和比率右对齐。手机的资金表时点移入名称单元格，不能被省掉。曲线使用蓝色 2px 描边与浅色面积，成交量使用低饱和红绿；十字线为虚线。鼠标与方向键可查阅读数，并提供数据表入口。

### Research Timeline and Snapshot

记录采用无外框的分隔行，时间和判断标签在标题之前，正文下可展开当时快照。快照使用细框与小圆角，编辑动作为文字按钮；删除先显示行内确认。记录正文保留换行并允许长文本换行。

### Feedback and Motion

状态通知固定在页面底部，使用深蓝底、白字与局部阴影，入场持续 180ms。启用减少动态效果时关闭动画、过渡与平滑滚动。来源、旧数据和失败提示属于必要反馈，不以装饰性副标题替代。

### 本机备份

侧栏底部并列导出与导入，短提示说明记录仅在当前浏览器及清理前备份。窄屏保留两项操作与提示；隐藏无须登录的重复身份行。导入先显示数量与合并规则，不以导入覆盖现有同编号笔记。

## Do's and Don'ts

### Do:

- **Do** 用蓝色表示可操作项与当前选择，沿用红涨绿跌及带符号的数值。
- **Do** 把来源与时间作为证据展示；手机保留来源链接，并将资金表的时间放在层级名称下。
- **Do** 沿用白色面板、细分隔线、数字列对齐及现有圆角层级。
- **Do** 为表单保留可见标签、清晰占位文字、错误重试入口和键盘焦点。
- **Do** 让研究正文自然换行；财报宽表在自身区域横向滚动。

### Don't:

- **Don't** 用红绿表达研究观点增强或减弱，也不要把数据源的资金分类当作机构持仓。
- **Don't** 为普通正文面板添加悬浮阴影、装饰背景图或多余的副标题。
- **Don't** 在手机隐藏数据来源或时点以节省空间。
- **Don't** 将占位文字调得比 muted 更浅，或用占位文字替代字段标签。
- **Don't** 将当前少数紧凑辅助文字的 9–10px 尺寸推广为新界面的默认阅读字号。
