import { Resize } from '../../../pkg/sharp'

export interface RequestImage {
    url: string
    property: {
        height: number
        width: number
        extension: string
    }
    wait_for_selector: string
    seconds: number
}

export interface RequestPdf {
    url: string
    property: {
        format: any
        margin: {
            top: string
            bottom: string
            left: string
            right: string
        }
    }
    wait_for_selector: string
    seconds: number
}

export type RequestConvertImage = {
    url: string
    seconds: number
    quality: number
    convertTo: 'webp' | 'jpeg'
} & Resize

export interface RequestReplaceDoc {
    url: string
    seconds: number
    data: object
}

export interface RequestUpload {
    seconds: number
    file: {
        path: string
        size: number
        mimetype: string
        originalname: string
        filename: string
    }
    quality: number
    convertTo: 'webp' | 'jpeg'
}

export type File = {
    filename: string
    source: Buffer
    meta: {
        size: number
        mimetype: string
    }
}
