import { z } from "zod";
import { Request, Response } from "express";
import { getAuthSession } from "./authController";
import { createNoteValidator } from "../validators/noteValidators";
import { createNewNote, getNoteById, removeNoteById, updateNoteById } from "../model/noteModel";

export async function createNote(req: Request, res: Response) {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { id, title, content } = createNoteValidator.parse({
      id: body.directoryId,
      title: body.title,
      content: body.content,
    });

    await createNewNote(session.id, id, title, content);

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't create note, try again later");
  }
}

export async function editNote(req: Request, res: Response) {
  const body = await req.body;
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    console.log(body)

    const { id, title, content } = createNoteValidator.parse({
      id: body.note,
      title: body.title,
      content: body.content,
    });

    const note = await getNoteById(id);
    if (!note) return res.status(404).send("Note not found");
    

    if (note.usersId !== session.id)
      return res.status(401).send("You are not the owner of this note");

    await updateNoteById(id, title, content);

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't create note, try again later");
  }
}

export async function removeNote(req: Request, res: Response) {
  try {
    const session = await getAuthSession(req);
    if (!session) return res.status(401).send("You are not authorized");

    const { id } = req.query;
    if (id === undefined) return res.status(404).send("An error occured");

    const note = await getNoteById(id.toString());
    if (!note) return res.status(404).send("Note not found");

    if (note.usersId !== session.id)
      return res.status(401).send("You are not the owner of this note");

    await removeNoteById(id.toString());

    return res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).send(error.errors[0].message);
    }
    return res.status(500).send("Couldn't remove note, try again later");
  }
}
