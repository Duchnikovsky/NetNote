import { prisma } from "..";

export async function getUserByEmail(email: string) {
  const user = await prisma.netUser.findFirst({
    where: {
      email,
    },
  });

  return user;
}

export async function createUser(email: string, password: string) {
  const user = await prisma.netUser.create({
    data: {
      email,
      password,
    },
  });

  await prisma.directory.create({
    data: {
      usersId: user.id,
      name: "Main Directory",
    },
  });

  return user;
}
