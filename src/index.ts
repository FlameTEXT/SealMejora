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

extension.WhenReceive["hello"] = () => {
  console.log("hi there!");
}

extension.WhenReceive["I like (.*)"] = (match) => {
  console.log("I like " + match[1] + "too!")
}
