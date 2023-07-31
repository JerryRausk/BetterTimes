import { PrismaClient } from "@prisma/client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { canAddOrganizationUser } from "./_authorization";
import { createFirebaseUser, verifyJwt } from "./_firebase";
export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (!request.body.email) {
    return response.status(400).send("email is missing.");
  }

  const jwt = request.headers["app-id-token"];
  if (!jwt || typeof jwt !== "string") {
    return response.status(400).send("jwt is missing.");
  }
  const authResult = await verifyJwt(jwt);
  if (!authResult.success) {
    return response.status(401).send("User is not authenticated.");
  }

  const prismaClient = new PrismaClient();
  //
  prismaClient.user
    .findFirst({
      where: {
        email: authResult.email,
      },
    })
    .then(async (requestingUser) => {
      if (!requestingUser) {
        console.warn("Authed user was not found in db: ", authResult.email);
        prismaClient.$disconnect();
        return response
          .status(404)
          .send(`User ${authResult.email} was not found.`);
      }

      const isAuthorized = await canAddOrganizationUser(
        requestingUser.id,
        requestingUser.organizationId,
        prismaClient
      );
      if (!isAuthorized) {
        console.warn(
          `User ${requestingUser.email} is not authorized to add new users to the organization`
        );
        prismaClient.$disconnect();
        return response.status(401).end();
      }

      createFirebaseUser(request.body.email, request.body.password)
      .then((res) => {
        if (!res.success) {
          if (res.msg === "EmailAlreadyExists") {
            return response.status(400).send({error: res.msg})
          } else {
            return response.status(500).send({error: "Oops"})
          }
        }

        prismaClient.user
          .create({
            data: {
              email: request.body.email,
              organizationId: requestingUser.organizationId,
              firstName: request.body.firstName,
              lastName: request.body.lastName,
              role: request.body.role,
            },
          })
          .then((createdUser) => {
            prismaClient.organizationRole
              .create({
                data: {
                  role: 2, // User
                  userId: createdUser.id,
                  organizationId: createdUser.organizationId,
                },
              })
              .then(() => {
                prismaClient.$disconnect();
                console.log(`User ${requestingUser.email} created user ${createdUser.email} for organization ${requestingUser.organizationId}`);
                return response
                  .status(201)
                  .send("User and organization role succesfully created");
              })
              .catch((error) => {
                prismaClient.$disconnect();
                console.error(`Could not create record of organization role for user ${createdUser.email}(${createdUser.id}), error: `, error)
                return response
                  .status(500)
                  .send("Couldn't add new user as admin to new organization.");
              });
          })
          .catch(() => {
            // TODO: Delete firebase user if we cant create it in our DB.
            prismaClient.$disconnect();
            return response.status(500).send("User could not be created.")
          });
      })
      .catch((error) => {
        prismaClient.$disconnect();
        console.error("Could not create user with firebase, error: ", error);
        return response.status(500).send("User could not be created");
      });
    })
    .catch((error) => {
      console.error("Couldnt read user from db, ", error);
      prismaClient.$disconnect();
      return response.status(500).end();
    });
}
