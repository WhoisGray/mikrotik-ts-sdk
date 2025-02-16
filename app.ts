import { RouterOSClient } from "./routeros-client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Main function
(async () => {
  const config = {
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
    const profiles = await routerClient.getUsers();
    console.table(profiles);
    // // Filter profiles with state "used" and delete them
    // const usedProfiles = profiles.filter((profile) => profile.state === "used");
    // console.log("%c⧭", "color: #d90000", usedProfiles.length);
    // // show getSystemIdentity
    // const systemIdentity = await routerClient.getSystemIdentity();
    // console.log(systemIdentity);
    // for (const profile of usedProfiles) {
    //   await routerClient.deleteUserProfile(profile[".id"]);
    // }
  } catch (error) {
    console.error("Failed to process user profiles:", error);
  }
})();
