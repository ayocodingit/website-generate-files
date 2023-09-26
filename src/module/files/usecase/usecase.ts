import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import { RequestBody } from '../entity/interface'

class Usecase {
    constructor(private logger: Logger, private browser: Browser) {}

    public async Image(body: RequestBody) {
        const page = await this.browser.newPage()
        await page.goto(body.url, { waitUntil: 'load' })
        await page.screenshot({
            path: `build/${Date.now()}-${Math.random()}.png`
        })
        await page.close()
        return "berhasil"
    }

    public async Pdf(body: RequestBody) {
        return
    }
}

export default Usecase
