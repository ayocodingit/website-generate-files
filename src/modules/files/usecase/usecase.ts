import { Browser } from 'puppeteer'
import Logger from '../../../pkg/logger'
import {
    RequestConvertImage,
    RequestImage,
    RequestPdf,
    RequestUpload,
} from '../entity/interface'
import fs, { readFileSync, writeFileSync } from 'fs'
import { extname } from 'path'
import Minio from '../../../external/minio'
import mime from 'mime'
import axios from 'axios'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Sharp from '../../../pkg/sharp'
import { RegexContentTypeImage } from '../../../helpers/regex'

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
            const mime_type = mime.getType(path) as string
            const source = readFileSync(path)
            await this.minio.Upload(source, filename, stats.size, mime_type)

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
            const mime_type = mime.getType(path) as string
            const source = readFileSync(path)
            await this.minio.Upload(source, filename, stats.size, mime_type)

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

            const { filename, size, mime_type } = meta

            await this.minio.Upload(source, filename, size, mime_type)

            return {
                filename,
            }
        } catch (error) {
            throw error
        }
    }

    public async Upload(body: RequestUpload) {
        const ext = extname(body.file.originalname).replace('.', '')
        const file = this.getFiles(ext)
        fs.renameSync(body.file.path, file.path)

        const source = readFileSync(file.path)
        await this.minio.Upload(
            source,
            file.filename,
            body.file.size,
            body.file.mimetype
        )
        fs.rmSync(file.path)

        return file
    }
}

export default Usecase
