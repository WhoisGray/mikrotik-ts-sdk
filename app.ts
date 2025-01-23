import axios, { AxiosInstance } from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
  host: string;
  username: string;
  password: string;
}

interface UserProfile {
  ".id": string;
  "end-time": string;
  profile: string;
  state: "waiting" | "running-active" | "active" | "used";
  user: string;
}

class RouterOSClient {
  private httpClient: AxiosInstance;

  constructor(private config: Config) {
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
  }

  /**
   * Fetch and sort user profiles by state.
   */
  async getUserProfiles(): Promise<UserProfile[]> {
    try {
      const response = await this.httpClient.get<UserProfile[]>(
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

// Main function
(async () => {
  const config: Config = {
    host: process.env.HOST || "",
    username: process.env.USERNAME || "",
    password: process.env.PASSWORD || "",
  };

  if (!config.host || !config.username || !config.password) {
    console.error(
      "Missing required environment variables (HOST, USERNAME, PASSWORD)."
    );
    process.exit(1);
  }

  const routerClient = new RouterOSClient(config);

  try {
    const profiles = await routerClient.getUserProfiles();
    console.table(profiles);

    // Filter profiles with state "used" and delete them
    const usedProfiles = profiles.filter((profile) => profile.state === "used");
    console.log("%c⧭", "color: #d90000", usedProfiles.length);

    // show getSystemIdentity
    const systemIdentity = await routerClient.getSystemIdentity();
    console.log(systemIdentity);
    // for (const profile of usedProfiles) {
    //   await routerClient.deleteUserProfile(profile[".id"]);
    // }
  } catch (error) {
    console.error("Failed to process user profiles:", error);
  }
})();
