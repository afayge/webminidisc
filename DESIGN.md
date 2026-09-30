---
name: MiniDisc Label Studio
description: 以真实尺寸标签预览为中心的 MiniDisc 编辑工作台
colors:
  ground: "#e9eaec"
  shell: "#eeeef1"
  surface: "#fafafb"
  subtle: "#f0f1f4"
  ink: "#20242b"
  muted: "#5e6673"
  border: "#858d9a"
  soft-border: "#dfe2e8"
  accent: "#0866d9"
  accent-hover: "#0054bd"
  primary: "#0866d9"
  primary-hover: "#0054bd"
  primary-pressed: "#0047a3"
  selected: "#e5efff"
  danger: "#a32e29"
  warning: "#79521b"
  control: "#ffffff"
  on-accent: "#ffffff"
  info-ink: "#1557a7"
  danger-bg: "#fff0ee"
  warning-bg: "#fff4df"
  warning-border: "#d7bc87"
  art-shadow: "#20242b20"
  shadow: "#252f431c"
  highlight: "#ffffff"
  panel-edge: "#ffffff"
  glow-blue: "#bddcfa44"
  glow-lilac: "#e9d5ef44"
  dark-ground: "#1b1e23"
  dark-shell: "#191c22"
  dark-surface: "#272b33"
  dark-subtle: "#2e333d"
  dark-ink: "#f0f2f6"
  dark-muted: "#afb8c7"
  dark-border: "#778395"
  dark-soft-border: "#3b414c"
  dark-accent: "#8dbbff"
  dark-accent-hover: "#b1d1ff"
  dark-primary: "#1264c9"
  dark-primary-hover: "#2373d7"
  dark-primary-pressed: "#0d53ac"
  dark-selected: "#293f5f"
  dark-danger: "#ffb3aa"
  dark-warning: "#edc98d"
  dark-control: "#22262e"
  dark-on-accent: "#ffffff"
  dark-info-ink: "#a9ceff"
  dark-danger-bg: "#452b2c"
  dark-warning-bg: "#3c3325"
  dark-warning-border: "#836d49"
  dark-art-shadow: "#00000066"
  dark-shadow: "#00000066"
  dark-highlight: "#ffffff0c"
  dark-panel-edge: "#404651"
  dark-glow-blue: "#2c599126"
  dark-glow-lilac: "#6752801c"
typography:
  title:
    fontFamily: "'Avenir Next', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
  section:
    fontFamily: "'Avenir Next', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "'Avenir Next', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  compact-title:
    fontSize: "16px"
    lineHeight: 1.4
  compact-helper:
    fontSize: "11px"
    lineHeight: 1.5
  ruler:
    fontSize: "10px"
    lineHeight: 1
  helper:
    fontFamily: "'Avenir Next', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  field: "10px"
  control: "12px"
  dialog: "20px"
  panel: "20px"
  row: "8px"
  pill: "999px"
  brand: "14px"
  template: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  input:
    backgroundColor: "{colors.control}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "7px 8px"
  content-tool-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "7px 8px"
  layer-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.accent}"
    rounded: "{rounded.row}"
---

# Design System: MiniDisc Label Studio

## Overview

**Creative North Star: "MiniDisc 柔光工作台"**

以标签作品为中心的三栏工作台。参考用户提供的灰白圆角界面，以乳白面板、柔和高光和蓝色主操作建立层次；外围冰蓝与淡紫光晕仅用于界面背景，中央中性灰画布支持准确判断作品颜色。深色主题使用石墨灰、浅蓝强调与对应面板材质。

本规范仅适用于标签编辑器及其模板菜单、字体选择、素材库、预览和打印弹窗，不约束 ElectronWMD 的其他界面。界面字体、底色、标尺与选择手柄属于编辑辅助层，作品仍使用工程指定的颜色、字体、几何与毫米尺寸。

**Key Characteristics:**

- 预览居中，内容工具与图层属性分列。
- 清楚区分本机草稿、工程文件和实际尺寸输出。
- 本机字体栈、克制边界和清晰焦点，保持高密度工作的可读性。

## Colors

配色来自 `src/labels/theme.css` 的编辑器专用变量；上方 token 是规范值，正文只说明用途。

### Primary

蓝（accent）用于活动工具、图层选中和键盘焦点。主按钮单独使用 primary 系列变量，深色模式也保持蓝底白字；accent 专供选中、图标和焦点，以保证对比度。浅蓝（selected）用于选中底色与状态提示。

### Neutral

