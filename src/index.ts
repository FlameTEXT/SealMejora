command.add('cmd', (cmd) => {
  cmd.reply('好好！');
});

command.add('cmd2',  (cmd) => {
  cmd.reply('好好！x2');
});

extension.Register({
  Name: "Tester Ext",
  Author: "me",
  Version: "0.0.1"
});

let cmdInfo = {
  Name: "say",
  Help: "No help",
  NeedHelp: true
}
extension.AddCommand(cmdInfo, cmd => {
  cmd.reply("hello!");
});
