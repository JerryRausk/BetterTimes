export default class HttpService {
  static async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data: T = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${endpoint}: ${(error as Error).message}`);
    }
  }
}