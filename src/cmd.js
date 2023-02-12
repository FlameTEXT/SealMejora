globalThis.command = {}
/** 指令名 */
command.name = 'test'
/** 帮助信息 */
command.help = '默认帮助信息：\n这里是海豹呀！'
/** 允许代骰 */
command.allowDelegate = false
/** 私聊不可用 */
command.disabledInPrivate = false
/** 执行函数：有人发指令了，要干什么？ */
command.solve = () => { return true }

/** 回复消息 */
command.reply = function (s) {
    seal.replyToSender(this.ctx, this.msg, s);
};

/** 添加一个指令
 * @param {string} name 指令名
 * @param {Function} fun 执行函数
 * @param {Array} ext 扩展信息（名、作者、版本）
 * @description 用于：快速完成一个指令；执行函数中不必使用 `seal.replyToSender(ctx,msg,text)` 繁琐形式，而简写为 `cmd.reply(text)`；执行函数返回 `false` 时自动设置发送帮助信息。
 */
command.add = function (name, fun, ext = ['test', 'null', '0.0.0']) {

    var extraw = seal.ext.find(ext[0] || 'name');
    if (!extraw) {
        extraw = seal.ext["new"](ext[0] || 'name', ext[1] || 'null', ext[2] || '0.0.0');
        seal.ext.register(extraw);
    }

    command[name] = Object.create(command) // 方法继承
    cmd = command[name]
    cmd.name = name
    cmd.solve = fun

    var cmdraw = seal.ext.newCmdItemInfo();
    cmdraw.name = cmd[name].name;
    cmdraw.help = cmd[name].help || command.help;
    cmdraw.solve = function (ctx, msg, cmdArgv) {
        var c = command[cmdArgv.command] // 从全局对象获取
        c.ctx = ctx;
        c.msg = msg;
        c.argv = cmdArgv;

        var b = c.solve(c);
        ret = seal.ext.newCmdExecuteResult(b);
        if (!b) {
            ret.showhelp = true
        }

        var key = ['name', 'help', 'solve', 'allowDelegate', 'disabledInPrivate']
        for (let [k] of Object.entries(c)) {
            if (!key.find(x => k == x)) c[k] = null
        } // 清空仅运行时需要的属性

        return ret;
    };

    extraw.cmdMap[cmdraw.name] = cmdraw;

    return 
}



