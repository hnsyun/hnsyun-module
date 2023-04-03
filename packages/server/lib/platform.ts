import child_process, { ChildProcess } from "child_process"
import path from "path"
import logger from "./logger"
type pluginInstanceTypes = {
    install: (fork: ChildProcess) => void
}

type platformTypes = {
    start: (options: { filePath: string }) => ChildProcess
    kill: () => void,
    use: (plugin: pluginInstanceTypes) => void
}

let forkServer: ChildProcess | null

const plugins: pluginInstanceTypes[] = []

const injectPlugins = () => {
    plugins.forEach((plugin) => {
        plugin.install(forkServer as ChildProcess)
    })
}
const platform: platformTypes = {
    use(plugin) {
        plugins.push(plugin);
    },
    start(options) {
        let { filePath } = options

        !filePath && (filePath = path.join(__dirname, './server'))

        forkServer = child_process.fork(filePath)

        forkServer.addListener("close", () => logger.info("【@hnsyun/pcliboard-server模块儿】服务进程已关闭。"))

        forkServer.addListener("error", (error) => logger.error(error))

        forkServer.addListener("message", (message) => {
            logger.info("子进程消息", message)
        })

        forkServer.addListener("exit", () => logger.info("【@hnsyun/pcliboard-server模块儿】服务进程已退出。"))

        injectPlugins()

        return forkServer
    },
    kill() {
        forkServer?.kill("SIGINT")
    }
}
export default platform