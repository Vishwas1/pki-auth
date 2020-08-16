import {Request, Response} from 'express'

const registerApp = (req: Request, res: Response) => {
    res.send('Success')
}

export {
    registerApp
}