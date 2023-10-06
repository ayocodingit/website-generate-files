import schedule from 'node-schedule'
import fs from 'fs'

const removeFile = (path: string, second: number) => {
    schedule.scheduleJob({ second }, function () {
        if (fs.existsSync(path)) fs.unlinkSync(path)
    })
}

export default removeFile
