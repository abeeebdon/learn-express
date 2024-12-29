import { Router } from 'express'
import userRouter from './userRoute.mjs'
import productRouter from './productRoute.mjs'

const router = Router()

router.use(userRouter)
router.use(productRouter)

export default router
