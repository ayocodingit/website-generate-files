import sharp from 'sharp'

class Sharp {
    constructor() {}

    private static getFilename(extension: string) {
        const filename = `${Date.now()}-${Math.random()}.${extension}`

        return {
            filename,
        }
    }

    public static async Convert(
        source: Buffer,
        convertTo: 'webp' | 'jpeg',
        quality: number
    ) {
        const sharpImage = sharp(source)
        const { data, info } = await sharpImage[convertTo]({
            quality,
        }).toBuffer({ resolveWithObject: true })

        const { filename } = this.getFilename(info.format)
        const mimetype = 'image/' + info.format

        return {
            meta: {
                size: info.size,
                mimetype,
                filename,
            },
            source: data,
        }
    }
}

export default Sharp
