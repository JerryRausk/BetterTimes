import * as admin from "firebase-admin";
import firebaseAdmin, { ServiceAccount } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
const { cert } = firebaseAdmin.credential;

export async function verifyJwt(jwt: string) {
  if (!jwt || typeof jwt !== "string") {
    return new AuthenticationResult(
      false,
      "jwt is missing or not a string.",
      "",
      ""
    );
  }
  try {
    if(admin.apps.length === 0) {
      admin.initializeApp({
        credential: cert(serviceAccountDetails as ServiceAccount),
      });
    }

    const tokenVerificationResult = await getAuth().verifyIdToken(
      jwt,
      /* check if revoked */ true
    );
    return new AuthenticationResult(
      true,
      "",
      tokenVerificationResult.uid,
      tokenVerificationResult.email ?? ""
    );
  } catch (err) {
    console.error("Something went wrong when verifying jwt.");
    console.error(err);
    return new AuthenticationResult(false, "Internal error", "", "");
  }
}

export class AuthenticationResult {
  success: boolean;
  msg: string;
  uid: string;
  email: string;

  constructor(success: boolean, msg: string, uid: string, email: string) {
    (this.success = success),
      (this.msg = msg),
      (this.uid = uid),
      (this.email = email);
  }
}

const serviceAccountDetails = {
  type: process.env.FIREBASE_ADMIN_CERT_type!,
  project_id: process.env.FIREBASE_ADMIN_CERT_project_id!,
  private_key_id: process.env.FIREBASE_ADMIN_CERT_private_key_id!,
  private_key: process.env.FIREBASE_ADMIN_CERT_private_key!,
  client_email: process.env.FIREBASE_ADMIN_CERT_client_email!,
  client_id: process.env.FIREBASE_ADMIN_CERT_client_id!,
  auth_uri: process.env.FIREBASE_ADMIN_CERT_auth_uri!,
  token_uri: process.env.FIREBASE_ADMIN_CERT_token_uri!,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_CERT_auth_provider_x509_cert_url!,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CERT_client_x509_cert_url!,
  universe_domain: process.env.FIREBASE_ADMIN_CERT_universe_domain!,
};
