import Joi from 'joi'

export const RequestSchema = Joi.object({
    url: Joi.string().uri().required(),
})
