# MD 编辑器验证记录

日期：2026-09-24。环境：macOS / Apple Silicon，Electron 43.3.0；独立测试用户目录，未连接或写入录音设备。

## 自动检查

- 渲染器 `npx tsc --noEmit`、主进程 `npm run build:main`：通过。
- `webminidisc/npm run test:labels`：17 项通过，覆盖五模板尺寸、异形裁切、底部书脊刚体旋转、选中曲目/分组/CSV 顺序、全角标题、M3U、隐藏折页保留、文字绑定/溢出、CJK 路径、三种代码生成、工程与素材往返/损坏处理、原生 SVG 白名单、分页/超大尺寸、双面空白页和独立背景。
- 既有 `webminidisc/npm run test:titles`：17 项通过。
- 主进程 `node --test tests/adapters.test.cjs tests/app-shutdown.test.cjs tests/label-pdf.test.cjs tests/shutdown.test.cjs`：19 项通过（包含 3 项新增 PDF 输入安全测试）。
- `git diff --check`：通过。显式重建 renderer 并复制到 Electron 的 `renderer/`，未依赖普通 build 对旧产物的缓存。
- 额外尝试完整 `test:shutdown` 时，既有 helper 集成测试在本机 Node 26 下挂起，已停止该次运行；未将该完整套件记为通过。此功能未修改 helper。

## Electron 实际操作

通过原生界面验证：欢迎页打开、加载中文字体、编辑专辑、载入示例、五模板切换、M3U8 三首歌导入、导入含脚本的 SVG 后清理栅格化、图片跨全面标签三个区域连续显示、图层位置编辑、J-Card 底部书脊/内侧制作信息、保存 `.mdlabel`、重开并恢复图片和歌曲、进程重启后自动恢复草稿、下载五类示例、SVG 导出、五模板成套 PDF 导出。

PDF 已渲染为图片检查：全面标签实际填充、中文/日文字形、书脊方向、独立正反页、裁切线/折线。3.1 MB PNG 压力素材导出为约 3.3 MB / 4 页 PDF，页面约 594.96 × 841.92 pt（Chromium A4 毫米换算会有小数舍入）。二维码从实际 PDF 渲染图通过 macOS Vision 解码，得到 `https://minidisc.wiki`。

## 本机可运行产物

已生成 `build/md-labels/mac-arm64/ElectronWMD.app`，使用 Electron 43.3.0 ARM64。Ad-hoc 签名通过 `codesign --verify --deep --strict`；已在实际打包应用中启动并检查编辑器。未执行 Apple 公证，也未替换系统中已有应用。

重现打包：先运行 `./build-renderer.sh --force` 和 `npm run build:main`，准备 `npm run install:test-runtime`，然后运行 `CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --arm64 --dir --config electron-builder.labels.json`。

## 边界

- 设备数据使用只读 Disc 快照和测试数据验证；未做实体 MD 插拔/连接测试。编辑器没有调用设备改名、排序或写入服务。
- 未连接实体打印机；纸张进给误差、裁切贴合和长/短边双面套准必须先用普通纸实测。
- Windows/Linux 原生打印及 Win95 模式入口尚未做交互实测；Win95 和普通模式接入同一编辑器。
- 导入 SVG 会清理并栅格化，文本导出为路径，图片仍为内嵌位图。字体使用离线 Noto CJK，粗斜体为合成轮廓。
- 构建仍有既有依赖的 eval、体积和 Browserslist 提示；离线 CJK 字体约 40 MB，编辑器按需加载。

## 2026-09-24：预览、鼠标缩放与素材库更新

- Renderer TypeScript 检查通过，19 项编辑器核心测试通过。新增覆盖 8 个手柄、0/±90/37/180° 旋转的固定对角点、Shift 等比缩放、底部 J-Card 坐标映射及素材校验。
- 327 张 PNG/WebP 原图全部可解码，原始文件和打包后的文件 SHA-256 一致，素材约 20.41 MiB。应用包通过 `codesign --verify --deep --strict`。
- 实际打包应用中用鼠标将预览从 500 px 缩至 420 px，再增至 440 px；未勾选网格时背景干净，勾选后显示毫米网格。
- 搜索 HiFi、插入 Hi-Fi Stereo PNG、插入 hi-res-audio WebP 成功。图库分别提供 138 张徽标、189 张贴花。工程素材改名成功，正在使用的素材移除按钮禁用。
- 鼠标角手柄将图片从 30 × 21.429 mm 缩至 22.5 × 15 mm；一次撤销恢复原尺寸，重做恢复新尺寸。
- `.mdlabel` 保存并通过原生文件窗口重新打开，内嵌图片、改名和尺寸保留。SVG 包含两张内嵌图片且没有预览网格。实际生成 4 页 A4 PDF，栅格化检查确认 Hi-Fi 图片完整显示。
- 实体打印机的尺寸与双面套准未新增实机验证。其余平台边界沿用上文。

