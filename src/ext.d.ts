declare let extension: Extension

declare interface ExtensionInfo {
  Name: string;
  Author: string;
  Version: string;
}

declare interface CommandInfo {
  Name: string;
  Help?: string;
  /** true则在参数为help时返回帮助*/
  NeedHelp?: boolean;
  AllowDelegate?: boolean;
  DisabledInPrivate?: boolean;
}

declare interface MessageMatch {
  match: string | RegExp;
  action: Function;
}

declare interface Extension {
  ExtName: string;
  Register(info: ExtensionInfo): seal.ExtInfo;
  AddCommand(commandInfo: CommandInfo, doWhat: (cmd: Command) => void): void;

  HandleNotCommand(handler?: Array<MessageMatch>, doContinue?: boolean, onDefault?: Function): void;
  /** 不熟悉海豹逻辑的人在使用`onNotCommandReceived`时容易刷屏，因为每条消息都会触发这个方法。
   * 因此选择包装成`WhenReceive`，要求指定触发消息，
   * 触发消息会被转化成正则表达式，并将匹配结果作为参数使用。 */
  WhenReceives: Object;
  NewDataManager(): DataManager;
}

declare class DataManager {
  GetData(database: string, ifEmpty?: boolean): unknown;
  WriteData(database: string, data: any);
  GetContext(): seal.MsgContext;
  GetMessageInfo(): seal.Message;
  GetArg(number): string;
  GetArgs(): seal.CmdArgs;
}

declare function Reply(text:string):void;
declare function ReplyPerson(text:string, toWhom?: string):void;
declare function ReplyGroup(text:string, toWhom?: string):void;

declare function GetConfig():string
declare function SetTempVal():string
declare function SetGroupVal():string

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
