import Cliente from '@/models/Client'
import Transaction from '@/models/Transaction'

async function SaveTransaction(line: string) {
  const [idTemp, nomeTemp, cpfCnpjTemp, dataTemp, valorTemp] = line.split(';')

  const id = idTemp.split(':')[1]
  const nome = nomeTemp.split(':')[1]
  const cpfCnpj = cpfCnpjTemp.split(':')[1]
  const dateParts = dataTemp.split(':')[1].split('-')
  const data = new Date(
    Date.UTC(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
    ),
  )
  const valor = parseFloat(valorTemp.split(':')[1])

  let clientAlreadyExists = await Cliente.findOne({ cpfCnpj })

  if (!clientAlreadyExists) {
    try {
      clientAlreadyExists = await Cliente.create({ nome, cpfCnpj })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 11000) {
        clientAlreadyExists = await Cliente.findOne({ cpfCnpj })
      } else {
        console.log('Error to get client on Database: ', error.message)
      }
    }
  }

  if (clientAlreadyExists) {
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
      console.error('Transation already exists on database.')
    }
  }
}

const SaveTransactionsService = {
  async execute(line: string) {
    return SaveTransaction(line)
  },
}

export default SaveTransactionsService
