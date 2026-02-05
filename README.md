# Night Memo 🌑

一个专为黑暗环境设计的单文档、听觉反馈优先的中文编辑应用。

Night Memo 旨在让人们能够在完全黑暗的环境中（或闭眼状态下）拥有流畅的中文编辑体验。它摒弃了复杂的视觉界面，转而依赖丰富的听觉反馈和极简的操作逻辑。

## ✨ 核心特性

*   **听觉优先 (Audio-First)**: 所有的输入、确认、删除操作都有独特的音效反馈。
*   **盲打友好**:
    *   **a-z**: 输入拼音或英文缓冲。
    *   **0-4**: 确认拼音（0=轻声, 1=一声, 2=二声, 3=三声, 4=四声）。
    *   **5-9**: 确认英文单词。
*   **实时朗读 (TTS)**: 确认输入后，系统会自动朗读刚刚输入的中文或英文。
    *   *注：拼音朗读已优化，支持 v -> ü 的自动转换，并能准确朗读声调。*
*   **极致暗黑模式**: 纯黑背景 (#000000) 配微光文字，最低限度的屏幕光污染。
*   **数据持久化**: 内容自动保存到本地，刷新不丢失。
*   **辅助阅读**:
    *   `Alt + R`: 朗读全文
    *   `Alt + L`: 朗读上一个词
    *   `Alt + S`: 朗读当前缓冲区
*   **设置与帮助**:
    *   `Alt + H` 或 `?`: 显示/隐藏帮助
    *   `ESC`: 打开设置菜单（切换拼音显示模式、清空文档）

## 🚀 快速开始

### 本地运行

1.  克隆项目
    ```bash
    git clone https://github.com/xinchengo/nightmemo.git
    cd nightmemo
    ```

2.  安装依赖
    ```bash
    npm install
    ```

3.  启动开发服务器
    ```bash
    npm run dev
    ```

### 在线体验

访问: [https://xinchengo.github.io/nightmemo/](https://xinchengo.github.io/nightmemo/)

## 🛠️ 技术栈

*   React + TypeScript
*   Vite
*   TailwindCSS
*   Web Audio API (Oscillator Sound Effects)
*   Web Speech API (Text-to-Speech)

## 📝 操作指南

1.  **启动**: 点击屏幕任意位置以激活音频引擎。
2.  **输入拼音**:
    *   输入 `hao` -> 按 `3` -> 屏幕显示 `hǎo` -> 听到 "hǎo"。
    *   输入 `nv` -> 按 `3` -> 屏幕显示 `nǚ` -> 听到 "nǚ"。
3.  **输入英文**:
    *   输入 `hello` -> 按 `5` -> 屏幕显示 `hello ` -> 听到 "hello"。
4.  **修改**:
    *   `Backspace`: 缓冲区有内容时删字符；缓冲区为空时删上一个词。

## 📄 License

MIT
