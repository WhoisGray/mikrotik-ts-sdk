# MikroTik TypeScript SDK

This SDK provides a TypeScript interface for interacting with MikroTik RouterOS devices.

## Installation

npm install mikrotik-ts-sdk

text

## Usage

import { RouterOSClient } from "mikrotik-ts-sdk";

const client = new RouterOSClient({
host: "192.168.1.1",
username: "admin",
password: "password"
});

async function main() {
const users = await client.userManager.getUsers();
console.log(users);
}

main().catch(console.error);

text

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

