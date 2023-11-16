import { scheduleJob } from 'node-schedule'
import Minio from '../external/minio'

const removeFile = (minio: Minio, filename: string, second: number) => {
    const time = second * 1000
    const startTime = new Date(Date.now() + time)
    const endTime = new Date(startTime.getTime() + 1000)
    scheduleJob(
        { start: startTime, end: endTime, rule: '*/1 * * * * *' },
        function () {
            minio
                .Delete(filename)
                .then((res) => {})
                .catch((e) => {})
        }
    )
}

export default removeFile
