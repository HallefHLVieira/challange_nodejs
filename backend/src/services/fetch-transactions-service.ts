import { AppError } from '@/errors/errors'
import Cliente from '@/models/Client'
import Transaction from '@/models/Transaction'
import { QueryFilters } from '@/types'

interface RequestFilters {
  page: number
  limit: number
  cpfCnpj?: string | string[] | undefined
  startDate?: string
  endDate?: string
}

const FetchTransactionsService = {
  async execute({ page, limit, cpfCnpj, startDate, endDate }: RequestFilters) {
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

    const pageNumber = page
    const pageLimit = limit
    const skip = (pageNumber - 1) * pageLimit

    const transactions = await Transaction.find(queryFilters)
      .sort({ data: -1 })
      .skip(skip)
      .limit(pageLimit)
      .populate('clienteId', 'nome cpfCnpj')
      .exec()

    const totalTransactions = transactions.length
    const totalPages = Math.ceil(totalTransactions / pageLimit)

    return {
      transactions,
      totalTransactions,
      totalPages,
      pageNumber,
      pageLimit,
    }
  },
}

export default FetchTransactionsService
