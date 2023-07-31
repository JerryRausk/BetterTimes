import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { canModifyTimeCode } from "./_authorization";
import { verifyJwt } from "./_firebase";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const prisma = new PrismaClient();
  if (request.method === "GET") {
    return handleGet(request, response, prisma);
  }
  if (request.method === "POST") {
    return handlePost(request, response, prisma);
  }
  if (request.method === "DELETE") {
    return handleDelete(request, response, prisma);
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
    .findFirst({ where: { email: authResult.email } })
    .then((user) => {
      if (user) {
        prismaClient.timeCode
          .findMany({ where: { organizationId: user.organizationId } })
          .then((timeCodes) => {
            prismaClient.$disconnect();
            return response.status(200).send(timeCodes);
          })
          .catch((error) => {
            prismaClient.$disconnect();
            console.error(error);
            return response.status(500).end();
          });
      } else {
        prismaClient.$disconnect();
        return response.status(404).send("User not found.");
      }
    })
    .catch((error) => {
      console.error(error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
};

const handlePost = async (
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
      if (!user) {
        console.warn("Authed user was not found in db: ", authResult.email);
        prismaClient.$disconnect();
        return response
          .status(404)
          .send(`User ${authResult.email} was not found.`);
      }

      const isAuthorized = await canModifyTimeCode(
        user.id,
        user.organizationId,
        prismaClient
      );
      if (!isAuthorized) {
        console.warn(
          `User ${user.email} is not authorized to modify timecodes`
        );
        prismaClient.$disconnect();
        return response.status(401).end();
      }

      prismaClient.timeCode
        .upsert({
          where: {
            id: request.body.id,
          },
          update: {
            code: parseInt(request.body.code),
            name: request.body.name,
            description: request.body.description,
            organizationId: user.organizationId,
          },
          create: {
            code: parseInt(request.body.code),
            name: request.body.name,
            description: request.body.description,
            organizationId: user.organizationId,
          },
        })
        .then((timeCode) => {
          prismaClient.$disconnect();
          return response.status(200).send(timeCode);
        })
        .catch((error) => {
          console.error("Couldn't upsert timecode to db, ", error);
          prismaClient.$disconnect();
          return response.status(500).end();
        });
    })
    .catch((error) => {
      console.error("Couldnt read user from db, ", error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
};

const handleDelete = async (
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
      if (!user) {
        console.warn("Authed user was not found in db: ", authResult.email);
        prismaClient.$disconnect();
        return response
          .status(404)
          .send(`User ${authResult.email} was not found.`);
      }

      const isAuthorized = await canModifyTimeCode(
        user.id,
        user.organizationId,
        prismaClient
      );
      if (!isAuthorized) {
        console.warn(
          `User ${user.email} is not authorized to modify timecodes`
        );
        prismaClient.$disconnect();
        return response.status(401).end();
      }

      prismaClient.timeCode
        .delete({
          where: {
            id: request.body.id,
          },
        })
        .then(() => {
          prismaClient.$disconnect();
          return response.status(200).end();
        })
        .catch((error) => {
          console.error("Couldn't delete timecode from db, ", error);
          prismaClient.$disconnect();
          return response.status(500).end();
        });
    })
    .catch((error) => {
      console.error("Couldnt read user from db, ", error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
};
