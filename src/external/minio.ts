import { Config } from '../config/config.interface'
import { Client } from 'minio'
class Minio {
    private client
    private bucket
    constructor(config: Config) {
        this.client = new Client({
            endPoint: config.minio.endpoint,
            useSSL: config.minio.ssl,
            accessKey: config.minio.access_key,
            secretKey: config.minio.secret_key,
        })
        this.bucket = config.minio.bucket
    }

    public async Upload(
        source: Buffer,
        filename: string,
        size: number,
        ContentType: string
    ) {
        return new Promise((resolve, reject) => {
            this.client.putObject(
                this.bucket,
                filename,
                source,
                size,
                {
                    'Content-Type': ContentType,
                },
                function (err, objInfo) {
                    if (err) return reject(err)
                    return resolve(objInfo)
                }
            )
        })
    }

    public async Delete(filename: string) {
        return this.client.removeObject(this.bucket, filename, {
            forceDelete: true,
        })
    }

    public async GetFileUrl(filename: string) {
        try {
            const url = await this.client.presignedGetObject(
                this.bucket,
                filename
            )
            return Buffer.from(url).toString('base64')
        } catch (error) {
            throw error
        }
    }
}

export default Minio
