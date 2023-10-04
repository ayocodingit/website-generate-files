import puppeteer, { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import { RequestImage, RequestPdf } from '../entity/interface'
import fs from 'fs'

class Usecase {
    constructor(private logger: Logger, private dir: string) {}

    private async getBrowser() {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-web-security'],
        })

        return browser
    }

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
        const browser = await this.getBrowser()
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'load' })

        if (property.height && property.width) {
            await page.setViewport({
                height: property.height,
                width: property.width,
            })
        }

        await page.screenshot({ path })
        await page.close()
        await browser.close()

        return {
            filename,
            path,
        }
    }

    public async Pdf({ url, property }: RequestPdf) {
        const { filename, path } = this.getFiles('pdf')

        const browser = await this.getBrowser()

        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'load' })

        const { format, margin } = property
        const documentPdf = await page.pdf({
            format,
            margin,
        })

        fs.writeFileSync(path, documentPdf)

        await page.close()
        await browser.close()

        return {
            filename,
            path,
        }
    }
}

export default Usecase
