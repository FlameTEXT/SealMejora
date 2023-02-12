globalThis.extension = {};

extension.Register = (info) => {
  extension.ExtName = info.Name;
  let extRaw = seal.ext.find(info.Name);
  if (!extRaw) {
    extRaw = seal.ext.new(info.Name, info.Author, info.Version);
    seal.ext.register(extRaw);
  }
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
    let c = extension.CmdInfo[cmdArgs.command];
    c.ctx = ctx;
    c.msg = msg;
    c.argv = cmdArgs;
    let returnValue = cmd.solve();
    let ret = seal.ext.newCmdExecuteResult(returnValue);
    if (cmdInfo.NeedHelp) {
      ret.showHelp = true;
    }
    return ret;
  };
  let extRaw = seal.ext.find(extension.ExtName);
  extRaw.cmdMap[cmdRaw.name] = cmd;
};
