import fs from 'fs'
import { scheduleJob } from 'node-schedule'

const removeFile = (path: string, second: number) => {
    const time = second * 1000
    const startTime = new Date(Date.now() + time)
    const endTime = new Date(startTime.getTime() + 1000)
    scheduleJob(
        { start: startTime, end: endTime, rule: '*/1 * * * * *' },
        function () {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
            }
        }
    )
}

export default removeFile
