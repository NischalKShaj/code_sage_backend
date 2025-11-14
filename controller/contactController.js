// file to create the contact section for the application

// importing the required modules
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// creating the contact controller
const contactController = {
  // for the contact purpose
  contact: async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, message } = req.body;
      // creating a transporter object
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // configuring the mail options
      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New Contact Message from ${firstName} ${lastName}`,
        replyTo: email,
        html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #eef2f7; padding: 35px;">
      <div style="max-width: 650px; margin: auto; background: #ffffff; padding: 32px 40px; border-radius: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
        <!-- Brand Header -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #2d3748;">
            🚀 Someone Wants to Connect
          </h2>
          <p style="margin: 6px 0 0; font-size: 15px; color: #718096;">
            A visitor has submitted a new message through Code Sage.
          </p>
        </div>

        <!-- Message Box -->
        <div style="background: #f7faff; padding: 20px 22px; border-left: 5px solid #3b82f6; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 15px; color: #2d3748; white-space: pre-line;">
            ${message}
          </p>
        </div>

        <!-- Contact Section Title -->
        <h3 style="margin: 0 0 14px; font-size: 18px; color: #1a202c; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          Contact Details
        </h3>

        <!-- Contact Info Table -->
        <table style="width: 100%; border-collapse: separate; border-spacing: 0 12px; font-size: 15px;">
          <tr>
            <td style="color: #4a5568; font-weight: 600; width: 160px;">Full Name:</td>
            <td style="color: #2d3748;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="color: #4a5568; font-weight: 600;">Email:</td>
            <td style="color: #2d3748;">${email}</td>
          </tr>
          <tr>
            <td style="color: #4a5568; font-weight: 600;">Phone:</td>
            <td style="color: #2d3748;">${phoneNumber}</td>
          </tr>
        </table>
      </div>
    </div>


  `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("error from the transporter", err);
          return res.status(500).json({ message: err.message });
        } else {
        }
        res.status(200).json({ success: "message sent successfully" });
      });
    } catch (error) {
      console.error("Error while sending the mail", error);
      res.status(500).json({ message: error.message });
    }
  },
};

// exporting the contact controller
export default contactController;
