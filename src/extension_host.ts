// src/extension_host.ts
import * as path from "path";
import {
  IPCMessage,
  VSCodeAPI,
  Plugin,
  CommandRegisteredMessage,
  CommandResultMessage,
} from "./types";

// 这个 Map 将存储已注册命令的 *实现*
const commandRegistry = new Map<string, () => any>();

// 1. 创建模拟的 'vscode' API 对象
// 这是传递给插件的代理对象
const api: VSCodeAPI = {
  commands: {
    registerCommand: (commandId: string, handler: () => any): void => {
      // 插件调用此函数时，我们将命令的实现存储在本地
      commandRegistry.set(commandId, handler);

      // 并通过 IPC *通知* 主进程，该命令已注册
      const message: CommandRegisteredMessage = {
        type: "COMMAND_REGISTERED",
        commandId: commandId,
      };
      process.send!(message);
    },
  },
};

// 2. 监听来自主进程 'core_app' 的消息
process.on("message", (message: IPCMessage) => {
  if (message.type === "LOAD_PLUGIN") {
    // 主进程要求我们加载插件
    console.log("[HOST]: 收到加载插件的请求...");
    try {
      // 动态加载插件代码 - 插件在项目根目录，而不是 dist 目录
      const pluginPath = path.resolve(__dirname, "..", message.mainFile);
      const plugin: Plugin = require(pluginPath);

      // 3. 调用插件的 activate 函数，传入模拟的 API
      plugin.activate(api);
    } catch (err) {
      console.error("[HOST]: 加载插件失败:", err);
    }
  } else if (message.type === "EXECUTE_COMMAND") {
    // 4. 主进程要求我们执行一个已注册的命令
    console.log(`[HOST]: 收到执行命令 '${message.commandId}' 的请求...`);
    const handler = commandRegistry.get(message.commandId);

    if (handler) {
      // 执行存储的命令实现
      const result = handler();

      // 5. 将执行结果通过 IPC 发送回主进程
      const resultMessage: CommandResultMessage = {
        type: "COMMAND_RESULT",
        commandId: message.commandId,
        result: result,
      };
      process.send!(resultMessage);
    }
  }
});

console.log("[HOST]: 扩展主机子进程已启动。");
