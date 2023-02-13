declare var command: Command;
declare interface Command {
    /** 指令名 */
    name: string
    /** 帮助信息 */
    help: string
    /** 允许代骰 */
    allowDelegate: boolean
    /** 私聊不可用 */
    disabledInPrivate: boolean
    /** 执行函数：有人发指令了，要干什么？\
     * 执行函数返回 `true` 将发送帮助信息。
     */
    solve(): boolean | void

    /** 添加一个指令
     * @param name 指令名
     * @param fun 执行函数
     * @param ext 扩展信息（名、作者、版本）
     * @description 用于：自动注册扩展/指令；执行函数中不必使用 `seal.replyToSender(ctx,msg,text)` 繁琐形式，而简写为 `cmd.reply(text)`；执行函数返回 `false` 时自动设置发送帮助信息。
     */
    add(name: string, fun: (cmd: Command)=>void, ext?: string[]): void

    ctx: seal.MsgContext
    msg: seal.Message
    argv: seal.CmdArgs
    config:config
    /** 回复发送者 */
    reply(text:string):void;
    /** 私聊回复 */
    replyToPerson(text:string):void;
    replyToGroup(text:string):void;

    getConfig():string
    setTempVal():string
    setGroupVal():string
}

interface config {

}
