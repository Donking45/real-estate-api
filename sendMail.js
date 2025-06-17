const nodemailer = require("nodemailer")

const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });


    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject,
      text: message,
    };


    await mailTransport.sendMail(mailDetails);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const validEmail = (email) => {
  const re =
    /^(([^<>()[\\.,;:\s@"]+(\.[^<>()[\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};


module.exports = {
  sendEmail,
  validEmail,
};



