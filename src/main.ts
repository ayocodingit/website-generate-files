import config from './config/config'
import Files from './modules/files/files'
import Jwt from './pkg/jwt'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const main = async () => {
    const logger = new Logger(config)
    const http = new Http(logger, config)
    const jwt = new Jwt(config)

    // Start Load Modules
    new Files(logger, http, config, jwt)
    // End Load Modules

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
