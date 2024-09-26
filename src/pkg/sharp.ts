import sharp from 'sharp'

export type Resize = {
    resize: boolean
    height: number
    width: number
}

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
        quality: number,
        resize?: Resize
    ) {
        let sharpImage = sharp(source)
        if (resize?.resize)
            sharpImage = sharpImage.resize({
                height: resize.height,
                width: resize.width,
                fit: 'inside',
            })
        const { data, info } = await sharpImage[convertTo]({
            quality,
        }).toBuffer({ resolveWithObject: true })

        const { filename } = this.getFilename(info.format)
        const mimetype = 'image/' + info.format

        return {
            filename,
            meta: {
                size: info.size,
                mimetype,
            },
            source: data,
        }
    }
}

export default Sharp