## 2026-09-24：图案预览、汉字导入、图层与本机字体

- 主进程/渲染器类型检查通过；27 项标签核心测试、18 项标题测试、16 项相关主进程测试通过。新增覆盖导入字形转换与原始备份、跨面板/正反面图层排序、锁定限制、字体引用 ZIP 往返、PostScript 匹配/按需读取/失败重试、无矢量轮廓拒绝、缺失字体导出阻断、五模板完整预览几何、10% 比例计算及两种界面的选中曲目快照。
- 实际 Electron 读取 1,327 个本机字体样式；搜索并应用 PingFang SC Regular，保存工程、重启应用后自动恢复。ZIP 只包含工程 JSON 和图片素材，字体记录为 `postscriptName/family/style`，没有字体文件或字体安装路径。
- 实际导出本机字体 SVG：78.1 × 66.8 mm，97 条路径，0 个 `<text>`；实际 PDF 4 页，594.96 × 841.92 pt（A4）。将 PDF 第一页栅格化检查中文文字、换行、Hi-Fi 图片、裁切和折线。新预览不参与纸张排版。
- 缺失字体工程在图层列表明确标记，保留原名称；实际 SVG 导出被阻止并提示选择替代字体。明确切换思源黑体后导出成功。
- MockMD 混合标题 `音楽の国　桜　広場　中文`：保持原格式不变；简体为 `音乐の国　樱　广场　中文`；繁体为 `音樂の國　櫻　廣場　中文`。转换后返回主界面，MockMD 标题仍为原始日文字形。全盘导入 5 首，选中导入 1 首。Win95 菜单与左下角入口现共用选择快照。
- 实心/空心圆显隐立即生效，操作后文字层仍保持选中；隐藏状态保存至工程并在导出中生效。初次适合窗口已修正，在本机全面标签为 230%，加一次到 240%；500% 时加号禁用。
- 字体解析失败和无矢量轮廓主要由自动测试覆盖，未逐一测试所有安装字体；旧版应用不能完整还原新增本机字体引用。实体 MD、打印机尺寸/双面套准以及 Windows/Linux 本机字体权限仍未实机验证。
- 最终应用中复测图层指针拖动：Hi-Fi 从第 2 层移动到标题后方（第 4 层）；一次撤销恢复原顺序，重做恢复移动结果。锁定文字层后手柄及上移/下移禁用，圆形仍可隐藏/显示。保存后的 ZIP 验证其他四种模板设计完全不变。
- 逐一打开标准标签、全面标签、J-Card、封面、托盘卡的完整图案预览；J-Card 正反切换正常，背面没有辅助线，全面标签保留机械间隙。另实际搜索并应用 Hiragino Mincho ProN W3、Arial Regular 并导出路径 SVG；两种字体的 PostScript 引用保存正常。
- 最终 `npm run pack:labels` 完整重建 renderer、main/preload 与 Mac ARM64 包；`codesign --verify --deep --strict` 通过。版本保持 `0.5.2-1.5.5`，应用包位于 `build/md-labels/mac-arm64/ElectronWMD.app`。

## 2026-09-24：SVG／PDF 2 mm 出血与裁切标记

