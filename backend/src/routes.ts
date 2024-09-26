import { Router } from 'express'
import {
  SaveTransactionsController,
  FetchTransactionsController,
} from './controllers/transactions'

const transactionsRoutes = Router()

transactionsRoutes.post('/upload', SaveTransactionsController.handle)

transactionsRoutes.get('/transactions', FetchTransactionsController.handle)

export { transactionsRoutes }
