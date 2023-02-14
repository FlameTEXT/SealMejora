extension.Register({
  Name: "tester",
  Author: "me",
  Version: "0.0.1"
});

let cmdInfo = {
  Name: "say",
  NeedHelp: true
};

let myDataManager = extension.NewDataManager();
extension.AddCommand(cmdInfo, () => {
  Reply(`You said ${myDataManager.GetArg(1)}, ${myDataManager.GetMessageInfo().sender.nickname}`);
  return true;
});

let handler = [
  {
    match: "Hi there!",
    action: () => {
      Reply("Hello too!");
    }
  },
  {
    match: /^I like (.*)\./,
    action: (match) => {
      Reply(`I like ${match[1]} too.`);
    }
  }
]
extension.HandleNotCommand(handler, false, null);
