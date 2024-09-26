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

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private minio: Minio,
        private shortlink: Shortlink
    ) {}

    public Image() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const responseType = req.headers['response-type'] as
                    | string
                    | undefined

                const body = ValidateFormRequest(RequestImage, req.body)
                const { filename, source, meta } = await this.usecase.Image(
                    body
                )

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                if (responseType !== 'arraybuffer') {
                    await this.minio.Upload(
                        source,
                        filename,
                        meta.size,
                        meta.mimetype
                    )
                    removeFile(this.minio, filename, body.seconds, this.logger)
                    const url = await this.minio.GetFileUrl(filename)
                    return res.status(statusCode.OK).json({
                        data: {
                            url:
                                this.http.GetDomain(req) +
                                `/download?url=${url}`,
                        },
                    })
                }
                res.setHeader(
                    'Content-Disposition',
                    'attachment; filename=' + filename
                )
                res.setHeader('Content-Type', meta.mimetype)
                return res.status(statusCode.OK).send(source)
            } catch (error) {
                return next(error)
            }
        }
    }

    public Pdf() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const responseType = req.headers['response-type'] as
                    | string
                    | undefined

                const body = ValidateFormRequest(RequestPdf, req.body)
                const { filename, meta, source } = await this.usecase.Pdf(body)

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                if (responseType !== 'arraybuffer') {
                    await this.minio.Upload(
                        source,
                        filename,
                        meta.size,
                        meta.mimetype
                    )
                    removeFile(this.minio, filename, body.seconds, this.logger)
                    const url = await this.minio.GetFileUrl(filename)
                    return res.status(statusCode.OK).json({
                        data: {
                            url:
                                this.http.GetDomain(req) +
                                `/download?url=${url}`,
                        },
                    })
                }
                res.setHeader(
                    'Content-Disposition',
                    'attachment; filename=' + filename
                )
                res.setHeader('Content-Type', meta.mimetype)
                return res.status(statusCode.OK).send(source)
            } catch (error) {
                return next(error)
            }
        }
    }

    public ConvertImage() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const responseType = req.headers['response-type'] as
                    | string
                    | undefined

                const body = ValidateFormRequest(RequestConvertImage, req.body)
                const { meta, source, filename } =
                    await this.usecase.ConvertImage(body)
                const { size, mimetype } = meta

                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                    responseType: responseType,
                })
                if (responseType !== 'arraybuffer') {
                    await this.minio.Upload(source, filename, size, mimetype)
                    removeFile(this.minio, filename, body.seconds, this.logger)
                    const url = await this.minio.GetFileUrl(filename)
                    return res.status(statusCode.OK).json({
                        data: {
                            url:
                                this.http.GetDomain(req) +
                                `/download?url=${url}`,
                            ...meta,
                        },
                    })
                }
                res.setHeader(
                    'Content-Disposition',
                    'attachment; filename=' + filename
                )
                res.setHeader('Content-Type', meta.mimetype)
                return res.status(statusCode.OK).send(source)
            } catch (error) {
                return next(error)
            }
        }
    }
    public ReplaceDoc() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = ValidateFormRequest(RequestReplaceDoc, req.body)
                const { filename, meta } = await this.usecase.ReplaceDoc(body)

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
                        url: this.http.GetDomain(req) + `/download?url=${url}`,
                        ...meta,
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
                    convertTo: req.body.convertTo,
                    quality: req.body.quality,
                    file: req.file || {},
                })

                const { filename, meta } = await this.usecase.Upload(body)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                removeFile(this.minio, filename, body.seconds, this.logger)
                const url = await this.minio.GetFileUrl(filename)
                const shortlink = await this.shortlink.GenerateLink(
                    this.http.GetDomain(req) + `/download?url=${url}`,
                    body.seconds
                )
                return res.status(statusCode.OK).json({
                    data: {
                        url: shortlink,
                        ...meta,
                    },
                })
            } catch (error) {
                return next(error)
            } finally {
                if (req.file) rmSync(`${this.http.dir}/${req.file.filename}`)
            }
        }
    }
}

export default Handler
