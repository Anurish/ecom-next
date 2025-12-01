import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect("mongodb://localhost:27017/medicine");

const user = new User({
  email: "admin@example.com",
  password: "123456",
  role: "admin",
});

await user.save();
console.log("Admin created with hashed password");
process.exit();
