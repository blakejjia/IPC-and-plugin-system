// plugins/my_plugin.js
// 这是一个普通的 JavaScript 插件，在 TypeScript 核心系统之外

/**
 * 插件的激活函数
 * @param {object} api - 模拟的 VS Code API 对象
 */
function activate(api) {
  console.log("[PLUGIN]: 'my_plugin' 正在激活...");

  // 插件使用 API 注册一个命令
  api.commands.registerCommand("helloworld.helloWorld", () => {
    // 这是命令的真正实现
    const message = "Hello from my_plugin! (JavaScript Plugin)";
    console.log(`[PLUGIN]: 正在执行命令, 返回: '${message}'`);
    return message;
  });

  console.log("[PLUGIN]: 'helloworld.helloWorld' 命令已注册。");
}

// 导出激活函数
module.exports = { activate };
