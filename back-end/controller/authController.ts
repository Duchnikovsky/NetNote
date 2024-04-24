import { Request, Response } from "express";
import { DecodedTypes } from "../types/types";
import { z } from "zod";
import { signInValidator, signUpValidator } from "../validators/authValidators";
import { createUser, getUserByEmail } from "../model/authModel";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export type AuthSession = DecodedTypes | false;
export async function getAuthSession(req: Request): Promise<AuthSession> {
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

export async function getSession(req: Request, res: Response) {
  const session = await getAuthSession(req);
  if (session) {
    return res.status(200).send(session);
  } else {
    return res.status(401).send(session);
  }
}

export async function signIn(req: Request, res: Response) {
  const body = await req.body;
  try {
    const { email, password } = signInValidator.parse({
      email: body.email,
      password: body.password,
    });

    const session = await getAuthSession(req);

    if (session) {
      return res.status(401).send("You are already signed in");
    }

    const user = await getUserByEmail(email);
    if (!user) return res.status(400).send("Invalid email or password");

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) return res.status(400).send("Invalid email or password");

    const token = jwt.sign(
      { authenticated: true, id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    res.cookie("token", token, {
      // sameSite: "none",
      // domain: "netnote-api.vercel.app",
      secure: true,
      // httpOnly: true,
      maxAge: 36000000,
    });

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send("Invalid email or password");
    }
    return res.status(500).send("Could not sign in, try again later");
  }
}

export async function signUp(req: Request, res: Response) {
  const body = await req.body;
  try {
    const { email, password } = signUpValidator.parse({
      email: body.email,
      password: body.password,
    });

    const user = await getUserByEmail(email);
    if (user) return res.status(409).send("This email is already taken");

    const hashedPass = await bcrypt.hash(password, 10);
    await createUser(email, hashedPass);

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could not sign up, try again later");
  }
}

export async function signOut(req: Request, res: Response) {
  try {
    const session = await getAuthSession(req);

    if (!session) return res.status(401).send("You aren't signed in");

    const token = req.cookies.token;
    if (token) res.clearCookie("token");

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Could sign out, try again later");
  }
}
