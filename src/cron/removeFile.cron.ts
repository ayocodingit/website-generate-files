import fs from 'fs'

const removeFile = (path: string, second: number) => {
    setTimeout(() => {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
    }, second * 1000)
}

export default removeFile
