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
  Register(info: ExtensionInfo): void;
  AddCommand(commandInfo: CommandInfo, doWhat: (cmd: Command) => void): void;
}
