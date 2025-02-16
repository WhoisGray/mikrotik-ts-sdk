import { AxiosInstance } from "axios";

export class System {
  constructor(private httpClient: AxiosInstance) {}

  async getIdentity() {
    const response = await this.httpClient.get("/system/identity");
    return response.data;
  }

  async getResource() {
    const response = await this.httpClient.get("/system/resource");
    return response.data;
  }
}
