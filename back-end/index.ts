import { Request, Response } from 'express';
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

import { PrismaClient } from '@prisma/client'
import { DecodedTypes } from './types/types';
const prisma = new PrismaClient()

const app = express()
app.use(express.json());

app.use(cors({
  origin: [process.env.CLIENT_URL],
  methods: ['GET', 'POST'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/getSession', async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error: string, decoded: DecodedTypes) => {
      if (error) {
        return res.send({ authenticated: false })
      }
      if (decoded.authenticated === true) {
        return res.send({ authenticated: true, user: decoded })
      } else {
        return res.send({ authenticated: false })
      }
    })
  } else {
    return res.send({ authenticated: false })
  }
})




async function cleanup() {
  await prisma.$disconnect()
  console.log('Prisma client disconnected.')
}

process.on('beforeExit', async () => {
  await cleanup()
})

process.on('SIGINT', async () => {
  await cleanup()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await cleanup()
  process.exit(0)
})

const port = process.env.APP_PORT || 3001

app.listen(port, () => {
  console.log(`Started server on port ${port}`)
})