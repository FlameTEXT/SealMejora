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

declare interface Extension {
  ExtName: string;
  CmdInfo: Object;
  Register(info: ExtensionInfo): seal.ExtInfo;
  AddCommand(commandInfo: CommandInfo, doWhat: (cmd: Command) => void): void;

  HandleNotCommand(handler?: Object, doContinue?: boolean, onDefault?: Function): void;
  /** 不熟悉海豹逻辑的人在使用`onNotCommandReceived`时容易刷屏，因为每条消息都会触发这个方法。
   * 因此选择包装成`WhenReceive`，要求指定触发消息，
   * 触发消息会被转化成正则表达式，并将匹配结果作为参数使用。 */
  WhenReceives: Object;
  NewDataManager(): DataManager;
}

declare class DataManager {
  GetData(database: string, ifEmpty?: string);
  WriteData(database: string, data: any): void;
}
