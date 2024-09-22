import { AppError } from '@/errors/errors'
import Cliente from '@/models/Client'
import Transaction from '@/models/Transaction'
import SaveTransactionsService from '@/services/save-transactions-service'
import { QueryFilters } from '@/types'
import { Request, Response } from 'express'

export const SaveTransactionsController = {
  async handle(req: Request, res: Response): Promise<Response | undefined> {
    if (!req.file) {
      return res.status(400).send('A file is required. 🧐️')
    }

    try {
      const startTimeToReadFile = Date.now()
      const content = req.file.buffer.toString()
      const records = content.split('\n')

      const promises = records
        .filter((record) => record.trim())
        .map((record) => SaveTransactionsService.execute(record))

      await Promise.all(promises)

      const endTimeToReadFile = Date.now()
      const executionTime = endTimeToReadFile - startTimeToReadFile

      console.log(`Run time: ${executionTime}ms`)
      res.status(200).send({
        message: 'Upload success. 😎️',
        duraction: executionTime,
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      res.status(500).send(`🤯️ Error to save transactions: ${error.message}`)
    }
  },
}

export const FetchTransactions = {
  async handle(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { page = 1, limit = 20, cpfCnpj, startDate, endDate } = req.query

      const queryFilters: QueryFilters = {}

      if (cpfCnpj) {
        const clienteData = await Cliente.findOne({ cpfCnpj })

        if (clienteData) {
          queryFilters.clienteId = clienteData._id
        } else {
          throw AppError('Client not found.', 404)
        }
      }

      if (startDate || endDate) {
        queryFilters.data = {}
        if (startDate) {
          const start = new Date(startDate as string)
          start.setHours(0, 0, 0, 0)
          queryFilters.data.$gte = start
        }
        if (endDate) {
          const end = new Date(endDate as string)
          end.setHours(23, 59, 59, 999)
          queryFilters.data.$lte = end
        }
      }

      const pageNumber = parseInt(page as string, 10)
      const pageLimit = parseInt(limit as string, 10)
      const skip = (pageNumber - 1) * pageLimit

      const transactions = await Transaction.find(queryFilters)
        .sort({ data: -1 })
        .skip(skip)
        .limit(pageLimit)
        .populate('clienteId', 'nome cpfCnpj')
        .exec()

      const totalTransactions = await Transaction.countDocuments(queryFilters)

      res.status(200).json({
        transactions,
        totalPages: Math.ceil(totalTransactions / pageLimit),
        currentPage: pageNumber,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) {
        return res.status(404).json({
          message: error.message,
          transactions: [],
        })
      }

      console.error('Error to fetch transactions:', error.message)
      res.status(500).send('Error to fetch transactions. 🤯️')
    }
  },
}
