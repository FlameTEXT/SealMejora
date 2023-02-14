# SealMejora 帮助文档

SealMejora 是一个旨在简化[海豹 JS 插件](https://github.com/sealdice/javascript)编写过程的 JavaScript 项目。它提供了常见指令的封装，从而用更少（且更加简明的代码）来达到目的。刚刚接触 JavaScript 和海豹核心的用户也可能通过 SealMejora 编写简单的海豹插件。

SealMejora 支持 1.1.0 及更新的海豹核心。

## 如何开始
<!-- 不确定最后会怎样打包，先不写了。 -->

## 编写 SealMejora 插件

我们先来看一个简单的 SealMejora 脚本：

```javascript
extension.Register({
  Name: "hello-sayer",
  Author: "Michael Jackson",
  Version: "0.0.1"
});

let cmdInfo = {
  Name: "greet",
  Help: "Just greet someone!",
  NeedHelp: true
};

extension.AddCommand(cmdInfo, cmd => {
  cmd.reply("hello!");
});
```

装载脚本后，运行可以得到如下结果：

![example.png](helpdoc_images%2Fexample.png)

### 注册插件

在海豹核心中，每个 JS 插件都需要先经过注册才能使用。注册时，需要提供插件的内部识别名（用`.ext`指令进行插件操作时的名称）、作者和版本信息。在原生代码中，注册步骤看起来像这样：

```javascript
let ext = seal.ext.find("hello-sayer");
if (!ext) {
  ext = seal.ext.new("hello-sayer", "Michael Jackson", "0.0.1");
  seal.ext.register(ext);
}
```

大致过程是，先寻找有没有叫做 hello-sayer 的插件，如果没有，提供以上三个信息，然后注册。

SealMejora 提供了一个全局变量 `extension`。`extension.Register()`方法对以上过程进行了包装，当执行完毕后，`extension`就包含了当前插件的全部方法和信息。

`extension.Register()`接受一个`Object`作为变量，要求提供`Name`、`Author`和`Version`三个字段，分别对应内部识别名、作者和版本。在上面的示例中，我们注册了一个名字为 hello-sayer、作者为 Michael Jackson，版本为 0.0.1 的插件。

> 如果有编写更复杂代码的需求，`extension.Register()`实际上返回了注册完毕的`ExtInfo`，可用此进行原生代码的编写。

### 添加指令

一个自定义的指令通常是插件的核心。在原生代码中，向插件中注册一个指令通常需要这样：

```javascript
const cmd = seal.ext.newCmdItemInfo();
cmd.name = "greet";
cmd.help = "Just greet someone!";
cmd.solve = (ctx, msg, cmdArgs) => {
  // 一些代码...
  return seal.ext.newCmdExecuteResult(true);
};
// ext是seal.ext.find()或seal.ext.register()返回的ExtInfo
ext.cmdMap["greet"] = cmd;
```

使用 SealMejora，这个过程可以更简单。`extension.AddCommand()`能够快速地向刚刚注册的插件中添加一个指令。

`extension.AddCommand()`需要两个变量。第一个变量是一个`Object`，要求必须提供`Name`值作为指令名称。此外，还有以下可选值：

- `Help` 指令的帮助信息。字符串类型。如果不提供，则使用 SealMejora 的预置帮助。
- `NeedHelp` 当指令的第一个参数为 help 时，是否发送帮助。布尔值类型，默认为`false`。
- `AllowDelegate` 是否允许代骰，布尔值类型，默认为`false`。
- `DisabledInPrivate` 是否在私聊中禁用指令，布尔值类型，默认为`false`。

第二个变量是函数，用来指明该指令做些什么。通常用匿名函数写法。在上面的示例中，我们创造了一个名为 greet 的指令，帮助内容是“Just greet someone!”，并在指令的第一个参数为 help 时发送帮助。指令这个指令会得到回复“hello!”。

### 回复

<!-- 等reply重写完再写。 -->

## 更多功能

### 处理非指令

海豹 JS 提供了`ExtInfo.onNotCommandReceived()`方法来处理非指令信息。在骰子收到信息但不是指令时，会执行这个方法。在一般的代码中，我们通常这样写：

```javascript
// ext是seal.ext.find()或seal.ext.register()返回的ExtInfo
ext.onNotCommandReceived = (ctx, msg) => {
  // 一些代码...
};
```

SealMejora 中，处理非指令消息的方式有些不同：

```javascript
let notCommandHandler = {
  "hello": () => {
    // 一些代码...
  },
  "I like (.*)": (match) => {
    console.log(`I like ${match[1]} too!`);
  }
}

extension.HandleNotCommand(notCommandHandler, false, null);
```

我们使用`extension.HandleNotCommand()`来处理非指令消息，但这个方法的第一个参数是`Object`，其中键为触发操作的文本，值为对应的操作。文本可以是正则表达式，在解析时会用其匹配值作为参数。这样设计的目的是防止意外的频繁操作和刷屏（例如，无论受到什么消息骰子都回复“你好”，同时写入一大堆数据，这对于每天收到几千条消息的公骰通常是灾难），并节省写`switch-case`的时间。

第二个参数是一个布尔值，它的默认值是`false`。程序将收到的消息与`notCommandHandler`中的键从上到下依次比对，如果第二个参数为`true`，那么在第一次比对成功后，程序将会继续比对剩下的值。反之，将停止。

第三个参数是可选的。它是一个`Function`，为那些有真正需要的人所保留。它相当于`ExtInfo.onNotCommandReceived()`当骰子每一次收到消息时，如果这个参数存在，则执行它。我们建议你只在真正有必要的时候才规定它的值。

### 读取数据

在原生代码中，`ExtInfo.storageGet()`和`ExtInfo.storageSet()`方法被用来读写插件专属的数据库，而`MsgContext`和`Message`则在各种方法中作为参数返回。SealMejora 将这些数据的读取全部交由`DataManager`完成。

使用`extension.NewDataManager()`来获取一个新`DataManager`实例。

```javascript
let manager = extension.NewDataManager();
```

#### `DataManager.GetData()`

