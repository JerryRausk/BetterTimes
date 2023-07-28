import { getCurrentUser } from "vuefire";

export class HttpService {
  static async get<T>(
    endpoint: string,
    includeAppIdToken: boolean = false
  ): Promise<T> {
    let headers: { "app-id-token": string } | undefined = undefined;
    if (includeAppIdToken) {
      const idToken = await getAppIdTokenFromCurrentUser();
      headers = { "app-id-token": idToken };
    }
    try {
      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Failed to fetch data from ${endpoint}: ${(error as Error).message}`
      );
    }
  }

  static async post<T>(
    endpoint: string,
    postData: Record<string, any>,
    includeAppIdToken: boolean = false
  ): Promise<HttpResult<T>> {
    const headers = includeAppIdToken
      ? { "app-id-token": await getAppIdTokenFromCurrentUser() }
      : undefined;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { ...{ "Content-Type": "application/json" }, ...headers },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        console.warn("Http Post was not ok: ", response);
        return { success: false, data: null };
      }
      const obj: T = await response.json();
      return { success: true, data: obj };
    } catch (error) {
      console.warn(
        `Failed to fetch data from ${endpoint}: ${(error as Error).message}`
      );
      return { success: false, data: null };
    }
  }

  static async put(
    endpoint: string,
    postData: Record<string, any>,
    includeAppIdToken: boolean = false
  ): Promise<void> {
    const headers = includeAppIdToken
      ? { "app-id-token": await getAppIdTokenFromCurrentUser() }
      : undefined;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { ...{ "Content-Type": "application/json" }, ...headers },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return;
    } catch (error) {
      throw new Error(
        `Failed to fetch data from ${endpoint}: ${(error as Error).message}`
      );
    }
  }

  static async delete(
    endpoint: string,
    postData: Record<string, any>,
    includeAppIdToken: boolean = false
  ): Promise<void> {
    const headers = includeAppIdToken
      ? { "app-id-token": await getAppIdTokenFromCurrentUser() }
      : undefined;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { ...{ "Content-Type": "application/json" }, ...headers },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response when deleting was not ok");
      }

      return;
    } catch (error) {
      throw new Error(
        `Failed to delete data from ${endpoint}: ${(error as Error).message}`
      );
    }
  }
}

const getAppIdTokenFromCurrentUser = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return "";
  }
  const idToken = await user.getIdToken();
  return idToken ?? "";
};

interface HttpResult<T> {
  success: boolean;
  data: T | null;
}
