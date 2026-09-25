---
name: MiniDisc Label Studio
description: 以真实尺寸标签预览为中心的 MiniDisc 编辑工作台
colors:
  ground: "#E7ECEF"
  surface: "#FFFFFF"
  subtle: "#F3F6F7"
  ink: "#24343C"
  muted: "#5D6D76"
  border: "#C9D2D8"
  soft-border: "#DFE5E8"
  accent: "#006C78"
  accent-hover: "#00545E"
  selected: "#E0F0F1"
  danger: "#AA3025"
  warning: "#855614"
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
  helper:
    fontFamily: "'Avenir Next', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  field: "4px"
  control: "6px"
  dialog: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  input:
    backgroundColor: "{colors.surface}"
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
    rounded: "{rounded.field}"
---

# Design System: MiniDisc Label Studio

## Overview

**Creative North Star: "MiniDisc 精密工作台"**

精致、清晰、易操作的 MiniDisc 工作台，以标签作品为中心。银灰工作区承托白色工具面板，青蓝色集中标记主操作、选中与焦点；碟片图标、真实模板轮廓及毫米标尺体现 MiniDisc 器材的精确感。

本规范仅适用于标签编辑器及其模板菜单、字体选择、素材库、预览和打印弹窗，不约束 ElectronWMD 的其他界面。界面字体、底色、标尺与选择手柄属于编辑辅助层，作品仍使用工程指定的颜色、字体、几何与毫米尺寸。

**Key Characteristics:**

- 预览居中，内容工具与图层属性分列。
- 清楚区分本机草稿、工程文件和实际尺寸输出。
- 本机字体栈、克制边界和清晰焦点，保持高密度工作的可读性。

## Colors

配色来自 `src/labels/labels.css` 的编辑器专用变量；上方 token 是规范值，正文只说明用途。

### Primary

青蓝（accent）用于 PDF 主操作、活动工具、图层选中和键盘焦点；深青蓝（accent-hover）提供明确的悬停反馈。浅青蓝（selected）用于选中底色与状态提示。

### Neutral

银灰（ground）只承托画布区域；白色（surface）用于工具面板和输入框；浅灰（subtle）用于画布工具栏及次级容器。石墨（ink）用于正文，辅助灰（muted）用于字段名、尺寸和提示。常规边界（border）区分面板，轻边界（soft-border）区分组内内容。

危险色（danger）只承担错误信息，警告色（warning）用于字体缺失、溢出等需处理的提示；状态同时提供文字，不仅依靠颜色。

## Typography

界面使用本机字体栈，不加载在线字体。正文与控件以 body 为基础，分组与模板名使用 section，弹窗标题使用 title；页面品牌名为更紧凑的 18px / 1.2、650 字重。普通标题依场景为 16–18px，辅助文案为 helper。毫米标尺刻度属于精密辅助图形，保留 10px 标记；它不承担操作提示。

数字启用等宽数字特性（`tabular-nums`）。作品中的字体与字号由工程数据决定，界面字体栈不得覆盖 SVG 文字轮廓。长工程名、图层名与说明可截断或换行，不能扩大侧栏或挤掉主要操作。

## Layout

桌面使用左侧内容工具（264px）、弹性预览、右侧图层属性（304px）三栏。左侧工具内容、右侧图层列表和所选图层属性独立滚动；图层列表最高 220px，增删和排序操作位于列表下方，持续可达。顶部常驻工程名、草稿状态、打开、保存工程与排版／导出 PDF。

窗口宽度小于 1120px 时，左侧改为抽屉；小于 760px 时，两侧均为互斥抽屉，中央保留画布和主要操作。抽屉宽度为 `min(340px, 100vw - 40px)`。移动布局允许工具栏合理换行，不能产生页面级横向溢出。

间距采用上方 spacing 节奏：小间隙用于相关控件，中间隙用于字段，大间隙用于分组。标准按钮与输入、画布工具栏操作的最小高度为 36px。粗指针环境的按钮、选择框和常规输入增至至少 44px。

