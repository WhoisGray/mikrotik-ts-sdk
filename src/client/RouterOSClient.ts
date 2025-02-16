import axios, { AxiosInstance } from "axios";
import { Config } from "../types";
import { UserManager } from "../modules/UserManager";
import { System } from "../modules/System";
import { Interface } from "../modules/Interface";
import { PPP } from "../modules/PPP";
import { errorHandler } from "../utils/error-handler";
import { DEFAULT_TIMEOUT } from "../constants";
import { LoggingManager } from "../modules/LoggingManager";

export class RouterOSClient {
  private httpClient: AxiosInstance;
  public userManager: UserManager;
  public system: System;
  public interface: Interface;
  public ppp: PPP;
  public logging: LoggingManager;

  constructor(private config: Config) {
    this.httpClient = this.createHttpClient();
    this.userManager = new UserManager(this.httpClient);
    this.system = new System(this.httpClient);
    this.interface = new Interface(this.httpClient);
    this.ppp = new PPP(this.httpClient);
    this.logging = new LoggingManager(this.httpClient);
  }

  private createHttpClient(): AxiosInstance {
    const client = axios.create({
      baseURL: `https://${this.config.host}/rest`,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      timeout: this.config.timeout || DEFAULT_TIMEOUT,
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => errorHandler(error)
    );

    return client;
  }
}
