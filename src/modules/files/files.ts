import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import { Config } from '../../config/config.interface'
import { Browser } from 'puppeteer'
import Minio from '../../external/minio'

class Files {
    constructor(
        private logger: Logger,
        private http: Http,
        private config: Config,
        private browser: Browser
    ) {
        this.loadHttp()
    }

    private async loadHttp() {
        const minio = new Minio(this.config)
        const usecase = new Usecase(
            this.logger,
            this.http.dir,
            this.browser,
            minio
        )
        const handler = new Handler(this.logger, this.http, usecase, minio)
        this.httpPublic(handler)
    }

    private httpPublic(handler: Handler) {
        const Router = this.http.Router()

        Router.post('/image', handler.Image())
        Router.post('/pdf', handler.Pdf())
        Router.post('/upload', this.http.Upload('file'), handler.Upload())

        this.http.SetRouter('/v1/', Router)
    }
}

export default Files
