// src/core_app.ts
import { fork, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import {
  IPCMessage,
  PluginManifest,
  LoadPluginMessage,
  ExecuteCommandMessage,
} from "./types";

console.log("[CORE]: 核心应用启动...");

// 1. 启动扩展主机子进程
// 'fork' 会自动建立一个 IPC 通道
const extensionHost: ChildProcess = fork(
  path.join(__dirname, "extension_host.js")
);

console.log("[CORE]: 正在启动扩展主机...");

// 2. 读取插件清单
const manifestPath = path.join(__dirname, "..", "package.json");
const manifest: PluginManifest = JSON.parse(
  fs.readFileSync(manifestPath, "utf8")
);

// 3. 模拟激活事件：我们立即加载插件
// (一个真实的实现会等待 'onCommand' 事件)
console.log("[CORE]: 发送 'LOAD_PLUGIN' 请求...");
const loadMessage: LoadPluginMessage = {
  type: "LOAD_PLUGIN",
  mainFile: manifest.main,
};
extensionHost.send(loadMessage);

// 4. 监听来自扩展主机的消息
extensionHost.on("message", (message: IPCMessage) => {
  if (message.type === "COMMAND_REGISTERED") {
    // 5. 插件报告命令已注册！
    console.log(`[CORE]: 收到确认, 命令 '${message.commandId}' 已就绪。`);

    // 6. 模拟用户触发该命令
    console.log(`[CORE]: 模拟用户执行 '${message.commandId}'...`);
    const executeMessage: ExecuteCommandMessage = {
      type: "EXECUTE_COMMAND",
      commandId: message.commandId,
    };
    extensionHost.send(executeMessage);
  } else if (message.type === "COMMAND_RESULT") {
    // 7. 收到命令的执行结果！
    console.log(`[CORE]: 收到命令结果: "${message.result}"`);

    // 8. 任务完成，关闭子进程
    console.log("[CORE]: 模拟完成，关闭扩展主机。");
    extensionHost.kill();
  }
});

extensionHost.on("exit", (code: number | null) => {
  console.log("[CORE]: 扩展主机已关闭。");
});
