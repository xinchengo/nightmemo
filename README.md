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

## 拼音与 TTS 兼容性说明

不同平台系统中 TTS 引擎的兼容性差异（输入格式上），可能会导致部分拼音无法正常朗读。我因为这个问题创建了 `playground/tts/index.html` 来测试不同平台上的 TTS 效果。如果要运行的话，需要先运行一个本地服务器，例如使用 `python -m http.server 8000` 来启动一个简单的 HTTP 服务器，然后在浏览器中访问 `http://localhost:8000/playground/tts/`。

下面是经过测试的一些平台上 TTS 的细节：

### MacOS

苹果系统中间，Safari 并不会暴露所有语音，只会根据用户的系统设置，选出一些“效果最好”的一个子集，呈现给 Web 端。比如，调用 `SpeechSynthesis.getVoices()` 时，返回的可能是下面一个子集：

<details>
<summary>点击查看完整列表</summary>

| 序号 | 语音名称 | 语种 | 语音 ID |
| --- | --- | --- | --- |
| 0 | Eddy | zh-CN | com.apple.eloquence.zh-CN.Eddy 
| 1 | Shelley | zh-CN | com.apple.eloquence.zh-CN.Shelley 
| 2 | Grandma | zh-CN | com.apple.eloquence.zh-CN.Grandma 
| 3 | Reed | zh-CN | com.apple.eloquence.zh-CN.Reed 
| 4 | Grandpa | zh-CN | com.apple.eloquence.zh-CN.Grandpa 
| 5 | Rocko | zh-CN | com.apple.eloquence.zh-CN.Rocko 
| 6 | Flo | zh-CN | com.apple.eloquence.zh-CN.Flo 
| 7 | Tingting | zh-CN | com.apple.voice.compact.zh-CN.Tingting 
| 8 | Sandy | zh-CN | com.apple.eloquence.zh-CN.Sandy 
| 9 | Tingting | zh-CN | com.apple.voice.compact.zh-CN.Tingting 

</details>

Apple（MacOS 13+）的语音大致分为两种：

- Eloquence 系：这些语音的 ID 以 `com.apple.eloquence` 开头，是一套独立的语音集，可能和 NVDA 的 [Eloquence](https://blindhelp.net/software/eloquence) 有一定的关系；
- Siri 系：这些语音的 ID 以 `com.apple.voice.<compact/enhanced/premium>` 开头，苹果的 Siri 使用的也是该语音集；

这两种对于中文拼音输入的支持是不一样的（体现在调用 `synth.speak()` 时的格式）：

- Eloquence 系：「ü」用「uu」表示（本来就可以省略为「u」的仍为「u」），轻声用数字 0 表示；例「吃了绿色圆圈被辣到了」`chi1le0luu4se4yuan2quan1bei4la4dao4le0`；
- Siri 系：「ü」用「u」表示，轻声用数字 5 表示；例「吃了绿色圆圈被辣到了」`chi1le5lv4se4yuan2quan1bei4la4dao4le5`；

## 📄 License

MIT
