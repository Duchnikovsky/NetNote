import { Request, Response } from "express";
import { z } from "zod";
import { getAuthSession } from "./authController";
import {
  createNewDirectory,
  editDirectoryById,
  getDirectoryById,
  getUserDirectories,
  removeDirectoryById,
} from "../model/directoryModel";
import { getNotesByDirectoryId } from "../model/noteModel";
import {
  createDirectoryValidator,
  editDirectoryValidator,
} from "../validators/directoryValidators";

export async function getDirectories(req: Request, res: Response) {
  try {
    const session = await getAuthSession(req);

    if (!session) return res.status(401).send("You are not authorized");

    const directories = await getUserDirectories(session.id);

    return res.status(200).send(JSON.stringify(directories));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't fetch directories, try again later");
  }
}

export async function getDirectory(req: Request, res: Response) {
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { id } = req.query;
    if (id === undefined) return res.status(404).send("An error occured");

    const directory = await getDirectoryById(id.toString());
    if (!directory) return res.status(409).send("There is not such directory");

    if (directory.usersId !== session.id)
      return res.status(401).send("You are not owner of this directory");

    const notes = await getNotesByDirectoryId(id.toString());

    return res
      .status(200)
      .send(JSON.stringify({ notes: notes, directory: directory }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't fetch directory, try again later");
  }
}

export async function createDirectory(req: Request, res: Response) {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { name } = createDirectoryValidator.parse({
      name: body.name,
    });

    await createNewDirectory(name, session.id);

    return res.status(200).send("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't create directory, try again later");
  }
}

export async function editDirectory(req: Request, res: Response) {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { id, name } = editDirectoryValidator.parse({
      id: body.id,
      name: body.name,
    });

    await editDirectoryById(id, name);

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't update directory, try again later");
  }
}

export async function removeDirectory(req: Request, res: Response) {
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { id } = req.query;
    if (id === undefined) return res.status(404).send("An error occured");

    const directory = await getDirectoryById(id.toString());
    if (!directory) return res.status(409).send("There is not such directory");

    if (directory.usersId !== session.id)
      return res.status(401).send("You are not owner of this directory");

    await removeDirectoryById(id.toString());
    
    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't remove directory, try again later");
  }
}
