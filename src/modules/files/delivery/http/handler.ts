import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { RequestImage, RequestPdf } from '../../entity/schema'
import Jwt from '../../../../pkg/jwt'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private jwt: Jwt
    ) {}

    public Download() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                return res.download(req.user.path, (err) => {
                    if (err) {
                        this.logger.Error(statusCode[statusCode.NOT_FOUND], {
                            error: err.message,
                            additional_info: this.http.AdditionalInfo(
                                req,
                                statusCode.NOT_FOUND
                            ),
                        })
                        return res
                            .status(statusCode.NOT_FOUND)
                            .json({ error: statusCode[statusCode.NOT_FOUND] })
                    }
                    this.logger.Info(statusCode[statusCode.OK], {
                        additional_info: this.http.AdditionalInfo(
                            req,
                            statusCode.OK
                        ),
                    })
                })
            } catch (error) {
                return next(error)
            }
        }
    }

    public Image() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestImage, req.body)
                const result = await this.usecase.Image(body)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                const accessToken = this.jwt.Sign({ path: result }, '1d')
                return res.status(statusCode.OK).json({
                    data: {
                        access_token: accessToken,
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
                const result = await this.usecase.Pdf(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                const accessToken = this.jwt.Sign({ path: result }, '1d')
                return res.status(statusCode.OK).json({
                    data: {
                        access_token: accessToken,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
