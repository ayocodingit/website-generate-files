import sharp from 'sharp'
import config from '../config/config'

class Sharp {
    constructor() {}

    private static getFilename(extension: string) {
        const filename = `${Date.now()}-${Math.random()}.${extension}`

        return {
            filename,
        }
    }

    public static async ConvertToWebp(source: Buffer) {
        const sharpImage = sharp(source)
        const { data, info } = await sharpImage
            .webp({ quality: config.file.quality })
            .toBuffer({ resolveWithObject: true })

        const { filename } = this.getFilename(info.format)
        const mime_type = 'image/' + info.format

        return {
            meta: {
                size: info.size,
                mime_type,
                filename,
            },
            source: data,
        }
    }
}

export default Sharp
