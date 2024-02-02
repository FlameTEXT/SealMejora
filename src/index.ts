import { sum } from "./sum";
function main() {
  let ext = seal.ext.find("js-ext");
  if (!ext) {
    ext = seal.ext.new("js-ext", "null", "1.0.0");
    seal.ext.register(ext);
  }
  const cmd = seal.ext.newCmdItemInfo();
  cmd.name = "sum"
  cmd.help = "两数之和"
  cmd.solve = (ctx, msg, argv) => {
    let res = sum(Number(argv.getArgN(1)), Number(argv.getArgN(2)));
    seal.replyToSender(ctx, msg, res + "");
    return seal.ext.newCmdExecuteResult(true);
  };
  ext.cmdMap["sum"] = cmd;
}

main();
