export const getFilename = (extension: string) => {
    const filename = `${Date.now()}.${extension}`

    return filename
}
