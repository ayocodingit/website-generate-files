import Joi from 'joi'
import config from '../../../config/config'
import { uriWithSpaces } from '../../../helpers/joi'

const seconds = 3600

export const RequestImage = Joi.object({
    url: Joi.string().custom(uriWithSpaces).required(),
    property: Joi.object({
        extension: Joi.string().valid('png', 'jpg').default('jpg'),
        height: Joi.number().optional(),
        width: Joi.number().optional(),
    }).default(),
    wait_for_selector: Joi.string().optional(),
    seconds: Joi.number().default(seconds).optional(),
})

export const RequestPdf = Joi.object({
    url: Joi.string().custom(uriWithSpaces).required(),
    property: Joi.object({
        format: Joi.string().valid('a4', 'letter').default('a4'),
        margin: Joi.object({
            top: Joi.string().default('36px'),
            bottom: Joi.string().default('113px'),
            left: Joi.string().default('113px'),
            right: Joi.string().default('76px'),
        }).default(),
    }).default(),
    wait_for_selector: Joi.string().optional(),
    seconds: Joi.number().default(seconds).optional(),
})

export const RequestConvertImage = Joi.object({
    url: Joi.string().custom(uriWithSpaces).required(),
    seconds: Joi.number().default(seconds).optional(),
    quality: Joi.number().min(1).max(100).optional().default(80),
    convertTo: Joi.string().valid('jpeg', 'webp').optional().default('webp'),
})

export const RequestReplaceDoc = Joi.object({
    url: Joi.string().custom(uriWithSpaces).required(),
    seconds: Joi.number().default(seconds).optional(),
    data: Joi.object().optional(),
})

export const RequestUpload = Joi.object({
    seconds: Joi.number().default(seconds).optional(),
    file: Joi.object({
        path: Joi.string().required(),
        size: Joi.number().max(config.file.max).required(),
        mimetype: Joi.string()
            .valid(...config.file.type)
            .required(),
        originalname: Joi.string().required(),
        filename: Joi.string().required(),
    }),
    quality: Joi.number().min(1).max(100).optional().default(80),
    convertTo: Joi.string().valid('jpeg', 'webp').optional().default('webp'),
})
