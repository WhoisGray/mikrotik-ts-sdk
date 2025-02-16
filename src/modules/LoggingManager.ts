import { AxiosInstance } from "axios";
import { LogAction, LogRule, SystemResources } from "../types";

export class LoggingManager {
  constructor(private httpClient: AxiosInstance) {}

  async getLogs(): Promise<any[]> {
    const response = await this.httpClient.get("/log");
    return response.data;
  }

  async addLogRule(rule: LogRule): Promise<any> {
    const response = await this.httpClient.post("/system/logging/add", rule);
    return response.data;
  }

  async removeLogRule(id: string): Promise<any> {
    const response = await this.httpClient.delete(`/system/logging/${id}`);
    return response.data;
  }

  async getLogRules(): Promise<any[]> {
    const response = await this.httpClient.get("/system/logging");
    return response.data;
  }

  async addLogAction(action: LogAction): Promise<any> {
    const response = await this.httpClient.post(
      "/system/logging/action/add",
      action
    );
    return response.data;
  }

  async removeLogAction(id: string): Promise<any> {
    const response = await this.httpClient.delete(
      `/system/logging/action/${id}`
    );
    return response.data;
  }

  async getLogActions(): Promise<any[]> {
    const response = await this.httpClient.get("/system/logging/action");
    return response.data;
  }

  async getSystemResources(): Promise<SystemResources> {
    const response = await this.httpClient.get("/system/resource");
    return response.data; // Assuming it returns an array with one item
  }
}
