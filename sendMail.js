const nodemailer = require("nodemailer")

const sendForgotPasswordEmail = async (email, token) =>{
    try{
        const mailTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.EMAIL}`,
                pass: `${process.env.EMAIL_PASSWORD}`
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
    
        const mailDetails = {
            from: `${process.env.EMAIL}`,
            to: `${email}`,
            subject: "Reset Password Notification",
            html: `<h2>Password Reset Request</h2><p>You recently requested to reset your password. Please click the button below to proceed:</p>

<p><a href="https://www.yourcareerex.com/reset-password/${token}" 
    style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">
    Reset Password
  </a>
</p>


<p>If the button above doesn't work, copy and paste the link below into your browser:</p>

<p>
  <a href="https://www.yourcareerex.com/reset-password/${token}">
    https://www.yourcareerex.com/reset-password/${token}
  </a>
</p>


<p>If you did not request this change, please ignore this message.</p>


<p>– CareerEX Support</p>
`
        }
    
        await mailTransport.sendMail(mailDetails)
    } catch (error){
        console.log(error)
    }  
}

const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


module.exports = {
    sendForgotPasswordEmail,
    validEmail

}