画布同时按可用宽高适配。工作台的 1.0× 是“适合画布”后的相对倍数，不是物理打印比例；高度偏好默认 500px，可在 240–1000px 调整并在本机记忆，小窗口按可用空间压缩。完整设计预览有独立的 10%–500% 缩放，不改变设计或输出尺寸。视口高度不超过 600px 时，工作区允许纵向滚动、画布区最小高度为 240px，保证界面放大后标尺可读且底部操作可达。

## Elevation & Depth

白色面板、银灰画布与细边界承担主要层次，不使用装饰性悬浮卡片。作品外轮廓使用轻微投影（`drop-shadow(0 3px 4px #24343c20)`）帮助识别成品边界。菜单、抽屉和对话框复用现有 MUI 遮罩与层级；弹出层必须限制在视口内并允许内容滚动。

## Shapes

控件采用克制的圆角：输入和图层行使用 field，按钮使用 control，对话框使用 dialog。模板缩略图保留五种真实轮廓和结构关系，不能以统一矩形代替。作品成品轮廓、裁片机械间隙与折页关系由渲染核心决定。

## Components

### Buttons

主要按钮为青蓝底白字，用于排版／导出 PDF；保存工程和打开保留白底边框。悬停改变底色与边框，按下显示选中色。键盘焦点使用 2px 青蓝轮廓和 2px 外偏移。禁用按钮以 0.45 透明度及不可用指针表达；不要仅降低对比度而继续执行动作。

### Icons

**The Consistent Icon Rule.** 界面图标统一使用手写 SVG 的简洁圆角线稿：`StudioIcon` 基于 24×24 网格、1.75 描边，默认显示 18px，紧凑位置使用 16px；线帽与转角均为圆角，颜色继承 `currentColor`。加、减、关闭、勾选与六点拖动手柄也使用同一组件，不以字符替代。

MiniDisc 品牌图标独立使用 32×32 网格与 1.75 描边，保留卡匣切角、滑盖和碟片圆心，在编辑器顶栏／主页入口分别显示 30px／22px，窄屏顶栏按既有布局显示 24px。七类内容工具保留文字；完整设计预览用取景框，图层显示／隐藏用眼睛／划线眼睛，避免相同符号表达不同操作。

SVG 为装饰元素，使用 `aria-hidden="true"` 和 `focusable="false"`；可访问名称与焦点由所属按钮提供。点击区域遵循 Layout 的控件尺寸，不随图标缩小。图标不属于作品素材，也不进入 SVG／PDF 输出。

### Inputs / Fields

字段标签位于输入上方，位置与尺寸按两列排列，内容和长名称可跨整行。白底、细边框与 field 圆角统一数字、文字、下拉框和文本区域。保留可访问名称；窄屏隐藏视觉标签时仍提供 `aria-label`。

### Navigation

左侧七类内容工具为双列按钮，选中项使用浅青蓝底、青蓝字和较高字重。模板选择器显示轮廓、名称和默认展开尺寸；菜单支持方向键、Enter、Escape 与焦点返回。工具页切换不改变作品选区和数据。

### Layer inspector

图层列表顶端代表最前方；选中行带浅青蓝底，显隐、拖动排序与名称分开。所选图层属性按“内容与样式”“位置与尺寸”组织；锁定时保持信息可读并禁用修改。没有选区时解释如何选择图层。属性修改时中央预览持续显示。

### Preview and output

画布上方放置面板、正反面、撤销重做、辅助线和缩放操作。画布下方显示真实毫米尺寸、预览高度、设计提示以及 SVG 范围、SVG 导出和完整设计预览。保存状态明确指向本机草稿，“保存工程”另行导出包含所有模板和素材的文件。

完整设计预览与打印设置使用 MUI Dialog，支持 Escape 关闭和焦点返回。错误或超纸张情况必须显示说明；PDF 保持毫米纸张、零浏览器页边距及 `scale: 1`，排版内边距由工程打印设置决定。屏幕缩放不能修改物理输出。

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
- **Don't** 为这套界面引入在线字体、主题切换或新的依赖。
- **Don't** 因调整面板组织而改变工程版本、持久化数据、模板几何或字体轮廓。
