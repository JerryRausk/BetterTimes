import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyJwt } from "./_authUser";
export default async function handler(  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "GET") {
    return response.status(400).end();
  };

  const jwt = request.headers["app-id-token"];
  if (!jwt || typeof jwt !== "string") {
    return response.status(400).send("jwt is missing.")
  };

  const authResult = await verifyJwt(jwt);
  if (!authResult.success) {
    return response.status(401).send("User is not authenticated.")
  }

  return response.status(200).json({msg: "Success!!!!"})
}