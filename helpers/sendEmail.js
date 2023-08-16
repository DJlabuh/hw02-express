import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY, SENDGRID_FROM } = process.env;

try {
  sgMail.setApiKey(SENDGRID_API_KEY);
} catch (error) {
  console.error("Error setting SendGrid API key:", error);
}

const sendEmail = async (data) => {
  const email = { ...data, from: SENDGRID_FROM };
  try {
    await sgMail.send(email);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export default sendEmail;
