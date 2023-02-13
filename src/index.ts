extension.Register({
  Name: "tester",
  Author: "me",
  Version: "0.0.1"
});

let cmdInfo = {
  Name: "say",
  Help: "No help",
  NeedHelp: true
};

extension.AddCommand(cmdInfo, cmd => {
  cmd.reply("hello!");
});

let anotherCmdInfo = {
  Name: "bye",
  Help: "No help",
  NeedHelp: false
}

extension.AddCommand(anotherCmdInfo, cmd => {
  cmd.reply("bye!");
});
