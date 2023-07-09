export class HttpService {
  static async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    try {
      const response = await fetch(endpoint, {headers});
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data: T = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${endpoint}: ${(error as Error).message}`);
    }
  }

  static async post(endpoint: string, postData: Record<string, any>): Promise<void> {
    try {
      const response = await fetch(
        endpoint, 
        {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${endpoint}: ${(error as Error).message}`);
    }
  }
}