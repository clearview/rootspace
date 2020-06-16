import { Request, Response, NextFunction } from 'express'

export default function authorize(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // tslint:disable-next-line:no-console
    console.log('Time:', Date.now())

    if (!req.user) {
        // tslint:disable-next-line:no-console
        console.log('NO USER')
    }

    // tslint:disable-next-line:no-console
    console.log('User:', req.user.id)

    next()
}