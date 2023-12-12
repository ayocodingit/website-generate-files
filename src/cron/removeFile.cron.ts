import { scheduleJob } from 'node-schedule'
import Minio from '../external/minio'
import Logger from '../pkg/logger'

const removeFile = (
    minio: Minio,
    filename: string,
    second: number,
    logger: Logger
) => {
    const time = second * 1000
    if (time === 0) return
    const startTime = new Date(Date.now() + time)
    const endTime = new Date(startTime.getTime() + 1000)
    scheduleJob(
        { start: startTime, end: endTime, rule: '*/1 * * * * *' },
        function () {
            minio
                .Delete(filename)
                .then((res) => {
                    logger.Info(
                        'success Deletes with the name file is ' + filename
                    )
                })
                .catch((e) => {})
        }
    )
}

export default removeFile
