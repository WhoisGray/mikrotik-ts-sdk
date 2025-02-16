import { AxiosInstance } from "axios";
import { User, AddUser, UserProfile, ProfileLimitation } from "../types";
import { logger } from "../utils/logger";

export class UserManager {
  constructor(private httpClient: AxiosInstance) {}

  async getUsers(): Promise<User[]> {
    const response = await this.httpClient.get("/user-manager/user");
    return response.data;
  }

  async addUser(newUser: AddUser): Promise<void> {
    try {
      const response = await this.httpClient.put("/user-manager/user", newUser);
      logger.info(`Added user: ${response.data.name}`);
    } catch (error) {
      logger.error(`Error adding user: ${newUser.name}`, error);
      throw error;
    }
  }

  async getUserProfiles(): Promise<UserProfile[]> {
    const response = await this.httpClient.get<UserProfile[]>(
      "/user-manager/user-profile"
    );
    return response.data.sort((a, b) => {
      const states = ["waiting", "running-active", "active", "used"];
      return states.indexOf(a.state) - states.indexOf(b.state);
    });
  }

  async getProfileLimitations(): Promise<ProfileLimitation[]> {
    const response = await this.httpClient.get(
      "/user-manager/profile-limitation"
    );
    return response.data;
  }

  async deleteUserProfile(id: string): Promise<void> {
    await this.httpClient.delete(`/user-manager/user-profile/${id}`);
    logger.info(`Deleted user profile with ID: ${id}`);
  }

  async removeInactiveSessions(): Promise<void> {
    const sessions = await this.httpClient.get("/user-manager/session");
    const inactiveSessions = sessions.data.filter(
      (session: any) => session.active === "no"
    );

    for (const session of inactiveSessions) {
      await this.httpClient.post("/user-manager/session/remove", {
        ".id": session[".id"],
      });
      logger.info(`Removed session with ID: ${session[".id"]}`);
    }
  }

  async getActiveSessions() {
    const response = await this.httpClient.get("/user-manager/session");
    return response.data;
  }
}
