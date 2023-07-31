import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
const { cert } = admin.credential;

export async function verifyJwt(jwt: string) {
  if (!jwt || typeof jwt !== "string") {
    return new FirebaseResult(false, "jwt is missing or not a string.", "", "");
  }
  try {
    await makeSureFirebaseAppIsInitialized();
    const tokenVerificationResult = await getAuth().verifyIdToken(
      jwt,
      /* check if revoked */ true
    );
    return new FirebaseResult(
      true,
      "",
      tokenVerificationResult.uid,
      tokenVerificationResult.email ?? ""
    );
  } catch (err) {
    console.error("Something went wrong when verifying jwt.");
    console.error(err);
    return new FirebaseResult(false, "Firebase error", "", "");
  }
}

export async function createFirebaseUser(email: string, password?: string) {
  // TODO: We should probably verify integrity of email (xx@yy.zz) before sending it to firebase. 
  // This is already done in frontend but if this code is reached by code that doesn't validate email.
  const emailData = { email: email, emailVerified: false };
  const passwordData = { password: password };
  try {
    await makeSureFirebaseAppIsInitialized();
    const userRecord = await getAuth().createUser(password ? { ...emailData, ...passwordData } : { ...emailData })
    return new FirebaseResult(true, "", userRecord.uid, userRecord.email!);
  } catch (error: any) {
    console.error("Got error from firebase: ", error);
    if (error.errorInfo.code === "auth/email-already-exists") {
      console.error("Returning emailalreadyexists")
      return new FirebaseResult(false, "EmailAlreadyExists", "", "");
    }
    return new FirebaseResult(false, "Firebase error", "", "");
  }

  
}

async function makeSureFirebaseAppIsInitialized() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: cert(serviceAccountDetails as admin.ServiceAccount),
    });
  }
}
export class FirebaseResult {
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
