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

  async getUserByName(username: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get("/user-manager/user", {
        params: {
          name: username,
        },
      });

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return response.data[0];
      }

      logger.warn(`User with name ${username} not found`);
      return null;
    } catch (error) {
      logger.error(`Error fetching user by name: ${username}`, error);
      throw error;
    }
  }

  async addUser(newUser: AddUser): Promise<User> {
    try {
      const response = await this.httpClient.put("/user-manager/user", newUser);
      logger.info(`Added user: ${response.data.name}`);
      return response.data;
    } catch (error) {
      logger.error(`Error adding user: ${newUser.name}`, error);
      throw error;
    }
  }

  async updateUser(id: string, updateData: UpdateUser): Promise<User> {
    try {
      const response = await this.httpClient.patch(
        `/user-manager/user/${id}`,
        updateData
      );
      logger.info(`Updated user: ${response.data.name}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating user with ID ${id}`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/user-manager/user/${id}`);
      logger.info(`Deleted user with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting user with ID ${id}`, error);
      throw error;
    }
  }

  async getUserProfiles(): Promise<UserProfile[]> {
    try {
      const response = await this.httpClient.get<UserProfile[]>(
        "/user-manager/user-profile"
      );
      return response.data.sort((a, b) => {
        const states = ["waiting", "running-active", "active", "used"];
        return states.indexOf(a.state) - states.indexOf(b.state);
      });
    } catch (error) {
      logger.error("Error fetching user profiles", error);
      throw error;
    }
  }

  async addUserProfile(
    profile: Omit<UserProfile, ".id">
  ): Promise<UserProfile> {
    try {
      const response = await this.httpClient.put(
        "/user-manager/user-profile",
        profile
      );
      logger.info(`Added user profile: ${response.data.profile}`);
      return response.data;
    } catch (error) {
      logger.error(`Error adding user profile`, error);
      throw error;
    }
  }

  async updateUserProfile(
    id: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      const response = await this.httpClient.patch(
        `/user-manager/user-profile/${id}`,
        profile
      );
      logger.info(`Updated user profile: ${response.data.profile}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating user profile with ID ${id}`, error);
      throw error;
    }
  }

  async deleteUserProfile(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/user-manager/user-profile/${id}`);
      logger.info(`Deleted user profile with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting user profile with ID ${id}`, error);
      throw error;
    }
  }

  async getProfileLimitations(): Promise<ProfileLimitation[]> {
    try {
      const response = await this.httpClient.get(
        "/user-manager/profile-limitation"
      );
      return response.data;
    } catch (error) {
      logger.error("Error fetching profile limitations", error);
      throw error;
    }
  }

  async addProfileLimitation(
    limitation: Omit<ProfileLimitation, ".id">
  ): Promise<ProfileLimitation> {
    try {
      const response = await this.httpClient.put(
        "/user-manager/profile-limitation",
        limitation
      );
      logger.info(`Added profile limitation: ${response.data.profile}`);
      return response.data;
    } catch (error) {
      logger.error(`Error adding profile limitation`, error);
      throw error;
    }
  }

  async updateProfileLimitation(
    id: string,
    limitation: Partial<ProfileLimitation>
  ): Promise<ProfileLimitation> {
    try {
      const response = await this.httpClient.patch(
        `/user-manager/profile-limitation/${id}`,
        limitation
      );
      logger.info(`Updated profile limitation: ${response.data.profile}`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating profile limitation with ID ${id}`, error);
      throw error;
    }
  }

  async deleteProfileLimitation(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/user-manager/profile-limitation/${id}`);
      logger.info(`Deleted profile limitation with ID: ${id}`);
    } catch (error) {
      logger.error(`Error deleting profile limitation with ID ${id}`, error);
      throw error;
    }
  }

  async getActiveSessions(): Promise<any[]> {
    try {
      const response = await this.httpClient.get("/user-manager/session");
      return response.data.filter((session: any) => session.active === "yes");
    } catch (error) {
      logger.error("Error fetching active sessions", error);
      throw error;
    }
  }

  async removeInactiveSessions(): Promise<void> {
    try {
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
    } catch (error) {
      logger.error("Error removing inactive sessions", error);
      throw error;
    }
  }

  async terminateSession(id: string): Promise<void> {
    try {
      await this.httpClient.post("/user-manager/session/remove", { ".id": id });
      logger.info(`Terminated session with ID: ${id}`);
    } catch (error) {
      logger.error(`Error terminating session with ID ${id}`, error);
      throw error;
    }
  }
}
