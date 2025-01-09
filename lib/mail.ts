import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `http://localhost:3000/auth/verify-email?token=${token}`

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Confirm your email",
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
//   })
// }

import nodemailer from "nodemailer"

// Configuration
const senderEmail = process.env.SENDER_EMAIL // Replace with your email
const senderPassword = process.env.SENDER_PASSWORD // Replace with your Gmail App Password
const receiverEmail = "recipient-email@example.com" // Replace with the recipient's email
const token = "123456" // Replace with the token for verification

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const confirmLink = `http://localhost:3000/auth/verify-email?token=${token}`

    // Step 1: Create the transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP server
      port: 587, // Port for TLS
      secure: false, // Use TLS
      auth: {
        user: senderEmail, // Your email
        pass: senderPassword, // Your app password
      },
    })

    // Step 2: Email content
    const mailOptions = {
      from: `"Next Auth" <${senderEmail}>`, // Sender address
      to: email, // Recipient address
      subject: "Verify Your Email", // Subject line
      text: `Your verification token is: ${token}`, // Plain text
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`, // HTML content
    }

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully!")
    console.log("Message ID:", info.messageId)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

// Call the function
// sendVerificationEmail()
