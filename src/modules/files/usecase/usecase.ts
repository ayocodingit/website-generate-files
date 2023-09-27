import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import { RequestImage, RequestPdf } from '../entity/interface'
import fs from 'fs'

class Usecase {
    constructor(private logger: Logger, private browser: Browser) {}

    private getPath(extension: string) {
        return `public/${Date.now()}-${Math.random()}.${extension}`
    }

    public async Image({ url, property }: RequestImage) {
        const path = this.getPath(property.extension)

        const page = await this.browser.newPage()
        await page.goto(url, { waitUntil: 'load' })

        if (property.height && property.width) {
            await page.setViewport({
                height: property.height,
                width: property.width,
            })
        }
        await page.screenshot({ path })
        await page.close()

        return path
    }

    public async Pdf({ url, property }: RequestPdf) {
        const path = this.getPath('pdf')

        const page = await this.browser.newPage()
        await page.goto(url, { waitUntil: 'load' })

        const { format, margin } = property
        const documentPdf = await page.pdf({
            format,
            margin,
        })

        fs.writeFileSync(path, documentPdf)

        await page.close()
        return path
    }
}

export default Usecase
