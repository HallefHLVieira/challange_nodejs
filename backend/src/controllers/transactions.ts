import FetchTransactionsService from '@/services/fetch-transactions-service'
import SaveTransactionsService from '@/services/save-transactions-service'
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

export const FetchTransactionsController = {
  async handle(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { page = 1, limit = 20, cpfCnpj, startDate, endDate } = req.query

      const data = await FetchTransactionsService.execute({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        cpfCnpj: cpfCnpj as string,
        endDate: endDate as string,
        startDate: startDate as string,
      })

      res.status(200).json({
        transactions: data.transactions,
        totalPages: Math.ceil(data.totalTransactions / data.pageLimit),
        currentPage: data.pageNumber,
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
