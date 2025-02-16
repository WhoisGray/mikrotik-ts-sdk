# MikroTik TypeScript SDK

[![NPM Version](https://img.shields.io/npm/v/@whoisgray/mikrotik-ts-sdk)](https://www.npmjs.com/package/@whoisgray/mikrotik-ts-sdk)  
[![License](https://img.shields.io/github/license/whoisgray/mikrotik-ts-sdk)](LICENSE)  
[![Issues](https://img.shields.io/github/issues/whoisgray/mikrotik-ts-sdk)](https://github.com/whoisgray/mikrotik-ts-sdk/issues)

A TypeScript SDK for interacting with MikroTik RouterOS devices.

## 📦 Installation

```sh
npm install @whoisgray/mikrotik-ts-sdk
```

## 🚀 Usage

```ts
import { RouterOSClient } from "@whoisgray/mikrotik-ts-sdk";

const client = new RouterOSClient({
  host: "192.168.1.1",
  username: "admin",
  password: "password",
});

async function main() {
  try {
    const users = await client.userManager.getUsers();
    console.log(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

main();
```

## 📜 API Documentation

(Provide a link to your API documentation or briefly describe the available methods here.)

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
