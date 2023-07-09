import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    return response.status(400).end();
  }

  const prisma = new PrismaClient();
  prisma.user.create({data: {
    email: request.body.userEmail
  }}).then(async (user) => {
    prisma.$disconnect();
    return response.status(201).send(`User ${user.email} created ad ${user.created}`)
  }).catch((error) => {
    prisma.$disconnect();
    console.error(error);
    return response.status(500).end();
  })
}