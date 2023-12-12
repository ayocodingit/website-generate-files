import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import {
    RequestConvertImage,
    RequestImage,
    RequestPdf,
    RequestUpload,
} from '../../entity/schema'
import removeFile from '../../../../cron/removeFile.cron'
import Minio from '../../../../external/minio'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private minio: Minio
    ) {}

    public Image() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestImage, req.body)
                const { filename, mime_type } = await this.usecase.Image(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(this.minio, filename, body.seconds, this.logger)
                const url = await this.minio.GetFileUrl(filename)

                return res.status(statusCode.OK).json({
                    data: {
                        url:
                            this.http.GetDomain(req) +
                            `/download?url=${url}&mimetype=${mime_type}`,
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
                const { filename, mime_type } = await this.usecase.Pdf(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(this.minio, filename, body.seconds, this.logger)
                const url = await this.minio.GetFileUrl(filename)

                return res.status(statusCode.OK).json({
                    data: {
                        url:
                            this.http.GetDomain(req) +
                            `/download?url=${url}&mimetype=${mime_type}`,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }

    public ConvertImage() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestConvertImage, req.body)
                const { filename, mime_type } = await this.usecase.ConvertImage(
                    body
                )

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(this.minio, filename, body.seconds, this.logger)
                const url = await this.minio.GetFileUrl(filename)

                return res.status(statusCode.OK).json({
                    data: {
                        url:
                            this.http.GetDomain(req) +
                            `/download?url=${url}&mimetype=${mime_type}`,
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

                const { filename } = await this.usecase.Upload(body)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(this.minio, filename, body.seconds, this.logger)
                const url = await this.minio.GetFileUrl(filename)

                return res.status(statusCode.OK).json({
                    data: {
                        url:
                            this.http.GetDomain(req) +
                            `/download?url=${url}&mimetype=${body.file.mimetype}`,
                    },
                })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
