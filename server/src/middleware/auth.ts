import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config'

export default function verifyAuth(req, res, next){
    const authToken = req.headers['x-auth-token']
    if(authToken) {
        jwt.verify(authToken, jwtSecret, (err, data) => {
            if(err) res.status(403).send({ status: 403, message: "Unauthorized.", error: null })
            res.locals.data = data;
            next()
        })
    }else{
        res.status(403).send({ status: 403, message: "Please send the x-auth-token in the header", error: null })
    }
}