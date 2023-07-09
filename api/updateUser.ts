import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyJwt } from "./_authUser";
export default async function handler(  request: VercelRequest,
  response: VercelResponse,
) {
  console.log("Im called");
  if (request.method !== "GET") {
    return response.status(400).end();
  };

  const jwt = request.headers["app-id-token"];
  console.log("jwt is", jwt);
  if (!jwt || typeof jwt !== "string") {
    return response.status(400).send("jwt is missing.")
  };

  const authResult = await verifyJwt(jwt);
  console.log("auth result is", authResult);
  if (!authResult.success) {
    return response.status(401).send("User is not authenticated.")
  }

  return response.status(200).json({msg: "Success!!!!"})
}