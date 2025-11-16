// src/types.ts

/**
 * IPC 消息类型定义
 */
export type IPCMessage =
  | LoadPluginMessage
  | CommandRegisteredMessage
  | ExecuteCommandMessage
  | CommandResultMessage;

export interface LoadPluginMessage {
  type: "LOAD_PLUGIN";
  mainFile: string;
}

export interface CommandRegisteredMessage {
  type: "COMMAND_REGISTERED";
  commandId: string;
}

export interface ExecuteCommandMessage {
  type: "EXECUTE_COMMAND";
  commandId: string;
}

export interface CommandResultMessage {
  type: "COMMAND_RESULT";
  commandId: string;
  result: any;
}

/**
 * 模拟的 VS Code API 接口
 */
export interface VSCodeAPI {
  commands: {
    registerCommand(commandId: string, handler: () => any): void;
  };
}

/**
 * 插件接口
 */
export interface Plugin {
  activate(api: VSCodeAPI): void;
}

/**
 * 插件清单接口
 */
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  main: string;
  activationEvents: string[];
}
