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
        subject: `Someone contacted  - ${firstName} ${lastName}, ${phoneNumber}`,
        text: message,
        replyTo: email,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("error from the transporter", err);
          return res.status(500).json({ message: err.message });
        } else {
          console.log("info", info);
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