- 新工程默认 2 mm 出血及裁切标记；0–5 mm 可调，开关独立。主进程与渲染器类型检查通过；33 项标签核心测试、18 项标题测试、18 项相关主进程测试通过（共 69 项）。新增覆盖五模板在 0/2/5 mm、裁切标记开/关下的成品尺寸、占用范围、至少 8 mm 裁片间距、真实轮廓毫米偏移、原稿取样、图片原图内容与边缘像素补足、折线处隔离、两种翻转位置以及超纸张报错和分页。
- 实际 Electron 打开旧草稿及零出血旧工程，均显示升级提示并启用 2 mm/裁切标记。改为 0 mm、关闭标记后保存、原生文件窗口重开、退出应用并重启恢复草稿，设置保持 0/关闭，没有重复升级。保存的 ZIP 仍为工程版本 1，含 `print.bleedSettingsVersion: 1`；已有非零设置保留由回归测试覆盖。
- 使用含连续渐变图片、文字及五类模板正反面的本地测试工程，在 Electron 实际导出全面标签 SVG、独立滑盖 SVG、4 页 A4 PDF 和 4 页整页 SVG ZIP。完整全面标签导出画布为 185.7715 × 76.9014 mm，独立滑盖为 38.1868 × 29.2812 mm（均包含出血与标记占用范围）；成品轮廓和各片原稿坐标不变。
- PDF 页尺寸实测 594.96 × 841.92 pt（Chromium A4）。第一张正页包含标准主标签/侧标、全面标签三片/侧标及 J-Card；第二张正页包含封面及托盘卡，反页位置成对输出。SVG 和 PDF 使用同一裁片内容，回归测试核对长/短边翻转和底部 J-Card 的面板位置、外侧折线。
- 页面栅格化检查发现并修正互补裁切边缘、像素补边条的抗锯齿细缝。补边使用内嵌图片的内部引用，避免重复编码；相同全面标签 SVG 从约 3 MB 降为约 638 KB，整页 SVG ZIP 从约 16 MB 降为约 3.4 MB。PDF 校验只允许内部引用内嵌栅格图片，拒绝外部、递归和重复 ID 引用。
- 实际打开完整图案预览，确认仍保留机械间隙，不显示出血、裁切标记或纸张；缩放与设计尺寸不受导出设置影响。
- 本轮使用隔离配置，无真实 MD 连接或写入；实体打印机裁切精度、进纸偏差和正反面套准仍需实机校准。最终应用与样张位于主项目 `build/md-labels/`。
- 最终包再次实际导出并栅格化正页及背页，确认互补遮罩引起的白色接缝已消除；采用连续出血底图加不透明成品覆盖，成品文字与图像尺寸不变。最终样张为 `build/md-labels/qa/MD-Bleed-2mm.pdf`、`MD-Bleed-Full.svg`、`MD-Bleed-Sheets.zip`、`MD-Bleed-2mm.mdlabel`；正反页检查图为同目录 `print-front.png`、`print-back.png`。完整 renderer/main/preload 重建及 ad-hoc 签名检查通过，隔离配置下正常退出记录为 `shutdown-complete`。

## 2026-09-24：以标签预览为中心的工作台改版

本节是界面改版的增量验证，不代表重新执行上文所有历史检查。测试使用独立数据与配置，保留用户原草稿；未连接或写入真实 MD。

- 标签核心测试 34 项、标题测试 18 项、PDF／本机字体权限／preload 版本测试共 7 项，合计 59 项通过。仅为新增加的画布宽高适配补充针对性测试。渲染器 TypeScript、主进程／preload TypeScript 和 renderer 生产构建通过；未新增依赖。
- 对同一整套测试工程，比较五类模板正反面的 10 个 SVG、4 页排版 SVG 和排版 JSON，改版前后全部字节一致。毫米尺寸、裁片位置、文字路径及导出内容保持一致；8 个受保护核心文件的 SHA-256 未变化。数据模型、`.mdlabel` 版本、IndexedDB、模板几何、字体轮廓、出血／分页算法及 Electron IPC 未调整。
- 在 Electron 43.3.0 中调用生产 PDF IPC 实际生成改版前后 PDF：均为 4 页 A4，页尺寸 594.96 × 841.92 pt，文件均为 199,895 字节。以 96 dpi 逐页栅格化后，4 对 PNG 的 SHA-256 全部相同，包含正反面位置与文字路径的视觉结果一致。PDF 继续使用毫米纸张、零浏览器页边距与 `scale: 1`；超纸张拒绝和双面排版由相关既有测试覆盖。
- 检查 1440×900、1280×720、1024×768 和 390×844 实际浏览器截图：三栏布局、左侧抽屉、双侧互斥抽屉、顶部主要操作及画布正常，未出现页面横向溢出。检查选中图层后的字号修改、撤销／重做、相对缩放及独立设计预览。
- 实测五种模板切换、J-Card 正反面、预览高度调整与记忆；抽屉及对话框 Escape 关闭后焦点返回；保存工程后通过文件选择器重新打开 `.mdlabel`，标题 `城市漫游 / NIGHT SESSION`、专辑标题字号 4 mm、cover.svg 和 3 首曲目均保留；刷新页面后重新进入编辑器，草稿标题与模板恢复。浏览器控制台无错误。
- Impeccable 最终视觉检查结论为可交付。辅助文字在银灰底对比度约 4.507:1，青蓝主按钮白字约 6.147:1。静态检测无报告项，作为截图与实际操作的补充证据。
- 独立 macOS ARM64 应用已打包到主项目 `build/md-studio-workbench/mac-arm64/ElectronWMD.app`，`codesign --verify --deep --strict` 通过。使用 `EWMD_USER_DATA=/tmp/md-studio-redesign/app-profile` 启动，确认 `sandbox://app/index.html` 加载、新三栏工作台、离线字体、默认标准标签及保存／PDF 入口可用；退出码为 0，日志含 `shutdown-complete`。未替换已有应用。
- 供复查的桌面截图、手机截图和 4 页验证 PDF 保留在主项目 `build/md-studio-workbench/qa/`，分别为 `workbench-desktop.png`、`workbench-mobile.png`、`output-regression.pdf`。其余对比证据位于临时目录 `/tmp/md-studio-redesign/`，不作为工程素材提交。未进行实体打印、Windows/Linux 原生界面或完整屏幕阅读器测试；纸张进给和双面套准仍需实物测量。生产构建仍有既有依赖的 eval、包体积、混合动态导入及 Browserslist 提示。

