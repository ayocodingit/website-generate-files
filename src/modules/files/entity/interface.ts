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

export interface RequestConvertImage {
    url: string
    seconds: number
}

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
}
