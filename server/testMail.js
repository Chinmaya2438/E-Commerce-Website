import dotenv from "dotenv";
import sendEmail from "./utils/sendEmail.js";

dotenv.config();

const testSMTP = async () => {
  try {
    console.log(`Testing SMTP against Google with user: ${process.env.EMAIL_USER}`);
    await sendEmail({
      email: process.env.EMAIL_USER,
      subject: "Local SMTP Testing Architecture",
      message: "If you see this, your Google App Password perfectly mathematically works!",
      html: "<h1>Google Authentication Passed</h1>"
    });
    console.log("SUCCESS! The Google App password works flawlessly from your local computer.");
  } catch (error) {
    console.error("GOOGLE REJECTED THE LOGIN:", error);
  }
};

testSMTP();