## 2026-09-24：统一圆角线性图标

本节仅记录图标更新的增量验证。改动限于界面 SVG、引用、相关控件间距与低高度滚动，未新增依赖或图片素材；作品素材、工程数据、模板几何与导出核心保持不变。

- 标签核心测试 34 项、渲染器 TypeScript 与生产构建通过。同一测试工程的五模板正反面 SVG（10 个）、4 页排版 SVG 和排版 JSON，共 15 个文件在更新前后字节一致。
- 在 1440×900、1280×720、1024×768 和 390×844 检查图标、文字与布局；显隐及撤销／重做、菜单／抽屉 Escape 关闭与焦点返回、独立预览缩放通过，浏览器控制台错误为空。常规操作目标至少 36px，粗指针环境至少 44px；窄工具标签调整内边距以保留文字。
- Impeccable 图标视觉审查未发现主要问题；约 200%（约 207% 原生档位）界面缩放补测发现低高度时输出条被裁切、标尺拥挤，已增加低高度纵向滚动及 240px 画布最小高度，原生复测通过。最终截图补充审查判定该问题已解决（resolved），本轮可交付。单次静态检测产生 8 项提示，均为既有 token／文档差异（菜单 8px 圆角、16px／10px 字号、3px 圆角及错误／警告色）；本轮未扩展修改这些非图标差异。
- macOS ARM64 包位于主项目 `build/md-studio-icons/mac-arm64/ElectronWMD.app`，修复后重新打包并通过 `codesign --verify --deep --strict`，使用独立配置原生启动。其余平台、实体 MD、实体打印和完整屏幕阅读器测试边界沿用上文。
- 桌面、手机与内容工具截图保留在主项目 `build/md-studio-icons/qa/`，分别为 `desktop.png`、`mobile.png`、`tools.png`。原生约 200% 缩放证据为同目录 `zoom-200.png`。
- 低高度修复后，1280×600 的工作区纵向滚动生效，Tab 可聚焦并完整显示“导出 SVG”；1280×601 保持原布局。两张截图确认标尺可读，生产构建再次通过。
- 原生约 200%（约 207% 原生档位）下，Tab 从“适合窗口”可继续到“设计预览”和“导出 SVG”；工作区自动滚动使完整输出栏可见，顶栏保存／PDF 入口持续可见。标尺不再重叠，验证后恢复 100% 并退出，进程退出码为 0，日志包含 `shutdown-complete`。补充审查查看了修复前截图、600／601px 边界图与最终放大截图；最终图确认导出按钮焦点和完整输出栏。

## 2026-09-27：编辑交互与实际纸张预览

本轮修改数字草稿、文字撤销分组、曲目排序、打印界面与素材／字体列表；工程格式、渲染几何、出血／分页核心及 Electron PDF IPC 未改动。验证使用临时浏览器上下文和隔离 Electron 用户目录，未连接实体 MD，未替换已安装应用或发布安装包。

