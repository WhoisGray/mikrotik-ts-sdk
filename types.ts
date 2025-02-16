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

interface User {
  ".id": string;
  attributes: string;
  disabled: string;
  group: string;
  name: string;
  "otp-secret": string;
  password: string;
  "shared-users": string;
  comment?: string;
}
interface AddUser {
  attributes?: string;
  disabled?: string;
  group?: string;
  name: string;
  "otp-secret"?: string;
  password: string;
  "shared-users"?: string;
  comment?: string;
}

interface ProfileLimitation {
  ".id": string;
  "from-time": string;
  limitation: string;
  profile: string;
  "till-time": string;
  weekdays: string;
}
export { Config, UserProfile, User, AddUser, ProfileLimitation };
