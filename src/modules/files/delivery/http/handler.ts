import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { RequestImage, RequestPdf, RequestUpload } from '../../entity/schema'
import removeFile from '../../../../cron/removeFile.cron'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Image() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestImage, req.body)
                const { path, filename } = await this.usecase.Image(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(path, body.seconds)

                return res.status(statusCode.OK).json({
                    data: {
                        url: this.http.GetDomain(req) + '/download/' + filename,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }

    public Pdf() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestPdf, req.body)
                const { path, filename } = await this.usecase.Pdf(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(path, body.seconds)

                return res.status(statusCode.OK).json({
                    data: {
                        url: this.http.GetDomain(req) + '/download/' + filename,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }

    public Upload() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestUpload, {
                    seconds: req.body.seconds,
                    file: req.file || {},
                })
                
                const result = await this.usecase.Upload(body)
                this.logger.Info(statusCode[statusCode.CREATED], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.CREATED
                    ),
                })

                removeFile(result.path, body.seconds)

                return res.status(statusCode.OK).json({
                    data: {
                        url: this.http.GetDomain(req) + '/download/' + result.filename,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
