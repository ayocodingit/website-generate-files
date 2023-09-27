import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import { RequestImage, RequestPdf } from '../entity/interface'
import fs from 'fs'

class Usecase {
    constructor(
        private logger: Logger,
        private browser: Browser,
        private dir: string
    ) {}

    private getFiles(extension: string) {
        const filename = `${Date.now()}-${Math.random()}.${extension}`
        const path = this.dir + '/' + filename
        return {
            filename,
            path,
        }
    }

    public async Image({ url, property }: RequestImage) {
        const { filename, path } = this.getFiles(property.extension)

        const page = await this.browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle0' })

        if (property.height && property.width) {
            await page.setViewport({
                height: property.height,
                width: property.width,
            })
        }

        await page.screenshot({ path })
        await page.close()

        return {
            filename,
            path,
        }
    }

    public async Pdf({ url, property }: RequestPdf) {
        const { filename, path } = this.getFiles('pdf')

        console.log(property);
        

        const page = await this.browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle0' })

        const { format, margin } = property
        const documentPdf = await page.pdf({
            format,
            margin,
        })

        fs.writeFileSync(path, documentPdf)

        await page.close()
        return {
            filename,
            path,
        }
    }
}

export default Usecase
