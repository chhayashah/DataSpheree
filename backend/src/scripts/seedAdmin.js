require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const User = require("../models/User");

const HARDCODED_NAME = "Test";
const HARDCODED_EMAIL = "test@gmail.com";
const HARDCODED_PASSWORD = "Secret123";

const run = async () => {
  const name = HARDCODED_NAME || process.env.ADMIN_NAME || "Admin";
  const email = HARDCODED_EMAIL || process.env.ADMIN_EMAIL;
  const password = HARDCODED_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD.");
    process.exitCode = 1;
    return;
  }

  if (password.length < 6) {
    console.error("ADMIN_PASSWORD must be at least 6 characters.");
    process.exitCode = 1;
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to ${process.env.MONGO_URI}`);

  let user = await User.findOne({ email }).select("+password");

  if (user) {
    user.role = "admin";
    user.status = "active";
    if (password) user.password = password;
    await user.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    user = await User.create({ name, email, password, role: "admin" });
    console.log(`Admin account created for ${email}.`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
});
