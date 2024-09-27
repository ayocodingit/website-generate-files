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
    RequestReplaceDoc,
    RequestUpload,
} from '../../entity/schema'
import removeFile from '../../../../cron/removeFile.cron'
import Minio from '../../../../external/minio'
import { rmSync } from 'fs'
import Shortlink from '../../../../external/shortlink'
import { File } from '../../entity/interface'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private minio: Minio,
        private shortlink: Shortlink
    ) {}

    private async getUrlFile(file: File, seconds: number) {
        const { filename, source, meta } = file
        await this.minio.Upload(source, filename, meta.size, meta.mimetype)
        removeFile(this.minio, filename, seconds, this.logger)
        const url = await this.minio.GetFileUrl(filename)
        return url
    }

    private async responseFile(
        req: Request,
        res: Response,
        seconds: number,
        file: File
    ) {
        const responseType = req.headers['response-type'] as string | undefined

        const { filename, source, meta } = file
        if (responseType !== 'arraybuffer') {
            const url = await this.getUrlFile(file, seconds)
            return res.status(statusCode.OK).json({
                data: {
                    url: this.http.GetDomain(req) + `/download?url=${url}`,
                    meta,
                },
            })
        }
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
        res.setHeader('Content-Type', meta.mimetype)
        return res.status(statusCode.OK).send(source)
    }

    public Image() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestImage, req.body)
                const file = await this.usecase.Image(body)

                return await this.responseFile(req, res, body.seconds, file)
            } catch (error) {
                return next(error)
            }
        }
    }

    public Pdf() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestPdf, req.body)
                const file = await this.usecase.Pdf(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return await this.responseFile(req, res, body.seconds, file)
            } catch (error) {
                return next(error)
            }
        }
    }

    public ConvertImage() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestConvertImage, req.body)
                const file = await this.usecase.ConvertImage(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return await this.responseFile(req, res, body.seconds, file)
            } catch (error) {
                return next(error)
            }
        }
    }
    public ReplaceDoc() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestReplaceDoc, req.body)
                const file = await this.usecase.ReplaceDoc(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return await this.responseFile(req, res, body.seconds, file)
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
                    convertTo: req.body.convertTo,
                    quality: req.body.quality,
                    file: req.file || {},
                })

                const file = await this.usecase.Upload(body)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return await this.responseFile(req, res, body.seconds, file)
            } catch (error) {
                return next(error)
            } finally {
                if (req.file) rmSync(`${this.http.dir}/${req.file.filename}`)
            }
        }
    }
}

export default Handler
