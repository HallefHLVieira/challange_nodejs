import { AppError } from '@/errors/errors'
import Cliente from '@/models/Client'
import Transaction from '@/models/Transaction'
import { QueryFilters } from '@/types'
import { Request, Response } from 'express'

export const CreateTransaction = {
  async handle(req: Request, res: Response): Promise<Response | undefined> {
    if (!req.file) {
      return res.status(400).send('A file is required. 🧐️')
    }

    const startTimeToReadFile = Date.now()
    const content = req.file.buffer.toString()
    const records = content.split('\n')

    try {
      for (const record of records) {
        if (!record.trim()) {
          continue
        }

        const [idTemp, nomeTemp, cpfCnpjTemp, dataTemp, valorTemp] =
          record.split(';')

        if (idTemp) {
          const id = idTemp.split(':')[1]
          const nome = nomeTemp.split(':')[1]
          const cpfCnpj = cpfCnpjTemp.split(':')[1]
          const data = new Date(dataTemp.split(':')[1])
          const valor = parseFloat(valorTemp.split(':')[1])

          let clientAlreadyExists = await Cliente.findOne({ cpfCnpj })

          if (!clientAlreadyExists) {
            clientAlreadyExists = await Cliente.create({ nome, cpfCnpj })
          }

          const transactionAlreadyExists = await Transaction.findOne({ id })

          if (!transactionAlreadyExists) {
            const newTransaction = await Transaction.create({
              id,
              data,
              valor,
              clienteId: clientAlreadyExists._id,
            })

            clientAlreadyExists.transacoes.push(newTransaction._id)

            await clientAlreadyExists.save()
          } else {
            console.error(`Transaction already exists. 🧐️`)
            // throw AppError('Transaction already exists.', 409);
          }
        } else {
          console.error('Record is empty. 😅️')
          // throw AppError('Invalid transaction.', 400);
        }
      }

      const endTimeToReadFile = Date.now()
      const executionTime = endTimeToReadFile - startTimeToReadFile

      console.log(`Run time: ${executionTime}ms`)
      res.status(200).send({
        message: 'Upload success. 😎️',
        duraction: executionTime,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 409) {
        console.error(`Transaction already exists. 🧐️`)
        res.status(409).send('Transaction already exists.')
      }
      if (error.statusCode === 400) {
        console.error('Record is empty. 😅️')
        res.status(409).send('Invalid transaction.')
      }
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
      if (totalTransactions < 1) {
        throw AppError('Transactions not found.', 404)
      }
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
