import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import { transactionsRoutes } from './routes'
dotenv.config()

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST',
  }),
)

app.use(transactionsRoutes)

const PORT = process.env.PORT || 3000

// MongoDB configs
// TODO: convert in envs
mongoose
  .connect(
    'mongodb://hadmin:hadmin123@localhost:27017/tonline?authSource=admin',
  )
  .then(() => console.log('MongoDB conection ON 🚀️'))
  .catch((err) => console.error('error to connect to MongoDB 😓️', err))

// Server start
app.listen(PORT, () => {
  console.log(`Servidor is running at http://localhost:${PORT}`)
})
