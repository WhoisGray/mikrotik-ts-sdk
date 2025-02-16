import { RouterOSClient } from "./src/index";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ایجاد یک نمونه از RouterOSClient
const client = new RouterOSClient({
  host: process.env.HOST || "",
  username: process.env.USERNAME || "",
  password: process.env.PASSWORD || "",
});

console.log("%c⧭", "color: #00bf00", process.env.HOST);
// تابع اصلی برای دریافت لیست کاربران
async function getUsers() {
  try {
    const users = await client.userManager.getUsers();
    console.table(users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// فراخوانی تابع
getUsers();
