// ========================================
// LeanCloud 配置 —— 请替换为你的应用信息
// ========================================
// 获取方式：
//   1. 打开 leancloud.cn → 登录 → 控制台
//   2. 创建应用 → 设置 → 应用 Keys
//   3. 复制 AppID、AppKey、服务器地址
// ========================================

window.LC_CONFIG = {
  appId: 'YOUR_APP_ID',
  appKey: 'YOUR_APP_KEY',
  serverURL: 'https://YOUR_API_SERVER.lc-cn-n1-shared.com'
};

// 初始化 LeanCloud SDK
AV.init({
  appId: window.LC_CONFIG.appId,
  appKey: window.LC_CONFIG.appKey,
  serverURL: window.LC_CONFIG.serverURL
});
