import config from './config/config'
import Files from './module/files/files'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const main = async () => {
    const logger = new Logger(config)
    const http = new Http(logger, config)

    // Start Load Module
    new Files(logger, http, config)

    // End Load Module

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
