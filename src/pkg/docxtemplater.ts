import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import error from './error'
import statusCode from './statusCode'

class ReplaceDoc {
    constructor() {}

    public static ReplaceDoc(content: string, data: object) {
        try {
            const zip = new PizZip(content)

            // This will parse the template, and will throw an error if the template is
            // invalid, for example, if the template is "{user" (no closing tag)
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            })

            // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
            doc.render(data)

            // Get the zip document and generate it as a nodebuffer
            const buf = doc.getZip().generate({
                type: 'nodebuffer',
                // compression: DEFLATE adds a compression step.
                // For a 50MB output document, expect 500ms additional CPU time
                compression: 'DEFLATE',
            })

            return buf
        } catch (err: any) {
            throw new error(statusCode.BAD_REQUEST, err.message)
        }
    }
}

export default ReplaceDoc
