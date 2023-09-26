import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import { Config } from '../../config/config.interface'
import puppeteer from 'puppeteer'

class Files {
    constructor(
        private logger: Logger,
        private http: Http,
        private config: Config
    ) {
        this.loadHttp()
    }

    private async loadHttp() {
        const browser = await puppeteer.launch({
            executablePath: undefined,
            headless: 'new',
            args: ['--no-sandbox',
                '--disable-web-security'],
        })
        const usecase = new Usecase(this.logger, browser)
        const handler = new Handler(this.logger, this.http, usecase)
        this.httpPublic(handler)
    }

    private httpPublic(handler: Handler) {
        const Router = this.http.Router()

        Router.post('/image', handler.Image())
        Router.post('/pdf', handler.Pdf())

        this.http.SetRouter('/v1/', Router)
    }
}

export default Files
