import { NextFunction, Response } from 'express'
import statusCode from '../../../pkg/statusCode'
import Jwt from '../../../pkg/jwt'

export const VerifyToken = (jwt: Jwt) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { token } = req.params

        try {
            const decode = jwt.Verify(token)
            req['user'] = decode
            return next()
        } catch (error) {
            return res.status(statusCode.UNAUTHORIZED).json({
                error: statusCode[statusCode.UNAUTHORIZED]
            })
        }
    }
}