- 标签核心测试 48 项通过，包括新增加的数字提交边界、800 ms 撤销分组／组合输入、撤销重做分支、稳定 ID 曲目移动和虚拟列表范围测试。渲染器 TypeScript 与生产构建通过；构建仍有既有 eval、包体积、混合动态导入和 Browserslist 警告。
- 使用本机 Playwright 与 Google Chrome，在 `http://localhost:5174/` 实测：打开编辑器、连续文字编辑一次撤销／重做、曲目键盘移动／焦点跟随／状态播报、时长清空、负数小数、越界恢复、Escape 取消、撤销后数值同步。页面身份正确，无空白页、框架错误覆盖层及浏览器错误日志。Browser 插件未提供，采用本机 Playwright；本项目只允许 localhost 使用 HTTP，127.0.0.1 会被既有入口重定向到 HTTPS。
- 1,327 项测试字体样式中，初始／末项导航只挂载最多 16 行；End 定位并选择第 1,327 项，搜索单项及无结果状态通过。该大列表数据由测试注入，选择后使用真实思源字体字节验证解析链路，不代表本机每种字体均已实测。内置 327 项素材每页 24 项，翻页、搜索归第一页、来源语义状态及改名保留焦点通过。
- 五模板示例工程的纸张预览使用真实排版 SVG，每次仅挂载当前页；提交份数后立即禁用导出，更新后恢复。浏览器从预览图片取得 SVG，与下载 ZIP 中对应首页逐字节一致。A4／Letter／自定义纸张、取消全部模板后的错误与恢复通过；缺失字体、超纸张和两种双面翻转的输出边界由既有核心测试覆盖。
- 1440×900 桌面显示设置与预览两列，1024×768、390×844 及 720×450 使用上下布局；未出现打印弹窗横向溢出，关闭后焦点返回原入口。截图检查桌面与手机布局。Electron 43.3.0 另以真实 `setZoomFactor(2)` 验证 200% 缩放，Tab 目标“导出整页 SVG”完整进入可视区域。
- 修改前后使用同一“整套包装”工程比较 10 个模板正反面 SVG、4 页排版 SVG 和排版 JSON，15 个文件全部逐字节一致。隔离 Electron 界面实际点击 PDF 导出，通过生产 `labels:renderPdf` IPC 生成 4 页 PDF，成功提示在弹窗内可见；重复触发未产生第二次 IPC 调用。另以生产 IPC 对回归排版生成 199,895 字节 PDF。
- 临时证据目录：`/tmp/md-interactions/`，包含 `ui-results.json`、桌面／手机／平板截图、`electron-zoom-200-export.png`、`ui-export.pdf`、`regression.pdf` 与前后 SVG 对比。这些临时文件未作为工程素材提交。
- 未实测实体打印机、实体 MD、Windows／Linux、完整屏幕阅读器朗读及操作系统级中文输入法。组合输入分组有逻辑测试，状态播报与焦点有 DOM／键盘验证；不将其等同完整辅助技术实测。

### 同日独立 App 构建

执行 `npm run pack:labels -- --config.directories.output=build/md-studio-interactions`，完整重建 renderer、main 和 preload，生成 `build/md-studio-interactions/mac-arm64/ElectronWMD.app`（Apple Silicon，应用 0.5.2-1.5.5，Electron 43.3.0）。Ad-hoc 签名经 `codesign --verify --deep --strict` 验证通过，未进行 Apple 公证。初次主进程 inspector 检查未就绪，随后通过浏览器调试接口验证实际打包 App：`sandbox://app/index.html` 正常加载，标签编辑器与纸张预览可用，PDF 按钮启用；关闭后退出码 0，日志含 `shutdown-complete`。使用隔离用户目录，保留原 App 和用户草稿；启动截图位于 `/tmp/md-app-smoke/packaged-preview.png`。


## 2026-09-30：附件风格的双主题柔光工作台

本节仅记录本轮界面变化。保留已有未提交工作，使用独立浏览器上下文和 Electron userData，未访问用户草稿、连接设备或进行实体打印。

### 修改范围

- 保留三栏与 1120／760px 抽屉断点，新增 12／8／6px 自适应间隙、20px 主面板圆角、乳白／石墨灰材质、外围轻光晕及蓝色胶囊主操作。画布保持中性底色。
- 编辑器入口、顶栏、内容工具、图层属性、模板菜单、字体与素材控件、设计预览、打印窗口、抽屉和状态反馈统一使用编辑器专用双主题 token。MUI 模板菜单移除覆盖样式表的固定圆角与阴影。
- 更新 DESIGN.md 与 .impeccable/design.json，补充 PRODUCT.md。未新增依赖，未修改模型、渲染、存储、交互几何、字体解析、打印排版或 Electron IPC。

