import { PrismaClient } from "@prisma/client";
export async function canModifyTimeCode(userId: number, organizationId: number, prismaClient: PrismaClient) {
  /* User is part of organization and has admin role */
  const user = await prismaClient.organizationRole.findFirst({where: {
    userId: userId,
    organizationId: organizationId,
    role: 1
  }});
  return Boolean(user);
}