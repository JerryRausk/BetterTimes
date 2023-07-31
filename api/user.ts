import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyJwt } from "./_firebase";
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
      prismaClient.$disconnect();
      return response.status(200).send(user);
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

  prismaClient.user.update({
    where: { email: authResult.email },
    data: {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      role: request.body.role,
    },
  }).then(async () => {
    prismaClient.$disconnect();
    return response.status(200).end();
  }).catch(async () => {
    prismaClient.$disconnect();
    return response.status(500).send("Couldnt update user.")
  });
};