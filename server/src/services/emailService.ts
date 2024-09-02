import nodemailer from "nodemailer";


interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailOptions: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  
  const mailOptions = {
    from: `"SFL SANGRAM" <${process.env.EMAIL_USER}>`, 
    to: emailOptions.to, 
    subject: emailOptions.subject, 
    html: emailOptions.html, 
  };

  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send email");
  }
};
