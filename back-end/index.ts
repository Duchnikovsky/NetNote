import { Request, Response } from "express";
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { DecodedTypes, AuthTypes } from "./types/types";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

async function getAuthSession(req: Request) {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(
      token,
      process.env.SECRET_KEY,
      (error: string, decoded: DecodedTypes) => {
        if (error) {
          return false;
        }
        if (decoded.authenticated === true) {
          return decoded;
        } else {
          return false;
        }
      }
    );
  } else {
    return false;
  }
}

app.get("/getSession", async (req: Request, res: Response) => {
  const session = await getAuthSession(req);

  if (session) {
    return res.status(200).send(session);
  } else {
    return res.status(404).send(session);
  }
});

app.post("/signIn", async (req: Request, res: Response) => {
  const body = await req.body;

  try {
    const { email, password } = z
      .object({
        email: z.string().max(100).min(5),
        password: z.string().max(18).min(9),
      })
      .parse({
        email: body.email,
        password: body.password,
      });

    const session = await getAuthSession(req);

    if (session) {
      return res.status(401).send("You are already signed in");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) return res.status(422).send("Invalid email or password");

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) return res.status(422).send("Invalid email or password");

    const token = jwt.sign(
      { authenticated: true, id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    res.cookie("token", token, {
      sameSite: "none",
      domain: "localhost:3001",
      secure: true,
      httpOnly: true,
      maxAge: 36000000,
    });

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).send("Invalid email or password");
    }
    return res.status(500).send("Could not sign in, try again later");
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
