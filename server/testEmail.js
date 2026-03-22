import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const testSMTP = async () => {
  try {
    console.log("Testing SMTP Credentials...");
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass (Length):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "UNDEFINED");
    
    // Sometimes quotes in .env break it, let's strip them safely
    const cleanPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/['"]/g, '') : '';

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPass,
      },
      debug: true, // Show all SMTP traffic
    });

    await transporter.verify();
    console.log("✅ Credentials accepted by Google!");
  } catch (error) {
    console.error("❌ SMTP Error:", error.message);
  }
};

testSMTP();
