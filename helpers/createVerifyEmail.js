const { BASE_URL } = process.env;

const createVerifyEmail = ({ email, verificationCode }) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    text: `Please verify your email by clicking on the following link: ${BASE_URL}/api/auth/verify/${verificationCode}`,
    html: `<a href="${BASE_URL}/api/auth/users/verify/${verificationCode} " target="_blank">Click verify email</a>`,
  };

  return verifyEmail;
};

export default createVerifyEmail;
