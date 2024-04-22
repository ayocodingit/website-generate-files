import Joi from 'joi'

export const uriWithSpaces = (
    value: string,
    helpers: Joi.CustomHelpers<string>
) => {
    try {
        new URL(value)
        return value
    } catch (error) {
        return helpers.error('string.uri')
    }
}