### 环境与检查

Browser plugin not available：使用已安装的 Playwright 与 Chrome 154，地址 http://localhost:5173/。最初 127.0.0.1 被测试浏览器升级至 HTTPS，改用 localhost 后正常；未修改应用网络配置。原生 PDF 使用已有 Electron 43.3.0 ARM64 测试运行时和当前源代码，未打包应用。

| 检查 | 本轮结果 |
| --- | --- |
| 标签核心测试 | `npm run test:labels`：49 项通过 |
| 类型与构建 | `npx tsc --noEmit`、`npx vite build --outDir /tmp/md-soft-studio/production` 通过 |
| 页面与控制台 | 标题正确、编辑器非空、无 Vite 错误遮罩、验证流程无浏览器运行时错误 |
| 响应式 | 深浅主题分别检查 1440×900、1280×720、1024×768、390×844、1280×560；编辑器无横向溢出，低高度画布至少 240px |
| 交互 | 五模板切换、J-Card 正反面、专辑／曲目输入、字号有效／无效输入、撤销重做、图层拖动显隐锁定、属性区键盘调高、内置字体切换通过 |
| 工程与输出 | 实际下载并重开工程、刷新恢复草稿、SVG 下载、整页 SVG ZIP 下载、设计及真实纸张预览通过 |
| 可访问性 | 菜单／设计预览／抽屉 Escape 与焦点返回、减少动画偏好通过；主按钮白字浅色 5.37:1、深色 5.69:1，输入边界至少 3.21:1，辅助文字在测试中性背景上至少 4.81:1 |
| 原生 PDF | 当前 `labels:renderPdf` IPC 实际调用成功；前后均 4 页 A4、199,895 字节，594.96×841.92 pt；4 页在 72dpi 栅格化后逐字节一致 |
| 源与导出隔离 | 8 个核心源文件 SHA-256 不变；10 份模板正反面 SVG、4 页 SVG 与排版 JSON 前后逐字节一致 |
| 静态设计检查 | 运行一次，8 项 advisory 均为字号／圆角文档覆盖不足；已补充 10／11／16px 字号及 14／16px 圆角记录，未报告其他类别问题 |

截图分集中检查与确认两轮。首轮抽屉截图捕捉到进场动画中间态，确认轮等待动画完成后重新截图，抽屉完整位于视口。参考图的柔和材质、大圆角、蓝色强调已经落实；桌面三栏、紧凑操作密度和中性画布是按已确认方案保留的差异。

### 证据与边界

- 截图、日志与 PDF 样张：`/Users/elliotge/.codex/visualizations/2026/09/30/01a0f007-43b3-78e1-a783-9b74a87cdcfe/md-studio`。主界面为 `final-light.png`、`final-dark.png`；响应式测量为 `qa.json`。
- 构建仍有既有 vm-browserify eval、分块体积和 Browserslist 数据过期提示；临时输出目录在项目外，因此 Vite 提示不会自动清空。没有借此升级依赖。
- 浏览器中的“导出 PDF”明确报告需要桌面应用，错误样式已验证；实际原生生成另经上述 Electron IPC 验证。未验证完整打包应用的文件保存对话框、Windows／Linux、本机字体授权流程或实体打印。未打包、签名或发布。


## 2026-09-30：圆润线稿与实心选中图标

本轮仅更新 MD 编辑器及关联界面的图标；保留此前布局、材质、业务与未提交工作。模板缩略图、素材、原生表单控件及实际作品未改动。

