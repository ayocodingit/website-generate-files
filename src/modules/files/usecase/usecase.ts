import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import { RequestImage, RequestPdf } from '../entity/interface'
import fs from 'fs'
class Usecase {
    constructor(
        private logger: Logger,
        private dir: string,
        private browser: Browser
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
        const page = await this.browser.newPage()
        try {
            const { filename, path } = this.getFiles(property.extension)
            await page.goto(url, { waitUntil: 'load' })
            if (property.height && property.width) {
                await page.setViewport({
                    height: property.height,
                    width: property.width,
                })
            }

            await page.screenshot({ path })

            return {
                filename,
                path,
            }
        } catch (error) {
            throw error
        } finally {
            await page.close()
        }
    }

    public async Pdf({ url, property }: RequestPdf) {
        const page = await this.browser.newPage()
        try {
            const { filename, path } = this.getFiles('pdf')
            await page.goto(url, { waitUntil: 'load' })
            const { format, margin } = property
            const documentPdf = await page.pdf({
                format,
                margin,
            })

            fs.writeFileSync(path, documentPdf)

            return {
                filename,
                path,
            }
        } catch (error) {
            throw error
        } finally {
            await page.close()
        }
    }
}

export default Usecase
