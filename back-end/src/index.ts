import { Request, Response } from 'express';
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const app = express()
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}))

const port = process.env.APP_PORT || 3001

interface AuthTypes {
  email: string,
  password: string,
}

app.post('/signup', async (req: Request, res: Response) => {
  const { email, password }: AuthTypes = req.body

  const check = await prisma.users.findFirst({
    where: {
      email: email,
    }
  })

  if (check) {
    return res.send({ type: 0, message: 'This email is already taken' })
  }

  const hashedPass = await bcrypt.hash(password, 10)

  const create = await prisma.users.create({
    data: {
      email: email,
      password: hashedPass,
    }
  })

  if (create) {
    return res.send({ type: 1, message: 'Successfully created an account' })
  } else {
    return res.send({ type: 0, message: 'An error occured' })
  }
})

app.post('/signin', async (req: Request, res: Response) => {
  const { email, password }: AuthTypes = req.body

  const user = await prisma.users.findFirst({
    where: {
      email: email,
    }
  })
  if(user){
    const check = await bcrypt.compare(password, user.password)
    if(check){
      return res.send({type: 1, message: 'Successfully signed in'})
    }else{
      return res.send({type: 0, message: 'Wrong username or password combination'})
    }
  }else{
    return res.send({type: 0, message: 'Wrong username or password combination'})
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

app.listen(port, () => {
  console.log(`Started server on port ${port}`)
})