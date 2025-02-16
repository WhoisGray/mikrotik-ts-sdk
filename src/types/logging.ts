export interface SystemResources {
  "architecture-name": string;
  "board-name": string;
  "build-time": string;
  cpu: string;
  "cpu-count": string;
  "cpu-frequency": string;
  "cpu-load": string;
  "factory-software": string;
  "free-hdd-space": string;
  "free-memory": string;
  platform: string;
  "total-hdd-space": string;
  "total-memory": string;
  uptime: string;
  version: string;
  "write-sect-since-reboot": string;
  "write-sect-total": string;
}
export interface LogRule {
  topics: string[];
  prefix: string;
  action: string;
}

export interface LogAction {
  name: string;
  target: string;
  type: "memory" | "disk" | "email" | "remote" | "echo";
}
