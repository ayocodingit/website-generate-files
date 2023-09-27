import Joi from 'joi'

export const RequestImage = Joi.object({
    url: Joi.string().uri().required(),
    property: Joi.object({
        extension: Joi.string().valid('png', 'jpg').default('jpg'),
        heigth: Joi.number().optional(),
        width: Joi.number().optional(),
    }).default(),
})

export const RequestPdf = Joi.object({
    url: Joi.string().uri().required(),
    property: Joi.object({
        format: Joi.string().valid('a4', 'letter').default('a4'),
        margin: Joi.object({
            top: Joi.string().default('36px'),
            bottom: Joi.string().default('113px'),
            left: Joi.string().default('113px'),
            right: Joi.string().default('76px'),
        }),
    }).default(),
})
