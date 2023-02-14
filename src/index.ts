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

let myDataManager = extension.NewDataManager();

let handler = {
  "hello": () => {
    console.log("hi there!");
  },

  "My favorite kind of food is (.*)": (match) => {
    myDataManager.WriteData("food", match[1]);
  },

  "What is my favorite food?": () => {
    console.log(`${myDataManager.GetData("food")} is your favorite food.`);
  },

  "I like (.*)": (match) => {
    console.log("I like " + match[1] + "too!")
  }
}

extension.HandleNotCommand(handler, false, null);
