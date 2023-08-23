import { Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { AuthSession, DecodedTypes } from "./types/types";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

async function getAuthSession(req: Request): Promise<AuthSession> {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(
        token,
        process.env.SECRET_KEY,
        (error: string, decoded: DecodedTypes) => {
          if (error) {
            resolve(false);
          }
          if (decoded.authenticated === true) {
            resolve(decoded);
          } else {
            resolve(false);
          }
        }
      );
    } else {
      resolve(false);
    }
  });
}

app.get("/getSession", async (req: Request, res: Response) => {
  const session = await getAuthSession(req);

  if (session) {
    return res.status(200).send(session);
  } else {
    return res.status(401).send(session);
  }
});

app.post("/signIn", async (req: Request, res: Response) => {
  const body = await req.body;

  try {
    const { email, password } = z
      .object({
        email: z
          .string()
          .max(100)
          .min(5, { message: "Email has to be valid" })
          .email(),
        password: z
          .string()
          .max(18)
          .min(8, { message: "Password must be between 8-18 characters" }),
      })
      .parse({
        email: body.email,
        password: body.password,
      });

    const session = await getAuthSession(req);

    if (session) {
      return res.status(403).send("You are already signed in");
    }

    const user = await prisma.netUser.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) return res.status(400).send("Invalid email or password");

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) return res.status(400).send("Invalid email or password");

    const token = jwt.sign(
      { authenticated: true, id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    res.cookie('token', token, {
      sameSite: "none",
      domain: "netnote-api.vercel.app",
      secure: true,
      httpOnly: true,
      maxAge: 36000000,
    });
    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send("Invalid email or password");
    }
    return res.status(500).send("Could not sign in, try again later");
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  const body = await req.body;

  try {
    const { email, password } = z
      .object(
        {
          email: z
            .string()
            .max(100)
            .min(5, { message: "Email has to be valid" })
            .email(),
          password: z
            .string()
            .max(18)
            .min(8, { message: "Password must be between 8-18 characters" }),
        },
        { description: "ahaha" }
      )
      .parse({
        email: body.email,
        password: body.password,
      });

    const user = await prisma.netUser.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(406).send("This email is already taken");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await prisma.netUser.create({
      data: {
        email: email,
        password: hashedPass,
      },
    });

    const newDirectory = await prisma.directory.create({
      data: {
        usersId: newUser.id,
        name: "Main directory",
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could not sign in, try again later");
  }
});

app.post("/signOut", async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const token = req.cookies.token;
    if (token) {
      res.clearCookie("token");
    }

    return res.status(200).send("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could sign out, try again later");
  }
});

app.get("/getDirectories", async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const directories = await prisma.directory.findMany({
      where: {
        usersId: session.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).send(JSON.stringify(directories));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could fetch directories, try again later");
  }
});

app.get("/getDirectory", async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const id = req.query.id;

    if (id === undefined) {
      return res.status(404).send("An error occured");
    }

    const directory = await prisma.directory.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!directory) {
      return res.status(404).send("There is no such directory");
    }

    if (directory.usersId !== session.id) {
      return res.status(401).send("You are not owner of this directory");
    }

    const notes = await prisma.notes.findMany({
      where: {
        directoryId: id.toString(),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .send(JSON.stringify({ notes: notes, directory: directory }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could fetch directory, try again later");
  }
});

app.post("/createDirectory", async (req: Request, res: Response) => {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const { name } = z
      .object({
        name: z
          .string()
          .min(3, { message: "Directory name must be between 3-16 characters" })
          .max(16, {
            message: "Directory name must be between 3-16 characters",
          }),
      })
      .parse({
        name: body.name,
      });

    await prisma.directory.create({
      data: {
        name: name,
        usersId: session.id,
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could create directory, try again later");
  }
});

app.put("/editDirectory", async (req: Request, res: Response) => {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const { id, name } = z
      .object({
        id: z.string(),
        name: z
          .string()
          .min(3, { message: "Directory name must be between 3-16 characters" })
          .max(16, {
            message: "Directory name must be between 3-16 characters",
          }),
      })
      .parse({
        id: body.id,
        name: body.name,
      });

    await prisma.directory.update({
      data: {
        name: name,
      },
      where: {
        id: id,
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could update directory, try again later");
  }
});

app.delete("/removeDirectory", async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const id = req.query.id;

    if (id === undefined) {
      return res.status(404).send("An error occured");
    }

    const directory = await prisma.directory.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!directory) {
      return res.status(411).send("There is not such directory");
    }

    if (directory?.usersId !== session.id) {
      return res.status(401).send("You are not owner of this directory");
    }

    await prisma.notes.deleteMany({
      where: {
        directoryId: id.toString(),
      },
    });

    await prisma.directory.delete({
      where: {
        id: id.toString(),
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could not remove directory, try again later");
  }
});

app.post("/createNote", async (req: Request, res: Response) => {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const { id, title, content } = z
      .object({
        id: z.string(),
        title: z
          .string()
          .min(3, { message: "Note title must be between 3-16 characters" })
          .max(16, {
            message: "Note title must be between 3-16 characters",
          }),
        content: z
          .string()
          .min(1, { message: "Note can't be empty" })
          .max(1000, { message: "Note can't be longer than 1000 characters" }),
      })
      .parse({
        id: body.directoryId,
        title: body.title,
        content: body.content,
      });

    await prisma.notes.create({
      data: {
        title: title,
        content: content,
        directoryId: id,
        usersId: session.id,
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could create note, try again later");
  }
});

app.put("/editNote", async (req: Request, res: Response) => {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const { id, title, content } = z
      .object({
        id: z.string(),
        title: z
          .string()
          .min(3, { message: "Note title must be between 3-16 characters" })
          .max(16, {
            message: "Note title must be between 3-16 characters",
          }),
        content: z
          .string()
          .min(1, { message: "Note can't be empty" })
          .max(1000, { message: "Note can't be longer than 1000 characters" }),
      })
      .parse({
        id: body.note,
        title: body.title,
        content: body.content,
      });

    const note = await prisma.notes.findFirst({
      where: {
        id: id,
      },
    });

    if (!note) {
      return res.status(411).send("There is not such note");
    }

    if (note?.usersId !== session.id) {
      return res.status(401).send("You are not owner of this note");
    }

    await prisma.notes.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        content: content,
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could update directory, try again later");
  }
});

app.delete("/removeNote", async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession(req);

    if (!session) {
      return res.status(401).send("You are not authorized");
    }

    const id = req.query.id;

    if (id === undefined) {
      return res.status(404).send("An error occured");
    }

    const note = await prisma.notes.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!note) {
      return res.status(411).send("There is not such note");
    }

    if (note?.usersId !== session.id) {
      return res.status(401).send("You are not owner of this note");
    }

    await prisma.notes.delete({
      where: {
        id: id.toString(),
      },
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could not remove directory, try again later");
  }
});

async function cleanup() {
  await prisma.$disconnect();
  console.log("Prisma client disconnected.");
}

process.on("beforeExit", async () => {
  await cleanup();
});

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