- `icons.tsx` 统一 24×24 网格、1.6 描边与圆润端点。28 个线稿图标、7 个独立实心工具图标及 MiniDisc 卡匣标志；默认 20px、内容工具 18px、密集操作 16px。MiniDisc 显示尺寸仍为 30／22／24px。
- 普通图标采用中性灰，选中工具图标为深灰／浅白实心，主按钮图标保持白色；`variant` 默认 outline，没有实心版本的图标请求 filled 时保持线稿。曲目上下排序改用 SVG 箭头，旋转光标采用相同描边并保留白色衬线。
- `npm run test:labels`：49 项通过；`npx tsc --noEmit`、`npx vite build --outDir /tmp/md-icon-refresh/production` 和 `git diff --check` 通过。构建仍有既有 eval、分块体积和 Browserslist 提示，没有升级依赖。Impeccable 静态检查一次，返回空报告。
- Browser plugin not available：使用已有 Playwright 与 Chrome 154，在 http://localhost:5173/ 的独立上下文验证。页面身份、工程加载、无框架遮罩、无运行时错误检查通过；1440×900 桌面与 390×844 窄屏分别验证深浅主题，无编辑器横向溢出。
- 七类内容工具逐一切换，验证仅当前图标为实心，其余六个为线稿。实际回归显隐图形切换、首曲目上移禁用、曲目下移排序、撤销重做、设计预览放大与关闭／焦点返回、模板菜单、两侧抽屉、打印入口及键盘焦点。检查主按钮图标仍为白色、装饰 SVG 不进入焦点顺序，原按钮名称保留。
- 从实际 React 组件生成 16／18／20px 线稿和常态／实心对照总览，集中检查双主题图标、工具栏、抽屉、设计预览及打印弹窗截图。形状清晰、选中留白正确，无需追加视觉修正。
- 8 个数据与渲染核心文件 SHA-256 未变化；10 份模板正反面 SVG、4 页排版 SVG 与排版 JSON 前后逐字节一致。实际浏览器导出 SVG 不包含界面图标。PDF 引擎未改动，本轮未重复原生 PDF 栅格化；上一节的 PDF 验证属于上一轮。
- 图标总览、双主题截图和日志位于 `/Users/elliotge/.codex/visualizations/2026/09/30/01a0f007-43b3-78e1-a783-9b74a87cdcfe/md-icons`。`gallery.html` 为可离线打开的静态总览，`icons-light.png`／`icons-dark.png` 为小尺寸与选中状态证据，`light-desktop.png`／`dark-desktop.png` 为实际界面。

未打包、签名或发布；未扩展至主应用其他图标，也未重新验证实体设备、打印机或其他操作系统。

## 2026-09-30：模板图标单色重设计

仅更新模板入口与菜单的五种界面缩略图，以及对应样式和设计规范；保留现有未提交改动。`TemplateThumbnail` 新增默认 false 的 `selected`，入口恒为实心，菜单仅当前项实心。颜色使用 muted／ink 与 currentColor；轮廓为固定屏幕 1.4px 圆润描边。五种图标保留默认模板的长宽比例与主要结构，全面标签的分片间隙及折页间隔仅在显示层作光学校正。入口 44×48px、菜单 56×48px 未变。

- `npm run test:labels`：49 项通过；`npx tsc --noEmit`、`npx vite build --outDir /tmp/md-template-icons/production`、`git diff --check` 通过。构建仅有既有 eval、分块体积与 Browserslist 提示。单次 Impeccable 静态检测返回空报告。
- Chromium 实际界面：浅／深主题 × 1440×900 桌面／390×844 抽屉全部通过。检查当前项唯一实心、其他四项线稿、选中勾选、Home／End／ArrowUp／Enter 选择、Escape 关闭菜单与抽屉、焦点返回触发按钮，无页面横向溢出。初次自动化在 MUI 关闭动画结束前检查菜单导致时序失败；调整等待后通过，未修改菜单交互逻辑。
- 从实际 React 组件生成 5 种模板 × 2 种状态 × 2 种尺寸 × 2 个主题，共 40 个样本。集中检查总览、桌面菜单及窄屏菜单截图：全面标签三片留白可辨，J-Card 与托盘卡书脊清晰，轮廓粗细一致；无需追加视觉修正。SVG 保持 aria-hidden 与 focusable=false，颜色随主题切换。浏览器未报告运行时错误。
- 使用同一整套包装示例工程，对比改动前后 10 份正反面 SVG、4 页排版 SVG 和排版 JSON，逐字节一致。实际浏览器导出 SVG 不包含 md-template-thumbnail。模型、存储、渲染和 PDF 输出路径未修改；本轮未重新运行原生 PDF 栅格化、实体打印或跨平台测试。
- 交付目录：`/Users/elliotge/.codex/visualizations/2026/09/30/01a0f007-43b3-78e1-a783-9b74a87cdcfe/md-template-icons`。`gallery.html` 可离线查看，`template-icons.png` 为双主题总览；`light-desktop-menu.png`／`dark-desktop-menu.png` 和 `light-mobile-menu.png`／`dark-mobile-menu.png` 为实际界面截图，附测试与构建日志。

