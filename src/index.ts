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
