import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  let transporterOpts;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporterOpts = {
      host: process.env.EMAIL_HOST || "smtp.sendgrid.net",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465 ? true : false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      greetingTimeout: 10000,
    };
  } else {
    console.log("Generating Ethereal test email account...");
    const testAccount = await nodemailer.createTestAccount();
    transporterOpts = {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    };
  }

  const transporter = nodemailer.createTransport(transporterOpts);

  const message = {
    from: `${process.env.FROM_NAME || "ShopVerse Security"} <${process.env.FROM_EMAIL || "noreply@shopverse.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  
  console.log("Message sent to: %s", info.messageId);
  if (!process.env.EMAIL_USER) {
    console.log("==========================================");
    console.log("Email Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("==========================================");
  }
};

export default sendEmail;
