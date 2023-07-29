import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyJwt } from "./_authUser";
import { canModifyOrganization } from "./_authorization";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const prisma = new PrismaClient();
  if (request.method === "GET") {
    return handleGet(request, response, prisma);
  }
  if (request.method === "PUT") {
    return handlePut(request, response, prisma);
  }
  return response.status(400).send("Method not allowed.");
}

const handleGet = async (
  request: VercelRequest,
  response: VercelResponse,
  prismaClient: PrismaClient
) => {
  const jwt = request.headers["app-id-token"];
  if (!jwt || typeof jwt !== "string") {
    return response.status(400).send("jwt is missing.");
  }
  const authResult = await verifyJwt(jwt);
  if (!authResult.success) {
    return response.status(401).send("User is not authenticated.");
  }

  prismaClient.user
    .findFirst({
      where: {
        email: authResult.email,
      },
    })
    .then(async (user) => {
      // Check if user exists
      if (!user) {
        console.warn("Authed user was not found in db: ", authResult.email);
        prismaClient.$disconnect();
        return response
          .status(404)
          .send(`User ${authResult.email} was not found.`);
      }

      prismaClient.organization.findFirst({where:{id: user.organizationId}}).then((org) => {
        prismaClient.$disconnect();
        if(!org) {
          
          return response.status(404).send(`Organization with id ${user.organizationId} could not be found.`)
        };
        return response.status(200).send(org);
      }).catch((error) => {
        prismaClient.$disconnect();
        console.error(`Could not get org ${user.organizationId} from db, got error ${error}`);
        return response.status(500).send("Could not get organization");
      })
    })
    .catch((error) => {
      console.error("Couldnt read user from db, ", error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
};

const handlePut = async (
  request: VercelRequest,
  response: VercelResponse,
  prismaClient: PrismaClient
) => {
  const jwt = request.headers["app-id-token"];
  if (!jwt || typeof jwt !== "string") {
    return response.status(400).send("jwt is missing.");
  }
  const authResult = await verifyJwt(jwt);
  if (!authResult.success) {
    return response.status(401).send("User is not authenticated.");
  }

  prismaClient.user
    .findFirst({
      where: {
        email: authResult.email,
      },
    })
    .then(async (user) => {
      // Check if user exists
      if (!user) {
        console.warn("Authed user was not found in db: ", authResult.email);
        prismaClient.$disconnect();
        return response
          .status(404)
          .send(`User ${authResult.email} was not found.`);
      }

      // Check if user is authorized
      const isAuthorized = canModifyOrganization(
        user.id,
        user.organizationId,
        prismaClient
      );
      if (!isAuthorized) {
        console.warn(
          `User ${user.email} is not authorized to modify organization`
        );
        prismaClient.$disconnect();
        return response.status(401).end();
      }

      // Act
      prismaClient.organization
        .update({
          where: { id: request.body.id },
          data: { name: request.body.orgName },
        })
        .then((org) => {
          prismaClient.$disconnect();
          return response.status(200).send(org);
        })
        .catch((error) => {
          prismaClient.$disconnect();
          console.error("Couldn't update organization", error);
          return response.status(500).send("Couldn't update organization");
        });
    })
    .catch((error) => {
      console.error("Couldnt read user from db, ", error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
};