中性灰（ground）只承托画布区域；乳白（surface）用于工具面板，白色（control）用于输入框；浅灰（subtle）用于画布工具栏及次级容器。石墨（ink）用于正文，辅助灰（muted）用于字段名、尺寸和提示。常规边界（border）标识输入与操作区域；轻边界（soft-border）区分组内内容，panel-edge 用于装饰性面板轮廓。

危险色（danger）只承担错误信息，警告色（warning）用于字体缺失、溢出等需处理的提示；状态同时提供文字，不仅依靠颜色。

## Typography

界面使用本机字体栈，不加载在线字体。正文与控件以 body 为基础，分组与模板名使用 section，弹窗标题使用 title；页面品牌名为更紧凑的 18px / 1.2、650 字重。普通标题依场景为 16–18px，辅助文案为 helper。曲目字段与可调分隔提示沿用 11px；紧凑标题和本机字体列表保留 16px。毫米标尺刻度属于精密辅助图形，保留 10px 标记；它不承担操作提示。

数字启用等宽数字特性（`tabular-nums`）。作品中的字体与字号由工程数据决定，界面字体栈不得覆盖 SVG 文字轮廓。长工程名、图层名与说明可截断或换行，不能扩大侧栏或挤掉主要操作。

## Layout

桌面使用左侧内容工具（264px）、弹性预览、右侧图层属性（304px）三栏。外围及面板之间为 12px 间距；低于 1120px 收至 8px，低于 760px 收至 6px 并将主面板圆角减为 16px。左侧工具内容、右侧图层列表和所选图层属性独立滚动；图层列表默认 220px，支持拖动或键盘调整分隔条并在本机记忆，增删和排序操作位于列表下方，持续可达。顶部常驻工程名、草稿状态、打开、保存工程与排版／导出 PDF。

窗口宽度小于 1120px 时，左侧改为抽屉；小于 760px 时，两侧均为互斥抽屉，中央保留画布和主要操作。抽屉宽度为 `min(340px, 100vw - 40px)`。移动布局允许工具栏合理换行，不能产生页面级横向溢出。

间距采用上方 spacing 节奏：小间隙用于相关控件，中间隙用于字段，大间隙用于分组。标准按钮与输入、画布工具栏操作的最小高度为 36px。粗指针环境的按钮、选择框和常规输入增至至少 44px。

画布同时按可用宽高适配。工作台的 1.0× 是“适合画布”后的相对倍数，不是物理打印比例；高度偏好默认 500px，可在 240–1000px 调整并在本机记忆，小窗口按可用空间压缩。完整设计预览有独立的 10%–500% 缩放，不改变设计或输出尺寸。视口高度不超过 600px 时，工作区允许纵向滚动、画布区最小高度为 240px，保证界面放大后标尺可读且底部操作可达。

## Elevation & Depth

面板使用轻微明暗渐变、细高光边缘与向下扩散的柔和阴影，外围光晕不进入中央画布。仅顶栏、两侧面板、画布容器与弹层承担浮起层次，字段和图层行不叠加装饰卡片。相关材质与阴影集中定义于 theme.css，不使用 backdrop-filter 或持续动画。作品外轮廓使用轻微投影（`drop-shadow(0 3px 4px var(--md-art-shadow))`）帮助识别成品边界。菜单、抽屉和对话框复用现有 MUI 遮罩与层级；弹出层必须限制在视口内并允许内容滚动。

## Shapes

输入使用 10px field，普通按钮使用 12px control，图层行使用 8px row；顶栏操作和主要按钮为胶囊形，主面板及对话框使用 20px 圆角。模板入口为 16px 圆角。模板缩略图保留五种真实轮廓和结构关系，不能以统一矩形代替。作品成品轮廓、裁片机械间隙与折页关系由渲染核心决定。

## Components

### Buttons

主要按钮为蓝底白字，用于排版／导出 PDF；保存工程和打开保留中性底色与清晰边框。悬停改变底色与边框，按下显示选中色。键盘焦点使用 2px 蓝轮廓和 2px 外偏移。禁用按钮以 0.45 透明度及不可用指针表达；不要仅降低对比度而继续执行动作。

### Icons

**The Consistent Icon Rule.** 界面图标使用手写 SVG：`StudioIcon` 基于 24×24 网格、1.6 描边、圆润端点与连接，减少内部细节并按小尺寸校正视觉重量。默认显示 20px，七类内容工具 18px，图层／曲目等密集位置 16px；空选区的图层提示按现有规则显示 24px。

`variant` 支持 `outline`（默认）与 `filled`。七类内容工具为实心状态绘制独立闭合轮廓及透明留白，禁止直接填充开放线段；其他图标请求 filled 时保留 outline。普通图标为 muted 中性灰，选中工具为 ink 深灰／浅白，主操作图标继承白色。活动图层与模板勾选继承所属操作的强调色。切换工具通过现有 aria-pressed 状态更新形状，瞬时操作保持线稿。

