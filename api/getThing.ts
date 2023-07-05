import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export default function handler(  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === "GET") {
    /*
     This would be fetched from db using prisma as below
     --------------------------------------------
     const prisma = new PrismaClient();
     const thingFromDB = prisma.thing.findFirst()
     return response.status(200).send(list);
    */

    return response.status(200).send({id: 123, name: "TestName", createdDate: "2023-05-01T15:28:46.493Z"});
  }
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  });
}