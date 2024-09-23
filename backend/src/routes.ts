import multer from 'multer'
import { Router } from 'express'
import {
  SaveTransactionsController,
  FetchTransactionsController,
} from './controllers/transactions'

const transactionsRoutes = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

transactionsRoutes.post(
  '/upload',
  upload.single('transacoes'),
  SaveTransactionsController.handle,
)

transactionsRoutes.get('/transactions', FetchTransactionsController.handle)

export { transactionsRoutes }
