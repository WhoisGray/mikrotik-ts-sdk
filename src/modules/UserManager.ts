import { AxiosInstance } from "axios";
import {
  User,
  AddUser,
  UserProfile,
  ProfileLimitation,
  UpdateUser,
} from "../types";
import { logger } from "../utils/logger";
import { RouterOSError } from "../utils/error-handler";

export class UserManager {
  constructor(private httpClient: AxiosInstance) {}

  async getUsers(): Promise<User[]> {
    const response = await this.httpClient.get("/user-manager/user");
    return response.data;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get(`/user-manager/user/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof RouterOSError && error.statusCode === 404) {
        logger.warn(`User with ID ${id} not found`);
        return null;
      }
      throw error;
    }
  }

  async addUser(newUser: AddUser): Promise<User> {
    const response = await this.httpClient.put("/user-manager/user", newUser);
    logger.info(`Added user: ${response.data.name}`);
    return response.data;
  }

  async updateUser(id: string, updateData: UpdateUser): Promise<User> {
    const response = await this.httpClient.patch(
      `/user-manager/user/${id}`,
      updateData
    );
    logger.info(`Updated user: ${response.data.name}`);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.httpClient.delete(`/user-manager/user/${id}`);
    logger.info(`Deleted user with ID: ${id}`);
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

  async addUserProfile(
    profile: Omit<UserProfile, ".id">
  ): Promise<UserProfile> {
    const response = await this.httpClient.put(
      "/user-manager/user-profile",
      profile
    );
    logger.info(`Added user profile: ${response.data.profile}`);
    return response.data;
  }

  async updateUserProfile(
    id: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await this.httpClient.patch(
      `/user-manager/user-profile/${id}`,
      profile
    );
    logger.info(`Updated user profile: ${response.data.profile}`);
    return response.data;
  }

  async deleteUserProfile(id: string): Promise<void> {
    await this.httpClient.delete(`/user-manager/user-profile/${id}`);
    logger.info(`Deleted user profile with ID: ${id}`);
  }

  async getProfileLimitations(): Promise<ProfileLimitation[]> {
    const response = await this.httpClient.get(
      "/user-manager/profile-limitation"
    );
    return response.data;
  }

  async addProfileLimitation(
    limitation: Omit<ProfileLimitation, ".id">
  ): Promise<ProfileLimitation> {
    const response = await this.httpClient.put(
      "/user-manager/profile-limitation",
      limitation
    );
    logger.info(`Added profile limitation: ${response.data.profile}`);
    return response.data;
  }

  async updateProfileLimitation(
    id: string,
    limitation: Partial<ProfileLimitation>
  ): Promise<ProfileLimitation> {
    const response = await this.httpClient.patch(
      `/user-manager/profile-limitation/${id}`,
      limitation
    );
    logger.info(`Updated profile limitation: ${response.data.profile}`);
    return response.data;
  }

  async deleteProfileLimitation(id: string): Promise<void> {
    await this.httpClient.delete(`/user-manager/profile-limitation/${id}`);
    logger.info(`Deleted profile limitation with ID: ${id}`);
  }

  async getActiveSessions(): Promise<any[]> {
    const response = await this.httpClient.get("/user-manager/session");
    return response.data.filter((session: any) => session.active === "yes");
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
      logger.info(`Removed inactive session with ID: ${session[".id"]}`);
    }
  }

  async terminateSession(id: string): Promise<void> {
    await this.httpClient.post("/user-manager/session/remove", { ".id": id });
    logger.info(`Terminated session with ID: ${id}`);
  }
}
