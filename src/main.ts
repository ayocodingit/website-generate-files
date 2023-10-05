import puppeteer from 'puppeteer'
import config from './config/config'
import Files from './modules/files/files'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const main = async () => {
    const logger = new Logger(config)
    const http = new Http(logger, config)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })

    // Start Load Modules
    new Files(logger, http, config, browser)
    // End Load Modules

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
