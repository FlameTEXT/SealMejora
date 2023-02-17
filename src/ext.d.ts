declare let extension: Extension

declare interface ExtensionInfo {
  /** 插件的名称 */
  Name: string;
  /** 插件的作者 */
  Author: string;
  /** 插件的版本 */
  Version: string;
}

declare interface CommandInfo {
  /** 指令名称（如ra） */
  Name: string;
  /** 指令帮助，留空则为默认帮助 */
  Help?: string;
  /** true则在参数为help时返回帮助*/
  NeedHelp?: boolean;
  /** 允许代骰 */
  AllowDelegate?: boolean;
  /** 是否在私聊禁用 */
  DisabledInPrivate?: boolean;
}

declare interface MessageMatch {
  match: string | RegExp;
  action: Function;
}

declare interface Extension {
  ExtName: string;
  /** 注册一个新插件 */
  Register(info: ExtensionInfo): seal.ExtInfo;
  /** 添加一个指令 */
  AddCommand(commandInfo: CommandInfo, doWhat: (cmd: Command) => void): void;
  /** 处理非指令消息
   * @param handler 消息匹配及其动作
   * @param doContinue 匹配第一次后是否继续
   * @param onDefault 默认操作**（不推荐使用）** */
  HandleNotCommand(handler?: Array<MessageMatch>, doContinue?: boolean, onDefault?: Function): void;
  WhenReceives: Object;
  /** 返回一个`DataManager` */
  NewDataManager(): DataManager;
}

declare class DataManager {
  /** 获取数据库 */
  GetData(database: string, ifEmpty?: boolean): unknown;
  /** 写入数据库 */
  WriteData(database: string, data: any);
  /** 获取当前上下文（ctx） */
  GetContext(): seal.MsgContext;
  /** 获取当前msg */
  GetMessageInfo(): seal.Message;
  /** = `cmdArgs.getArgN()`*/
  GetArg(number): string;
  /** 获取当前cmdArgs */
  GetArgs(): seal.CmdArgs;
}

/** = `seal.replyToSender()` */
declare function Reply(text:string):void;
/** = `seal.replyPerson()` */
declare function ReplyPerson(text:string, toWhom?: string):void;
/** = `seal.replyGroup()` */
declare function ReplyGroup(text:string, toWhom?: string):void;
/** = `seal.format()` */
declare function Format(text:string): string;

// 以下未实现
//declare function GetConfig():string
//declare function SetTempVal():string
//declare function SetGroupVal():string

declare var command: Command;
declare interface Command {
  /** 指令名 */
  name: string
  /** 帮助信息 */
  help: string
  /** 允许代骰 */
  allowDelegate: boolean
  /** 私聊不可用 */
  disabledInPrivate: boolean
  /** 执行函数：有人发指令了，要干什么？\
   * 执行函数返回 `true` 将发送帮助信息。
   */
  solve(): boolean | void

  ctx: seal.MsgContext
  msg: seal.Message
  argv: seal.CmdArgs
  config:config
}

interface config {

}
