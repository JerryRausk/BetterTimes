import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (!request.body.userEmail) {
    return response.status(400).send("userEmail is missing.");
  }

  const prismaClient = new PrismaClient();
  prismaClient.organization
    .create({
      data: {
        name: request.body.userEmail
      }
    })
    .then((organization) => {
      prismaClient.user
        .create({
          data: {
            email: request.body.userEmail,
            organizationId: organization.id,
          }
        })
        .then((user) => {
          prismaClient.organizationRole
            .create({
              data: {
                role: 1,
                userId: user.id,
                organizationId: organization.id
              }
            })
            .then(() => {
              prismaClient.$disconnect();
              return response.status(201).send("User, organization and organization role succesfully created");
            })
            .catch(() => {
              prismaClient.organization.delete({where:{id: organization.id}}) // Should cascade to delete user as well
              prismaClient.$disconnect();
              return response.status(500).send("Couldn't add new user as admin to new organization.")
            })
        })
        .catch(() => {
          prismaClient.organization.delete({where:{id: organization.id}});
          prismaClient.$disconnect();
          return response.status(500).send("Couldn't create new organization.")
        })
    })
    .catch(() => {
      prismaClient.$disconnect();
      return response.status(500).send("Couldn't create new user.")
    });
};
