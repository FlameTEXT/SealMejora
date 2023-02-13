globalThis.extension = {};
extension.CmdInfo = {};
extension.WhenReceive = {};

extension.Register = (info) => {
  extension.ExtName = info.Name;
  let extRaw = seal.ext.find(info.Name);
  if (!extRaw) {
    extRaw = seal.ext.new(info.Name, info.Author, info.Version);
    seal.ext.register(extRaw);
  }
  extRaw.onNotCommandReceived = (ctx, msgRaw) => {
    for (let [k, act] of Object.entries(extension.WhenReceive)) {
      let reg = new RegExp(k);
      let match = msgRaw.message.match(reg);
      if (match !== null) {
        act(match);
      }
    }
  }
  // 记得清空以防被别的插件读取
  extension.WhenReceive = {};
};

extension.AddCommand = (cmdInfo, doWhat) => {
  extension.CmdInfo[cmdInfo.Name] = Object.create(command);
  let cmd = extension.CmdInfo[cmdInfo.Name];
  cmd.name = cmdInfo.Name;
  cmd.help = cmdInfo.Help;
  cmd.allowDelegate = cmdInfo.AllowDelegate || false;
  cmd.disabledInPrivate = cmdInfo.DisabledInPrivate || false;
  cmd.solve = doWhat;
  let cmdRaw = seal.ext.newCmdItemInfo();
  cmdRaw.name = cmd.name;
  cmdRaw.help = cmd.help || command.help;
  cmdRaw.allowDelegate = cmd.allowDelegate || false;
  cmdRaw.disabledInPrivate = cmd.disabledInPrivate || false;
  cmdRaw.solve = (ctx, msg, cmdArgs) => {
    cmd.ctx = ctx;
    cmd.msg = msg;
    cmd.argv = cmdArgs;

    if (cmdInfo.NeedHelp && cmd.argv.getArgN(1) === "help") {
      let ret = seal.ext.newCmdExecuteResult(true);
      ret.showHelp = true;
      return ret;
    }

    let returnValue = cmd.solve(cmd);

    let key = ['name', 'help', 'solve', 'allowDelegate', 'disabledInPrivate']
    for (let [k] of Object.entries(cmd)) {
      if (!key.find(x => k === x)) cmd[k] = null
    }

    return returnValue;
  };
  let extRaw = seal.ext.find(extension.ExtName);
  extRaw.cmdMap[cmdRaw.name] = cmdRaw;
};
