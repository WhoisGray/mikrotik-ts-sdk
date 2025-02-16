export interface User {
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

export interface AddUser {
  attributes?: string;
  disabled?: string;
  group?: string;
  name: string;
  "otp-secret"?: string;
  password: string;
  "shared-users"?: string;
  comment?: string;
}

export interface UserProfile {
  ".id": string;
  "end-time": string;
  profile: string;
  state: "waiting" | "running-active" | "active" | "used";
  user: string;
}

export interface ProfileLimitation {
  ".id": string;
  "from-time": string;
  limitation: string;
  profile: string;
  "till-time": string;
  weekdays: string;
}
