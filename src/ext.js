// ==UserScript==
// @name         SealMejora
// @author       NAO，檀轶步棋
// @version      0.0.1-preview
// @description  一个帮你更快编写海豹插件的项目。
// @timestamp    1676158106
// @license      MIT
// @homepageURL  https://github.com/sealdice
// ==/UserScript==

globalThis.extension = {};
globalThis.command = {};
cmdInfos = {};
whenReceives = {};
command.name = "test";
command.help = "一个借助SealMejora开发的插件。";
command.allowDelegate = false;
command.disabledInPrivate = false;
command.solve = () => { return true };

let curCtx = undefined, curMsg = undefined, curArgs = undefined;

class DataManager {
  GetData(database, ifEmpty) {}
  WriteData(database, data) {}
  GetContext() {}
  GetMessageInfo() {}
  GetArg(number) {}
  GetArgs() {}
}

globalThis.Reply = (message) => {
  seal.replyToSender(curCtx, curMsg, message);
}

globalThis.ReplyPerson = (message, toWhom) => {
  toWhom = toWhom.toString();
  let mmsg = curMsg;
  if (toWhom) {
    mmsg.sender.userId = toWhom;
  }
  seal.replyPerson(curCtx, mmsg, message);
}

globalThis.ReplyGroup = (message, toWhom) => {
  toWhom = toWhom.toString();
  let mmsg = curMsg;
  if (toWhom) {
    mmsg.group.groupId = toWhom;
  }
  seal.replyPerson(curCtx, mmsg, message);
}

globalThis.Format = (data) => {
  return seal.format(curCtx, data);
}

extension.Register = (info) => {
  extension.ExtName = info.Name;
  let extRaw = seal.ext.find(info.Name);
  if (!extRaw) {
    extRaw = seal.ext.new(info.Name, info.Author, info.Version);
    seal.ext.register(extRaw);
  }
  return extRaw;
};

extension.AddCommand = (cmdInfo, doWhat) => {
  cmdInfos[cmdInfo.Name] = Object.create(command);
  let cmd = cmdInfos[cmdInfo.Name];
  cmd.name = cmdInfo.Name;
  cmd.help = cmdInfo.Help;
  cmd.allowDelegate = cmdInfo.AllowDelegate || false;
  cmd.disabledInPrivate = cmdInfo.DisabledInPrivate || false;
  cmd.solve = doWhat;
  let cmdRaw = seal.ext.newCmdItemInfo();
  cmdRaw.name = cmd.name;
  command.help = extension.ExtName + "：一个借助SealMejora开发的插件。";
  cmdRaw.help = cmd.help || command.help;
  cmdRaw.allowDelegate = cmd.allowDelegate || false;
  cmdRaw.disabledInPrivate = cmd.disabledInPrivate || false;
  cmdRaw.solve = (ctx, msg, cmdArgs) => {
    cmd.ctx = ctx; cmd.msg = msg; cmd.argv = cmdArgs;
    curCtx = ctx; curMsg = msg; curArgs = cmdArgs;

    if (cmdInfo.NeedHelp && cmd.argv.getArgN(1) === "help") {
      let ret = seal.ext.newCmdExecuteResult(true);
      ret.showHelp = true;
      return ret;
    }

    let rev = cmd.solve(cmd);

    let key = ['name', 'help', 'solve', 'allowDelegate', 'disabledInPrivate']
    for (let [k] of Object.entries(cmd)) {
      if (!key.find(x => k === x)) cmd[k] = null
    }

    return seal.ext.newCmdExecuteResult(rev || true);
  };
  let extRaw = seal.ext.find(extension.ExtName);
  extRaw.cmdMap[cmdRaw.name] = cmdRaw;
  curCtx = undefined; curMsg = undefined; curArgs = undefined;
};

extension.HandleNotCommand = (WhenReceive = [], doContinue = false, onDefault = () => {}) => {
  if (WhenReceive.length === 0) {
    return;
  } else {
    whenReceives[extension.ExtName] = WhenReceive;
  }
  let actions = whenReceives[extension.ExtName];
  for (let [k, act] of Object.entries(whenReceives[extension.ExtName])) {
    actions[k] = act;
  }
  let extRaw = seal.ext.find(extension.ExtName);
  extRaw.onNotCommandReceived = (ctx, msgRaw) => {
    curCtx = ctx; curMsg = msgRaw;
    onDefault !== null ? onDefault() : 0;
    for (let [k, v] of Object.entries(actions)) {
      if (typeof v["match"] === "object") {
        let match = msgRaw.message.match(v["match"]);
        if (match !== null) {
          v["action"](match);
          if (!doContinue) break;
        }
      } else if (typeof v["match"] === "string") {
        v["match"] === msgRaw.message ? v["action"](msgRaw.message) : 0;
      }
    }
  }
  curCtx = undefined; curMsg = undefined;
}

extension.NewDataManager = () => {
  let manager = new DataManager();
  let extRaw = seal.ext.find(extension.ExtName);
  manager.GetData = (database, ifEmpty = "{}") => JSON.parse(extRaw.storageGet(database) || ifEmpty);
  manager.WriteData = (database, data) => extRaw.storageSet(database, JSON.stringify(data));
  manager.GetContext = () => curCtx;
  manager.GetMessageInfo = () => curMsg;
  manager.GetArgs = () => curArgs;
  manager.GetArg = (n) => {
    if (!(isNaN(Number(n)) || curArgs === undefined)) {
      return curArgs.getArgN(n);
    }
  }
  return manager;
}
