# 技术规范

## 架构

- **单文件 HTML**：`英语默写本.html`，所有 HTML / CSS / JS 在一个文件中
- **无外部依赖**：不引入任何第三方库或框架
- **浏览器原生 API**：
  - `localStorage` — 错题本持久化
  - `Web Audio API` — 键盘音效和正确音效合成
  - `Canvas API` — 庆祝彩带动画
  - `CSS Animations` — 过渡和动画效果

## 文件结构

```
单词默写/
├── 英语默写本.html          # 主程序（唯一需要修改的代码文件）
├── launch.pyw              # 启动脚本（webbrowser.open + HTML 路径）
├── icon.ico                # 桌面图标
├── icon_check.png          # 图标资源
├── icon_preview.png        # 图标资源
├── dev-logs/               # 开发日志
│   ├── _template.md        # 日志模板
│   └── YYYY-MM-DD.md       # 每日日志
└── specs/                  # 项目规范
    ├── requirements.md     # 需求文档
    ├── technical-specs.md  # 本文档
    ├── design-standards.md # 设计规范
    └── execution-steps.md  # 执行步骤
```

## 数据模型

### wordBanks 对象结构

```javascript
wordBanks = {
  bankId: {
    name: '词库显示名称',
    icon: 'emoji图标',
    subtitle: '副标题',
    doneMsg: '完成时显示的消息',
    items: [
      {
        cat: '分类标签',
        cn: '中文意思',
        en: '英文正确答案',
        hint: '提示文本（首字母+长度暗示）',
        tip: '记忆技巧/语法提示',
        alt: ['可接受的其他答案1', '可接受的其他答案2'],
        base: '动词原型'  // 仅 pastTense 词库使用
      }
    ]
  }
}
```

## 关键函数

| 函数 | 用途 |
|------|------|
| `switchBank(id)` | 切换词库，保存当前错题本，加载新错题本 |
| `renderItem()` | 渲染当前题目，根据 `currentBankId` 决定提示语 |
| `checkAnswer()` | 标准化后比对，支持 alt 多答案 |
| `normalize(s)` | 去除标点、多余空格、统一小写 |
| `toggleWrongMode()` | 进入/退出错题复习模式 |
| `loadWrongSet()` / `saveWrongSet()` | localStorage 错题本读写 |
| `playKeySound()` | Web Audio API 合成机械键盘音效 |
| `playCorrectSound()` | Web Audio API 合成上行音阶 |
| `startConfetti()` / `stopConfetti()` | Canvas 粒子彩带 |

## 新增词库步骤

1. 在 `<select id="bankSelect">` 中添加 `<option>` 项
2. 在 `wordBanks` 对象中添加新词库数据
3. 如果是特殊模式（类似 pastTense），在 `renderItem()` 中添加对应的条件分支
4. 更新 `specs/requirements.md` 中的词库清单
5. 在 `dev-logs/` 中记录变更

## 浏览器兼容性

- Chrome 80+
- Edge 80+
- Safari 14+（Web Audio 需用户交互后激活）
- 不支持 IE
