import platform from "./lib/platform"
import path from "path"
import { ChildProcessMessage } from "./types/message"
type startType = { filePath: string }
function start(options?: startType) {
    const fork = platform.start({
        filePath: options?.filePath ? options?.filePath : path.join(__dirname, './lib/server')
    })
    return fork
}

start()