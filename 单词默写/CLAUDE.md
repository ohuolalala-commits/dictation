# 英语默写本 — 项目指引

## 项目路径

```
C:\西安备课\单词默写\
```

## 项目概述

英语默写训练系统，面向中小学生。支持 8 个词库、错题复习、键盘音效、庆祝动画、多用户登录和教师数据监控。

## 启动方式

```
# 学生默写界面
双击 C:\西安备课\单词默写\launch.pyw
或浏览器打开 index.html

# 教师工作台
双击 C:\西安备课\单词默写\launch_teacher.bat
或浏览器打开 teacher.html
```

## 首次配置

1. 在 [leancloud.cn](https://leancloud.cn) 注册账号
2. 创建应用 → 设置 → 应用 Keys
3. 将 AppID、AppKey、serverURL 填入 `js/leancloud-config.js`
4. 打开 `index.html`，点击「老师首次使用？点此注册」
5. 注册老师账号后，进入教师工作台添加学生

## 文件结构

```
C:\西安备课\单词默写\
├── index.html                  ← 学生默写界面（登录 + 练习）
├── teacher.html                ← 教师仪表盘（5个功能Tab）
├── launch.pyw                  ← 启动脚本（默认启动学生界面）
├── launch_teacher.bat          ← 教师工作台快捷启动
├── css/
│   └── theme.css               ← 共享暗金埃及风样式
├── js/
│   ├── leancloud-config.js     ← LeanCloud AppID/AppKey 配置
│   ├── auth.js                 ← 登录/登出/注册/会话管理
│   ├── wordbanks.js            ← 全词库数据（8个词库）
│   ├── dictation-core.js       ← 核心默写逻辑
│   ├── sync.js                 ← 云端数据同步引擎
│   └── teacher-dashboard.js    ← 教师仪表盘逻辑
├── index_backup_20260621.html  ← 原始单文件备份
├── specs/                      ← 项目规范文档
├── dev-logs/                   ← 开发日志
└── (资源文件：icon.ico, mp3, docx等)
```

## 词库清单

| bankId | 名称 | 模式 | 词条数 |
|--------|------|------|--------|
| `preposition` | 介词短语 | 中文→英文 | 48 |
| `bnu` | 北师大版 | 中文→英文 | 17 |
| `pep` | 人教版 | 中文→英文 | 17 |
| `pe` | PEP版·六年级下册 | 中文→英文 | 53 |
| `fltrp` | 外研社版 | 中文→英文 | 16 |
| `pastTense` | 小学过去时·不规则动词 | 原型→过去式 | 54 |
| `zk` | 中考高频词 | 中文→英文 | 588 |
| `zk688` | 基础版688 | 中文→英文（含板块） | 688 |

## 多用户功能

- 老师创建学生账号，学生独立登录
- 学生数据云端同步（LeanCloud），跨设备保持进度
- 教师仪表盘：学生概览、词条明细、答题时间线、学生管理
- 本地优先 + 后台异步同步，离线可用

## 工作说明

1. **CSS 修改** — 编辑 `css/theme.css`，两个页面共享
2. **词库修改** — 编辑 `js/wordbanks.js`
3. **默写逻辑** — 编辑 `js/dictation-core.js`
4. **登录相关** — 编辑 `js/auth.js`
5. **云端同步** — 编辑 `js/sync.js`
6. **教师仪表盘** — 编辑 `teacher.html` 和 `js/teacher-dashboard.js`
7. **新增词库** — 参考 `specs/execution-steps.md`
8. **UI 改动** — 参考 `specs/design-standards.md`，保持暗金埃及风
9. **修改后测试** — 浏览器刷新验证
10. **完成后记日志** — 在 `dev-logs/` 中写入变更

## LeanCloud 数据结构

| Class | 用途 | 关键字段 |
|-------|------|---------|
| `_User` | 用户 | role(teacher/student), displayName |
| `AnswerRecord` | 答题记录 | user, bankId, itemIndex, userAnswer, isCorrect |
| `StudyProgress` | 学习进度 | user, bankId, completedSet, wrongSet, lastIndex |
| `PerItemStatus` | 词条状态 | user, bankId, itemIndex, status, wrongCount |
