import express, { Express, NextFunction, Request, Response } from 'express'
import statusCode from '../../pkg/statusCode'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import compression from 'compression'
import { Config } from '../../config/config.interface'
import Error from '../../pkg/error'
import Logger from '../../pkg/logger'
import fs from 'fs'
import multer from 'multer'
import axios from 'axios'

class Http {
    private app: Express
    public dir = 'public'

    constructor(private logger: Logger, private config: Config) {
        this.app = express()
        this.plugins()
        this.pageHome()
    }

    private createDir() {
        if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
    }

    public Upload(fieldName: string) {
        const upload = multer({ dest: this.dir })
        return upload.single(fieldName)
    }

    private plugins() {
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(
            '/download',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    let url = (req.query.url as string) || ''
                    let mimetype =
                        (req.query.mime_type as string) || 'image/png'
                    url = Buffer.from(url, 'base64').toString('ascii')
                    const { data } = await axios(url, {
                        responseType: 'arraybuffer',
                    })
                    res.setHeader('Content-Type', mimetype)
                    return res.send(data)
                } catch (error) {
                    return res.status(statusCode.NOT_FOUND).json({
                        error: statusCode[statusCode.NOT_FOUND],
                    })
                }
            }
        )
    }

    private pageNotFound = () => {
        this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
            throw new Error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        })
    }

    private onError = (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const resp: Record<string, any> = {}
        const code = Number(error.status) || 500
        resp.error =
            error.message || statusCode[statusCode.INTERNAL_SERVER_ERROR]

        if (error.isObject) resp.error = JSON.parse(resp.error)

        this.logger.Error(statusCode[code] as string, {
            error,
            additional_info: this.AdditionalInfo(req, resp.code),
        })

        if (
            code >= statusCode.INTERNAL_SERVER_ERROR &&
            this.config.app.env === 'production'
        ) {
            resp.error = statusCode[statusCode.INTERNAL_SERVER_ERROR]
        }

        if (code === statusCode.UNPROCESSABLE_ENTITY) {
            resp.errors = resp.error
            delete resp.error
        }

        return res.status(code).json(resp)
    }

    public AdditionalInfo(req: Request, statusCode: number) {
        return {
            env: this.config.app.env,
            http_uri: req.originalUrl,
            http_host: this.GetDomain(req),
            http_method: req.method,
            http_scheme: req.protocol,
            remote_addr: req.httpVersion,
            user_agent: req.headers['user-agent'],
            tz: new Date(),
            code: statusCode,
        }
    }

    public GetDomain(req: Request) {
        return req.protocol + '://' + req.headers.host
    }

    public Router() {
        return express.Router()
    }

    public SetRouter(prefix: string, ...router: any) {
        this.app.use(prefix, router)
    }

    private pageHome = () => {
        this.app.get('/', (req: Request, res: Response) => {
            this.logger.Info('OK', {
                additional_info: this.AdditionalInfo(req, res.statusCode),
            })
            res.status(statusCode.OK).json({
                app_name: this.config.app.name,
            })
        })
    }

    public Run(port: number) {
        this.pageNotFound()
        this.createDir()
        this.app.use(this.onError)
        if (this.config.app.env !== 'test') {
            this.app.listen(port, () => {
                this.logger.Info(
                    `Server http is running at http://localhost:${port}`
                )
            })
        }
    }
}

export default Http
