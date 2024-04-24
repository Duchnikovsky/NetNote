import { prisma } from "..";

export async function getNotesByDirectoryId(directoryId: string) {
  const notes = await prisma.notes.findMany({
    where: {
      directoryId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return notes;
}

export async function createNewNote(
  usersId: string,
  directoryId: string,
  title: string,
  content: string
) {
  await prisma.notes.create({
    data: {
      usersId,
      title,
      content,
      directoryId,
    },
  });

  return;
}

export async function getNoteById(id: string) {
  const note = prisma.notes.findFirst({
    where: {
      id,
    },
  });

  return note;
}

export async function updateNoteById(
  id: string,
  title: string,
  content: string
) {
  await prisma.notes.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });

  return;
}

export async function removeNoteById(id: string) {
  await prisma.notes.delete({
    where: {
      id,
    },
  });

  return;
}
