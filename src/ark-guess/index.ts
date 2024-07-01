import _ark_char_dict from "./data.json";
import { sample } from "lodash-es";

const Name = "ark-guess";

let ark_char_dict: Record<string, Char> = _ark_char_dict;

let ext = seal.ext.find(Name);
if (!ext) {
  ext = seal.ext.new(Name, "nao", "0.0.0");
  seal.ext.register(ext);
}

type Char = {
  illust: string;
  nation: string;
  profession: string;
  race?: string;
  rarity: number;
  teamId?: string;
};

type GameData = {
  count: number;
  char: string;
};

function newGameData(): GameData {
  return {
    count: 8,
    char: "",
  };
}

function Eq(a: string | number, b: string | number) {
  if (typeof a == "number" && typeof b == "number") {
    if (a == b) {
      return "相同";
    } else if (a < b) {
      return "更高";
    } else {
      return "更低";
    }
  }
  if (a == b && a == "未公开") return "不同";
  return a === b ? "相同" : "不同";
}

ext.onNotCommandReceived = (ctx: seal.MsgContext, msg: seal.Message) => {
  const data_key = Name + msg.groupId;
  const raw = ext.storageGet(data_key);
  let data: GameData = raw != "" ? JSON.parse(raw) : newGameData();
  let text = msg.message;

  switch (text) {
    case "方舟猜干员":
      if (data.char != "") {
        seal.replyToSender(ctx, msg, "游戏已经开始，请勿喧嚣！");
        return;
      }
      data.char = sample(Object.keys(ark_char_dict));
      seal.replyToSender(
        ctx,
        msg,
        `干员载入完成，请开始猜干员姓名。共有次数：${data.count}`
      );
      ext.storageSet(data_key, JSON.stringify(data));
      return;
    case "不猜方舟干员了":
      if (data.char == "") {
        seal.replyToSender(ctx, msg, "游戏还未开始，又如何结束？");
        return;
      }
      seal.replyToSender(
        ctx,
        msg,
        `${msg.sender.nickname} 不猜了吗？
明明还有 ${data.count} 次机会。
那么，正确的答案：${data.char}`
      );
      ext.storageSet(data_key, "");
      return;
    default:
      if (data.char == "") {
        return;
      }
      if (data.char == text) {
        seal.replyToSender(
          ctx,
          msg,
          `恭喜，这是属于 ${msg.sender.nickname} 的胜利！`
        );
        ext.storageSet(data_key, "");
        return;
      }
      let char = ark_char_dict[text];
      if (char) {
        let _char = ark_char_dict[data.char];
        if (data.count == 0) {
          seal.replyToSender(
            ctx,
            msg,
            `很遗憾，${msg.sender.nickname} 次数已经耗尽
正确答案是 ${data.char}
            `
          );
          ext.storageSet(data_key, "");
          return;
        }

        data.count--;
        seal.replyToSender(
          ctx,
          msg,
          `剩余次数：${data.count}
提示信息 >>>
稀有度：${Eq(char.rarity, _char.rarity)}
出身地：${Eq(char.nation, _char.nation)}
职业：${Eq(char.profession, _char.profession)}
种族：${Eq(char.race, _char.race)}
画师：${Eq(char.illust, _char.illust)}
          `
        );
        ext.storageSet(data_key, JSON.stringify(data));
      }
  }
};

export {};
