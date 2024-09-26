import { calculeRunTimeExecution } from '@/scripts/calcule-duraction-time'
import FetchTransactionsService from '@/services/fetch-transactions-service'
import SaveTransactionsService from '@/services/save-transactions-service'
import { Request, Response } from 'express'
import readLine from 'node:readline'

export const SaveTransactionsController = {
  async handle(req: Request, res: Response): Promise<Response | undefined> {
    const startTimeToReadFile = Date.now()

    let processedLines = 0

    // Cria uma interface readline para ler o stream do arquivo linha a linha
    const readLineControl = readLine.createInterface({
      input: req,
      crlfDelay: Infinity, // garantindo as quebras de linhas
    })

    // Processa as linhas do arquivo conforme elas chegam
    readLineControl.on('line', async (line: string) => {
      // Verifica se a linha é uma string válida
      if (line && typeof line === 'string' && line.trim() !== '') {
        try {
          await SaveTransactionsService.execute(line) // Processa a linha
          processedLines++
        } catch (error) {
          console.error('Error processing line:', error)
        }
      } else {
        console.log('Linha em branco ou indefinida ignorada:', line)
      }
    })

    // Quando todo o arquivo for lido, termina o processamento
    readLineControl.on('close', () => {
      const endTimeToReadFile = Date.now()
      const executionTime = calculeRunTimeExecution(
        startTimeToReadFile,
        endTimeToReadFile,
      )

      res.status(200).send({
        message: 'Upload success. 😎️',
        runTime: executionTime,
        processedLines,
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readLineControl.on('error', (error: any) => {
      console.error(error)
      res.status(500).send(`🤯️ Error to process file: ${error.message}`)
    })
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
