import mongoose from "mongoose";
import User from "../models/User.js";

async function run() {
  await mongoose.connect("mongodb://localhost:27017/medicine");

  await User.deleteMany({});
  
  await User.create({
    email: "admin@example.com",
    password: "123456",  // plain password
    role: "admin",
  });

  console.log("Admin created");
  mongoose.disconnect();
}

run();
