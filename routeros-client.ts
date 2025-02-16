import axios, { AxiosInstance } from "axios";
import * as types from "./types";

export class RouterOSClient {
  private httpClient: AxiosInstance;

  constructor(private config: types.Config) {
    // Initialize Axios instance
    this.httpClient = axios.create({
      baseURL: `https://${this.config.host}/rest`,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false, // For self-signed certificates
      }),
    });

    this.httpClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.log("%c⧭", "color: #00e600", "asd");
        if (error.response) {
          console.error(
            `Request failed with status code ${error.response.status}:`,
            error.response.data
          );
          throw error.response.data;
        } else if (error.request) {
          console.error("Request failed:", error.request);
        } else {
          console.error("Error:", error.message);
        }
        throw error;
      }
    );
  }
  /**
   * Fetch all user
   */
  async getUsers(): Promise<types.User[]> {
    const response = await this.httpClient.get("/user-manager/user");
    return response.data;
  }

  /**
   * Add new user
   */
  async addUser(newUser: types.AddUser): Promise<void> {
    try {
      const response = await this.httpClient.put("/user-manager/user", newUser);
      console.log(`Added user: ${response.data.name}`);
    } catch (error: any) {
      console.error(`Error adding user: ${newUser.name}`, error.message);
      throw error;
    }
  }

  /**
   * Fetch and sort user profiles by state.
   */
  async getUserProfiles(): Promise<types.UserProfile[]> {
    try {
      const response = await this.httpClient.get<types.UserProfile[]>(
        "/user-manager/user-profile"
      );

      if (response.data && response.data.length > 0) {
        // Sort by state priority: [waiting, running-active, active, used]
        response.data.sort((a, b) => {
          const states = ["waiting", "running-active", "active", "used"];
          return states.indexOf(a.state) - states.indexOf(b.state);
        });
        return response.data;
      } else {
        console.log("No user profiles found.");
        return [];
      }
    } catch (error: any) {
      console.error("Error fetching user profiles:", error.message);
      throw error;
    }
  }

  /**
   * Fetch all Profile limitations
   */

  async getProfileLimitations(): Promise<types.ProfileLimitation[]> {
    const response = await this.httpClient.get(
      "/user-manager/profile-limitation"
    );
    return response.data;
  }
  /**
   * Delete a user profile by ID.
   */
  async deleteUserProfile(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/user-manager/user-profile/${id}`);
      console.log(`Deleted user profile with ID: ${id}`);
    } catch (error: any) {
      console.error(
        `Error deleting user profile with ID ${id}:`,
        error.message
      );
    }
  }

  /**
   * System -> Identity
   *
   */
  async getSystemIdentity() {
    const response = await this.httpClient.get("/system/identity");
    return response.data;
  }

  /**
   * System -> Resource
   *
   */
  async getSystemResource() {
    const response = await this.httpClient.get("/system/resource");
    return response.data;
  }

  /**
   * Interface -> Ethernet
   *
   */
  async getInterfaceEthernet() {
    const response = await this.httpClient.get("/interface/ethernet");
    return response.data;
  }

  /**
   * Interface -> Vlan
   *
   */
  async getInterfaceVlan() {
    const response = await this.httpClient.get("/interface/vlan");
    return response.data;
  }

  /**
   * PPP -> Active List
   *
   */
  async getPPPActive() {
    const response = await this.httpClient.get("/ppp/active");
    return response.data;
  }

  /**
   * Remove user sessions where active = no
   */
  async removeInactiveSessions(): Promise<void> {
    try {
      // Fetch all sessions
      const response = await this.httpClient.get("/user-manager/session");
      const sessions = response.data;

      // Filter sessions where active = "no"
      const inactiveSessions = sessions.filter(
        (session: any) => session.active === "no"
      );

      if (inactiveSessions.length === 0) {
        console.log("No inactive sessions to remove.");
        return;
      }

      // Remove each inactive session
      for (const session of inactiveSessions) {
        await this.httpClient.post("/user-manager/session/remove", {
          ".id": session[".id"],
        });
        console.log(`Removed session with ID: ${session[".id"]}`);
      }

      console.log("All inactive sessions have been removed.");
    } catch (error: any) {
      console.error("Error removing inactive sessions:", error.message);
      throw error;
    }
  }

  async getActiveSessions() {
    const response = await this.httpClient.get("/user-manager/session");
    return response.data;
  }
}
