import nodemailer from "nodemailer";
import axios from "axios";

const sendEmail = async (options) => {
  // Indestructible SendGrid HTTPS API Bypass (Evades Render SMTP Port Embagros perfectly via Port 443)
  if (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes("sendgrid")) {
    const payload = {
      personalizations: [{ to: [{ email: options.email }] }],
      from: { 
        email: process.env.FROM_EMAIL || "chinmayapanda3844@gmail.com", 
        name: process.env.FROM_NAME || "ShopVerse Security" 
      },
      subject: options.subject,
      content: [
        { type: "text/plain", value: options.message },
        { type: "text/html", value: options.html }
      ]
    };

    try {
      await axios.post("https://api.sendgrid.com/v3/mail/send", payload, {
        headers: {
          "Authorization": `Bearer ${process.env.EMAIL_PASS}`,
          "Content-Type": "application/json"
        }
      });
      console.log("SendGrid HTTPS REST API securely delivered email bypassing datacenters.");
      return;
    } catch (apiError) {
      console.error("SendGrid HTTPS Error Data:", apiError.response?.data);
      throw new Error(`SendGrid API Crash: ${apiError.response?.data?.errors?.[0]?.message || 'HTTPS Tunnel Error'}`);
    }
  }

  // Legacy Configuration (Localhost / Custom Domains)
  let transporterOpts;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporterOpts = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465 ? true : false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
    };
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporterOpts = {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    };
  }

  const transporter = nodemailer.createTransport(transporterOpts);
  const info = await transporter.sendMail({
    from: `${process.env.FROM_NAME || "ShopVerse"} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });

  if (!process.env.EMAIL_USER) {
    console.log("Ethereal Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export default sendEmail;