本轮未重新打包 App；此前编译的 App 不包含本次模板图标修改。

### 单色模板图标版 App 重新打包

按用户后续要求运行 `npm run pack:labels`，重新构建 renderer、main、preload，更新 `build/md-labels/mac-arm64/ElectronWMD.app`（macOS Apple Silicon，0.5.2-1.5.5，Electron 43.3.0）。Ad-hoc 签名通过 `codesign --verify --deep --strict`；未进行 Apple 公证。以独立用户目录启动实际打包 App，编辑器正常渲染，模板图标确认 selected=true、stroke-width=1.4、fill=currentColor、viewBox=0 0 56 48；关闭退出码为 0，日志包含 shutdown-complete。构建与启动证据位于主项目 `build/md-labels/verification/`。

## 2026-09-30：曲目列表单行浏览与展开编辑

将每首曲目从三个常驻输入行改为单行摘要；默认全部折叠，同时最多展开一首。摘要显示拖动手柄、序号、完整标题提示、分秒时长／未知标记与展开图标。展开后编辑歌曲名、艺术家及秒数，操作按钮横排。展开状态按曲目 ID 跟随排序，不写入工程，打开工程或删除当前曲目时清除。保留数字草稿行为，并阻止曲目控件上的 Delete／Backspace 误触发画布图层删除。

- 18 首测试工程，1440×900 下改版前每首行盒约 201.5px，改版后折叠行 36px、间距 4px；截图中的相同可视区域从约 2 首提升到约 11 首。真实 coarse pointer 环境验证 44px 行高。主应用的继承盒模型最初造成额外 2px 行高，已通过仅限定曲目列表的 border-box 规则修正。
- 浏览器回归通过：默认折叠与 Tab 顺序、Enter 展开、单项展开、摘要与控制区域 ARIA 关联、切换时提交数字草稿（包括不自动转移焦点的程序化点击）、艺术家编辑、非法时长恢复、空值、零值、数字步进及 Escape 取消草稿；上下移动、首尾禁用、真实拖动排序、移动后展开跟随 ID、焦点回退、撤销重做、删除首／末／唯一一首的焦点返回；保存重开内容不丢失，同 ID 工程重开仍清除展开状态。
- 浅／深主题的桌面、390×844 抽屉以及 150% 缩放等效 960×600 CSS 视口检查通过。集中截图检查与确认完成；长标题省略、分秒对齐、展开字段和滚动正常，曲目行／展开区及页面没有横向溢出。原有列表外 select／textarea 因继承 content-box 仍使工具滚动区多出 2px 滚动宽度，此问题来自既有表单，未扩大本轮样式范围。未重测 Electron 原生缩放。
- 49 项现有标签测试、渲染器类型检查、最终生产构建、git diff --check 通过。布局静态检查一次，返回空报告。构建保留既有 eval、分块体积和 Browserslist 提示。浏览器没有运行时异常。
- 同一示例工程的 10 份模板正反面 SVG、4 页排版 SVG 与排版 JSON 前后逐字节一致；模板、存储与导出核心未修改。保存文件确认包含修改后的标题和时长，不包含展开状态。本轮未重复原生 PDF 栅格化、实体打印和跨平台测试。
- 证据与可重复执行的浏览器回归脚本位于 `/Users/elliotge/.codex/visualizations/2026/09/30/01a0f007-43b3-78e1-a783-9b74a87cdcfe/md-compact-tracks`；`comparison.html` 展示前后对比、双主题和窄屏截图，附测试／构建日志、QA JSON 及 18 首测试工程。

未重新打包 App、提交或推送 GitHub。上一次打包的 App 尚不包含本轮曲目列表调整。

### 紧凑曲目列表版 App 重新打包

按用户后续要求运行 `npm run pack:labels`，完整重建 renderer、main、preload，更新 `build/md-labels/mac-arm64/ElectronWMD.app`（Apple Silicon，0.5.2-1.5.5，Electron 43.3.0）。Ad-hoc 签名通过 `codesign --verify --deep --strict`，未进行 Apple 公证。实际打包 App 使用独立用户目录启动并加载 18 首测试工程：全部默认折叠，行高 36px，点击后恰有一首展开；单色模板图标也保持有效。App 正常关闭，退出码 0，日志包含 shutdown-complete。证据保存在主项目 `build/md-labels/verification/compact-tracks/`。本轮未推送 GitHub。
