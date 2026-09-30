# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

MiniDisc 标签与包装制作者，在 ElectronWMD 桌面应用中编辑专辑、曲目和设计图层。

## Product Purpose

在真实毫米尺寸的模板上设计 MiniDisc 标签及包装，保存可继续编辑的工程，并输出 SVG 和可打印 PDF。

## Operating Context

左侧内容工具、中央画布、右侧图层与属性；小窗口使用抽屉。主要流程是打开或创建工程、编辑内容与图层、预览、保存工程、排版并导出。草稿保存在本机，独立于导出的工程文件。

## Capabilities and Constraints

React 18、TypeScript、MUI 与 CSS，运行于 Electron 或浏览器。支持五类模板、素材与本机字体、撤销重做、真实纸张预览和双面排版。界面跟随应用深浅主题。

界面改版必须保留现有功能、未提交的工作、工程版本、持久化数据、模板几何、毫米尺寸、字体轮廓和 Electron 接口。界面底色、阴影、网格、标尺与编辑手柄不得进入导出。不得为视觉更新引入在线字体、装饰图片或新依赖。

## Brand Commitments

保留 MD Studio 名称和现有碟片／线性图标；本轮按用户提供的柔和灰白、大圆角、蓝色强调参考图重做视觉，保留三栏布局并同步深浅主题。

## Evidence on Hand

标签实现、离线字体及素材、五类示例工程、现有标签核心测试与 MD-LABELS-QA.md 中的历史验证记录。历史验证不代表本轮已重新验证。

## Accessibility & Inclusion

保留可访问名称、键盘操作、焦点返回、中文输入、错误文字、触控尺寸和减少动画偏好。普通文字对比度至少 4.5:1，操作边界和焦点至少 3:1。
