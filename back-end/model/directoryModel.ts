import { prisma } from "..";

export async function getUserDirectories(userId: string) {
  const directories = await prisma.directory.findMany({
    where: {
      usersId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return directories;
}

export async function getDirectoryById(id: string) {
  const directory = await prisma.directory.findFirst({
    where: {
      id: id,
    },
  });

  return directory;
}

export async function createNewDirectory(name: string, id: string) {
  await prisma.directory.create({
    data: {
      name,
      usersId: id,
    },
  });

  return;
}

export async function editDirectoryById(id: string, name: string) {
  await prisma.directory.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return;
}

export async function removeDirectoryById(id: string) {
  await prisma.notes.deleteMany({
    where: {
      directoryId: id,
    },
  });

  await prisma.directory.delete({
    where: {
      id,
    },
  });

  return;
}
