import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { RequestImage, RequestPdf } from '../../entity/schema'
import Jwt from '../../../../pkg/jwt'
import removeFile from '../../../../cron/removeFile.cron'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private jwt: Jwt
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
}

export default Handler
