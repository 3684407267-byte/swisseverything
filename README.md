# 🇨🇭 SWIeverything

> 一款全面的瑞士综合 App — 探索阿尔卑斯国度的方方面面

## 功能

- 🏛️ **26 个州** — 完整介绍瑞士所有州，含人口、面积、首府、语言、历史
- 🎭 **瑞士文化** — 四种语言、美食、传统节日、直接民主、钟表工艺、历史
- ⛰️ **旅行目的地** — 15+ 热门景点，含最佳旅游季节和推荐活动
- 🚂 **公共交通** — 集成 Swiss transport API，实时查询火车和公交
- 🤖 **AI 瑞士专家** — 用户自配 API Key（默认 DeepSeek），对话式瑞士问答
- 🔄 **版本更新** — 自动检查 GitHub Release，弹窗提示新版本

## 技术栈

- **框架**: React Native + Expo (managed workflow)
- **导航**: Expo Router (file-based routing)
- **语言**: TypeScript
- **设计**: 瑞士现代主义风格（红白黑配色，网格系统，极简排版）
- **AI**: OpenAI 兼容接口（DeepSeek / OpenAI / 其他）

## 快速开始

### 1. 安装依赖

```bash
cd swisseverything
npm install --legacy-peer-deps
```

### 2. 启动开发服务器

```bash
npx expo start
```

### 3. 在手机上预览

1. 在 Android 手机上安装 **Expo Go**
2. 扫描终端中的二维码
3. 即时预览，修改代码会自动热更新

### 4. Web 预览

```bash
npx expo start --web
```

## 配置 AI

首次打开 App，进入 **AI 问答** Tab，点击右上角齿轮图标配置：

- **API Key**: 你的 API Key（如 DeepSeek: `sk-...`）
- **Base URL**: API 地址（默认 `https://api.deepseek.com`）
- **Model**: 模型名称（默认 `deepseek-chat`）

配置保存在设备本地安全存储中，不会上传到任何服务器。

## 更新机制

App 启动时自动检查 GitHub Release 最新版本。若有新版本，显示更新弹窗，引导下载最新 APK。

## 项目结构

```
src/
├── app/                  # Expo Router 路由
│   ├── (tabs)/           # Tab 导航页面
│   ├── canton/[id].tsx   # 州详情页
│   ├── destination/[id].tsx  # 目的地详情页
│   └── culture/[id].tsx  # 文化专题详情页
├── components/           # 可复用组件
├── data/                 # 瑞士内容数据
├── hooks/                # 自定义 Hooks
├── services/             # API 服务
├── utils/                # 工具函数
└── constants/            # 主题和配置
```

## 许可证

MIT

---

Made with ❤️ for Switzerland 🇨🇭

🤖 Generated with [Claude Code](https://claude.com/claude-code)
