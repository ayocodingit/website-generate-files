export interface RequestImage {
    url: string
    property: {
        height: number
        width: number
        extension: string
    }
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
}
