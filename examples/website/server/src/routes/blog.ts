import { Router } from 'express'
import verifyAuth from '../middleware/auth'
const router = Router()

// This protected route
router.post('/create', verifyAuth , (req, res) => {
    res.status(200).send({
        status: 200,
        message: { 
            m: "The blog post got created..",
            user: res.locals.data
        },
        error: null
    })
})


export default router