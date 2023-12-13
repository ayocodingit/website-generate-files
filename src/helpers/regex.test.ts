import { RegexContentTypeImage } from './regex' // Replace 'your-file-name' with the actual file name

describe('RegexContentTypeImage', () => {
    it('should match valid image content type', () => {
        const validContentTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
        ]

        validContentTypes.forEach((contentType) => {
            expect(RegexContentTypeImage.test(contentType)).toBe(true)
        })
    })

    it('should not match invalid content types', () => {
        const invalidContentTypes = [
            'text/plain',
            'application/json',
            'image',
            '',
        ]

        invalidContentTypes.forEach((contentType) => {
            expect(RegexContentTypeImage.test(contentType)).toBe(false)
        })
    })
})
