import { PrismaClient } from "@prisma/client";
export async function canModifyTimeCode(userId: number, organizationId: number, prismaClient: PrismaClient) {
  return isOrgAdmin(userId, organizationId, prismaClient);
}

export async function canModifyOrganization(userId: number, organizationId: number, prismaClient: PrismaClient) {
  return isOrgAdmin(userId, organizationId, prismaClient);
}


async function isOrgAdmin(userId: number, organizationId: number, prismaClient: PrismaClient) {
  const user = await prismaClient.organizationRole.findFirst({where: {
    userId: userId,
    organizationId: organizationId,
    role: 1
  }});
  return Boolean(user);
}