import { AxiosInstance } from "axios";

export class Interface {
  constructor(private httpClient: AxiosInstance) {}

  async getEthernet() {
    const response = await this.httpClient.get("/interface/ethernet");
    return response.data;
  }

  async getVlan() {
    const response = await this.httpClient.get("/interface/vlan");
    return response.data;
  }
}
