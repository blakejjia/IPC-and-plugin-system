# VS Code 插件架构模拟

一个使用 TypeScript 和 Node.js 实现的 VS Code 插件系统模拟，展示了进程隔离、IPC 通信和 API 代理等核心概念。

## 🎯 项目目的

通过一个简化但完整的实现，帮助开发者理解：

- ✅ VS Code 的插件架构设计
- ✅ 进程隔离如何保护核心程序
- ✅ IPC（进程间通信）的工作原理
- ✅ 如何设计一个可扩展的插件系统

## 📁 项目结构

```
.
├── package.json                # 插件清单（声明式）
├── tsconfig.json               # TypeScript 配置
├── src/                        # TypeScript 源代码
│   ├── types.ts                # 类型定义
│   ├── core_app.ts             # 主进程（模拟 VS Code 核心）
│   └── extension_host.ts       # 扩展主机（子进程）
├── plugins/                    # 插件目录
│   └── my_plugin.js            # JavaScript 插件示例
└── dist/                       # 编译输出（自动生成）
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 编译并运行

```bash
npm start
```

### 3. 仅编译

```bash
npm run build
```

### 4. 监视模式（开发时使用）

```bash
npm run watch
```

## 📖 运行效果

```
[CORE]: 核心应用启动...
[CORE]: 正在启动扩展主机...
[HOST]: 扩展主机子进程已启动。
[CORE]: 发送 'LOAD_PLUGIN' 请求...
[HOST]: 收到加载插件的请求...
[PLUGIN]: 'my_plugin' 正在激活...
[PLUGIN]: 'helloworld.helloWorld' 命令已注册。
[CORE]: 收到确认, 命令 'helloworld.helloWorld' 已就绪。
[CORE]: 模拟用户执行 'helloworld.helloWorld'...
[HOST]: 收到执行命令 'helloworld.helloWorld' 的请求...
[PLUGIN]: 正在执行命令, 返回: 'Hello from my_plugin! (JavaScript Plugin)'
[CORE]: 收到命令结果: "Hello from my_plugin! (JavaScript Plugin)"
[CORE]: 模拟完成，关闭扩展主机。
[CORE]: 扩展主机已关闭。
```

## 🔍 深入理解

### 核心概念

1. **进程隔离**：核心应用和扩展主机运行在不同的 Node.js 进程中
2. **IPC 通信**：进程间通过消息传递进行通信
3. **API 代理**：插件通过代理 API 与核心交互
4. **命令模式**：命令的注册和执行分离

### 工作流程

```
主进程 (core_app.ts)
    │
    ├─> 启动子进程 (extension_host.ts)
    │
    ├─> 发送 LOAD_PLUGIN 消息
    │       │
    │       └─> 子进程加载插件 (plugins/my_plugin.js)
    │               │
    │               └─> 插件调用 api.commands.registerCommand()
    │                       │
    │                       └─> 子进程存储命令，发送 COMMAND_REGISTERED 消息
    │
    ├─> 收到命令注册确认
    │
    ├─> 发送 EXECUTE_COMMAND 消息
    │       │
    │       └─> 子进程执行命令，发送 COMMAND_RESULT 消息
    │
    └─> 收到执行结果，关闭子进程
```

## 📚 详细文档

**强烈推荐阅读：** [PLUGIN_ARCHITECTURE.md](./PLUGIN_ARCHITECTURE.md)

这份详细文档包含：

- 📖 从零开始的概念讲解
- 🔍 逐行代码分析
- 📊 流程图和时间线
- 💡 设计模式解析
- 🎯 实践练习

## 🛠️ 技术栈

- **TypeScript** - 类型安全的核心系统
- **Node.js** - 运行时环境
- **child_process** - 进程管理
- **IPC** - 进程间通信

## 🎓 适合人群

- 想要理解 VS Code 插件机制的开发者
- 学习进程间通信的学生
- 设计插件系统的架构师
- 对软件架构感兴趣的工程师

## 💡 扩展练习

1. 添加更多命令类型
2. 实现插件懒加载机制
3. 添加错误处理和恢复
4. 支持多个插件同时运行
5. 实现插件之间的消息传递

## 🤝 贡献

欢迎提出改进建议和问题！

## 📄 许可证

MIT

---

**提示：** 先运行一次 `npm start` 看看效果，然后阅读 [PLUGIN_ARCHITECTURE.md](./PLUGIN_ARCHITECTURE.md) 深入理解原理！
