import { Request, Response } from 'express';
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

import { PrismaClient } from '@prisma/client'
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

interface AuthTypes {
  email: string,
  password: string,
}

interface DecodedTypes {
  authenticated: boolean,
  id: string,
  email: string,
  iat: number,
  exp: number,
}

interface IdProps {
  userId: string,
}

interface NameProps {
  name: string,
  id: string,
}

interface NotesProps {
  user: string,
  directory: string,
}

interface NoteTypes {
  userId: string,
  directoryId: string,
  title: string,
  content: string,
}

interface UpdateTypes{
  id: string,
  title: string,
  content: string,
}

interface DirectoryProps {
  user: string,
  directory: string,
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
    const initDirectory = await prisma.directory.create({
      data: {
        usersId: create.id,
        name: 'Main directory'
      }
    })
    if (initDirectory) {
      return res.send({ type: 1, message: 'Successfully created an account' })
    } else {
      return res.send({ type: 0, message: 'An error occured' })
    }
  } else {
    return res.send({ type: 0, message: 'An error occured' })
  }
})

app.post('/signin', async (req: Request, res: Response) => {
  const { email, password }: AuthTypes = req.body
  const token = req.cookies.token;
  if (token) {
    return res.send({ type: 0, message: 'You are already signed in' });
  }
  const user = await prisma.users.findFirst({
    where: {
      email: email,
    }
  })
  if (user) {
    const check = await bcrypt.compare(password, user.password)
    if (check) {
      const token = jwt.sign(
        { authenticated: true, id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
      );
      res.cookie('token', token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 36000000,
      });
      return res.send({ type: 1, message: 'Successfully signed in' })
    } else {
      return res.send({ type: 0, message: 'Wrong username or password combination' })
    }
  } else {
    return res.send({ type: 0, message: 'Wrong username or password combination' })
  }
})

app.post('/checkAuth', async (req: Request, res: Response) => {
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


app.post('/loadData', async (req: Request, res: Response) => {
  const { userId }: IdProps = req.body

  const directories = await prisma.directory.findMany({
    where: {
      usersId: userId,
    },
    orderBy: {
      createdAt: 'asc',
    }
  })

  if (directories) {
    return res.send({ type: 1, directories: directories })
  } else {
    return res.send({ type: 0 })
  }
})

app.post('/createDirectory', async (req: Request, res: Response) => {
  const { name, id }: NameProps = req.body

  const directory = await prisma.directory.create({
    data: {
      name: name,
      usersId: id,
    }
  })

  if (directory) {
    return res.send({ type: 1 })
  } else {
    return res.send({ type: 0 })
  }
})

app.post('/loadNotes', async (req: Request, res: Response) => {
  const { user, directory }: NotesProps = req.body

  const notes = await prisma.notes.findMany({
    where: {
      usersId: user,
      directoryId: directory,
    },
    orderBy: {
      createdAt: 'asc',
    }
  })

  if (notes) {
    return res.send({ type: 1, notes: notes })
  } else {
    return res.send({ type: 0 })
  }
})

app.post('/createNote', async (req: Request, res: Response) => {
  const { userId, directoryId, title, content }: NoteTypes = req.body

  const note = await prisma.notes.create({
    data: {
      usersId: userId,
      directoryId: directoryId,
      title: title,
      content: content,
    }
  })
  if (note) {
    return res.send({ type: 1 })
  } else {
    return res.send({ type: 0 })
  }
})

app.post('/removeDirectory', async (req: Request, res: Response) => {
  const { user, directory }: DirectoryProps = req.body

  const removeNotes = await prisma.notes.deleteMany({
    where: {
      usersId: user,
      directoryId: directory,
    }
  })
  if(removeNotes){
    const removeDirectory = await prisma.directory.delete({
      where: {
        id: directory,
      }
    })
    if(removeDirectory){
      return res.send({type: 1})
    }else{
      return res.send({type: 0})
    }
  }else{
    return res.send({type: 0})
  }
})


app.post('/updateNote', async (req: Request, res: Response) => {
  const { id, title, content }: UpdateTypes = req.body

  const update = await prisma.notes.update({
    where: {
      id: id,
    },
    data: {
      title: title,
      content: content,
    }
  })

  if (update) {
    return res.send({ type: 1 })
  } else {
    return res.send({ type: 0 })
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