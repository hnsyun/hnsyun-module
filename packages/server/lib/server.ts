import express, { Application } from "express"
import process from "process"
import { Server, Socket } from "socket.io"
import { createServer, Server as httpServer } from "http"
import { ChildProcessMessageType } from "../types/message"
import { ServerConfig } from "../types/server"
import { readFileSync } from 'fs'
import path from "path"

/**
 * @description: socket 实例
 * @return {*}
 */
let socket: Server
/**
 * @description: http 实例
 * @return {*}
 */
let http: httpServer
/**
 * @description: express 实例 
 * @return {*}
 */
let expressApp: Application
/**
   * @description: 注册socket相关的事件
   * @return {*}
   */
function registrySocketEvent() {
    socket.addListener("connection", (socket: Socket) => {
        process.send?.({
            type: ChildProcessMessageType.SOCKETCONNECT,
            message: socket.id
        })
    })
}

/**
    * @description: 
    * @return {*}
    */
function injectHtml() {
    expressApp.use("/testsocket", (_, resp) => {
        const dirname = __dirname
        const index = dirname.lastIndexOf("public")
        if (index !== -1) {
            const htmlTemplate = readFileSync(path.join(dirname.substring(0, index), 'public/index.html'), 'utf-8')

            resp.type('html');

            resp.send(htmlTemplate)
        }
        else {
            resp.send("模板html不存在；template【html】not found;")
        }

    })
}
const server = {
    start() {
        process.send?.({
            type: ChildProcessMessageType.MESSAGE,
            message: "platform/server starting ......"
        })
        // 创建服务
        expressApp = express();

        expressApp.use("/hnsyun", (req, res) => {
            res.send("【@hnsyun/server running】")
        })

        http = createServer(expressApp)

        socket = new Server(http)

        injectHtml()

        registrySocketEvent()
        http.listen(ServerConfig.Port, () => {
            process.send?.({
                type: ChildProcessMessageType.MESSAGE,
                message: "platform/server started"
            })
        })

    },


}

server.start()

export default server