MiniDisc 品牌图标同样采用 24×24 网格与 1.6 描边，保留卡匣切角、滑盖和碟片圆心，在编辑器顶栏／主页入口分别显示 30px／22px，窄屏顶栏保留 24px。品牌容器沿用既有样式，不为普通图标添加独立装饰底座。

打开为圆润文件夹，保存保留保存语义；预览使用取景框，图层显示／隐藏使用眼睛／划线眼睛。排序箭头、加、减、关闭、勾选与六点拖动手柄均使用组件；上下排序不使用文字箭头。旋转光标采用同样的圆润 1.6 描边，并保留白色衬线以适应作品底色。原生表单控件与作品素材保持自身表现。

模板缩略图使用 `TemplateThumbnail`：标准标签、全面标签、J-Card、封面、托盘卡只表现外形及必要分片，不包含山景、太阳、文字或彩色装饰。`selected` 默认为 false；入口恒为实心，菜单仅当前模板实心。普通状态使用 muted 线稿，选中使用 ink 实心，颜色继承 `currentColor`。图标区域为入口 44×48px、菜单 56×48px，内部 56×48 网格等比容纳默认模板；轮廓固定 1.4px（non-scaling-stroke），端点与连接圆润。折页常态共用一条分隔线，实心状态以 1.6 网格单位的透明间隔区分；全面标签分片间隙在显示层加宽至 3.2 网格单位。保留整体长宽比例，光学校正仅限缩略图，绝不复用到模板模型或导出路径。

SVG 为装饰元素，使用 `aria-hidden="true"` 和 `focusable="false"`；可访问名称与焦点由所属按钮提供。点击区域至少 36px，粗指针环境至少 44px，不随图标缩小。图标不进入 SVG／PDF 输出。

### Inputs / Fields

字段标签位于输入上方，位置与尺寸按两列排列，内容和长名称可跨整行。主题 control 底色、可辨识边框与 field 圆角统一数字、文字、下拉框和文本区域。保留可访问名称；窄屏隐藏视觉标签时仍提供 `aria-label`。

### Navigation

左侧七类内容工具为双列按钮，选中项使用浅蓝底、蓝字和较高字重。模板选择器显示轮廓、名称和默认展开尺寸；菜单支持方向键、Enter、Escape 与焦点返回。工具页切换不改变作品选区和数据。

### Layer inspector

图层列表顶端代表最前方；选中行带浅蓝底，显隐、拖动排序与名称分开。所选图层属性按“内容与样式”“位置与尺寸”组织；锁定时保持信息可读并禁用修改。没有选区时解释如何选择图层。属性修改时中央预览持续显示。

### Preview and output

画布上方放置面板、正反面、撤销重做、辅助线和缩放操作。画布下方显示真实毫米尺寸、预览高度、设计提示以及 SVG 范围、SVG 导出和完整设计预览。保存状态明确指向本机草稿，“保存工程”另行导出包含所有模板和素材的文件。

打印设置保留设置区与真实纸张预览，容器宽度达 960px 时并排显示，窄窗口纵向排列。完整设计预览与打印设置使用 MUI Dialog，支持 Escape 关闭和焦点返回。错误或超纸张情况必须显示说明；PDF 保持毫米纸张、零浏览器页边距及 `scale: 1`，排版内边距由工程打印设置决定。屏幕缩放不能修改物理输出。

### Motion and feedback

普通控件颜色与边框以 150ms ease-out 过渡，减少动画偏好关闭编辑器内过渡和动画。加载、保存、错误和设计警告保持文字反馈，不引入与任务无关的动画。

## Do's and Don'ts

### Do:

- **Do** 将编辑器样式限制在工作台与其弹出层，保留作品自身的字体、颜色与尺寸。
- **Do** 让主要保存和 PDF 入口持续可达，选中图层后直接显示其属性。
- **Do** 用真实模板轮廓、毫米尺寸和明确的缩放说明帮助判断输出。
- **Do** 保留键盘焦点、禁用状态、错误文字和减少动画偏好。

### Don't:

- **Don't** 把屏幕适配倍数当作打印比例，或为容纳纸张自动缩小作品。
- **Don't** 将工作区底色、标尺、网格或编辑手柄加入导出文件。
- **Don't** 为这套界面引入在线字体、独立主题开关或新的依赖；深浅色继续跟随应用主题。
- **Don't** 因调整面板组织而改变工程版本、持久化数据、模板几何或字体轮廓。
