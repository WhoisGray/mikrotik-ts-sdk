import { AxiosInstance } from "axios";

export class PPP {
  constructor(private httpClient: AxiosInstance) {}

  async getActive() {
    const response = await this.httpClient.get("/ppp/active");
    return response.data;
  }
}
