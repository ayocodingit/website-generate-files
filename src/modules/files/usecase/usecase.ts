import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import {
    RequestConvertImage,
    RequestImage,
    RequestPdf,
    RequestReplaceDoc,
    RequestUpload,
} from '../entity/interface'
import fs, { readFileSync } from 'fs'
import Minio from '../../../external/minio'
import mime from 'mime-types'
import axios from 'axios'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Sharp from '../../../pkg/sharp'
import {
    RegexContentTypeDoc,
    RegexContentTypeImage,
} from '../../../helpers/regex'
import Docxtemplater from '../../../pkg/docxtemplater'

class Usecase {
    constructor(
        private logger: Logger,
        private dir: string,
        private browser: Browser,
        private minio: Minio
    ) {}

    private getFiles(extension: string) {
        const filename = `${Date.now()}-${Math.random()}.${extension}`
        const path = this.dir + '/' + filename
        return {
            filename,
            path,
        }
    }

    public async Image({ url, property, wait_for_selector }: RequestImage) {
        const page = await this.browser.newPage()
        try {
            const { filename, path } = this.getFiles(property.extension)
            await page.goto(url, { waitUntil: 'networkidle2' })
            if (wait_for_selector) {
                await page.waitForSelector(wait_for_selector, { hidden: true })
            }
            if (property.height && property.width) {
                await page.setViewport({
                    height: property.height,
                    width: property.width,
                })
            }

            await page.screenshot({ path })

            const stats = fs.statSync(path)
            const mimetype = mime.lookup(filename) as string
            const source = readFileSync(path)
            await this.minio.Upload(source, filename, stats.size, mimetype)

            fs.rmSync(path)

            return {
                filename,
                path,
            }
        } catch (error) {
            throw error
        } finally {
            await page.close()
        }
    }

    public async Pdf({ url, property, wait_for_selector }: RequestPdf) {
        const page = await this.browser.newPage()
        try {
            const { filename, path } = this.getFiles('pdf')
            await page.goto(url, { waitUntil: 'networkidle2' })
            if (wait_for_selector) {
                await page.waitForSelector(wait_for_selector, { hidden: true })
            }
            const { format, margin } = property
            const documentPdf = await page.pdf({
                format,
                margin,
            })

            fs.writeFileSync(path, documentPdf)
            const stats = fs.statSync(path)
            const mimetype = mime.lookup(filename) as string
            const source = readFileSync(path)
            await this.minio.Upload(source, filename, stats.size, mimetype)

            fs.rmSync(path)

            return {
                filename,
                path,
            }
        } catch (error) {
            throw error
        } finally {
            await page.close()
        }
    }

    public async ConvertImage({ url }: RequestConvertImage) {
        try {
            const { data, status, headers } = await axios.get(url, {
                responseType: 'arraybuffer',
            })

            const contentType = headers['content-type'] || ''

            if (status === 200 && !RegexContentTypeImage.test(contentType))
                throw new error(
                    statusCode.BAD_REQUEST,
                    statusCode[statusCode.BAD_REQUEST]
                )

            const { source, meta } = await Sharp.ConvertToWebp(data)

            const { filename, size, mimetype } = meta

            await this.minio.Upload(source, filename, size, mimetype)

            return {
                filename,
                meta,
            }
        } catch (error) {
            throw error
        }
    }

    public async ReplaceDoc({ url, data: payload }: RequestReplaceDoc) {
        try {
            const { data, status, headers } = await axios.get(url, {
                responseType: 'arraybuffer',
            })

            const contentType = headers['content-type'] || ''

            if (status === 200 && !RegexContentTypeDoc.test(contentType))
                throw new error(
                    statusCode.BAD_REQUEST,
                    statusCode[statusCode.BAD_REQUEST]
                )

            const content = data.toString('binary')

            const { filename } = this.getFiles('docx')

            const source = Docxtemplater.ReplaceDoc(content, payload)

            const size = Buffer.byteLength(source)

            const mimetype =
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

            await this.minio.Upload(source, filename, size, mimetype)

            return {
                filename,
                meta: {
                    filename,
                    size,
                    mimetype,
                },
            }
        } catch (error: any) {
            throw error
        }
    }

    public async Upload(body: RequestUpload) {
        const { source, meta } = await Sharp.ConvertToWebp(
            readFileSync(body.file.path)
        )

        const { filename, size, mimetype } = meta
        await this.minio.Upload(source, filename, size, mimetype)

        return { filename, meta }
    }
}

export default Usecase
