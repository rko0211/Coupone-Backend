const nodemailer = require("nodemailer");
const ownerEmail = process.env.OWNEREMAIL;
const Passowrd = process.env.EMAILPASSWORD;

// Email OTP Post request Handle
export const OTPEmail = async (otp: string, userEmail: string) => {
  try {
    // Nodemailer transporter configuration
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Outlook, Yahoo, etc.
      secure: true,
      auth: {
        user: ownerEmail, // Your email address
        pass: Passowrd, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: ownerEmail,
      to: userEmail, // Send email to the user
      subject: "Your One Time Password (OTP)",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
        <h1 style="text-align: center; color: #4CAF50;">Welcome!</h1>
        <p>Hi there,</p>
        <p style="font-size: 16px;">
          Your One-Time Password (OTP) for verification is:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="display: inline-block; font-size: 24px; padding: 10px 20px; color: #fff; background-color: #4CAF50; border-radius: 5px; letter-spacing: 2px;">
            ${otp}
          </p>
        </div>
        <p style="font-size: 16px;">Please use this OTP to complete your action. The OTP is valid for 10 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p style="font-size: 14px; color: #555;">Thanks,</p>
        <p style="font-size: 14px; color: #555;">Your Company Name</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center; color: #999;">
          This is an auto-generated email. Please do not reply to this message.
        </p>
      </div>
    </div>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP to your email address");
  }
};

// Verify OTP

export const verifyOTPEmail = async (userEmail: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like Outlook, Yahoo, etc.
      secure: true,
      auth: {
        user: ownerEmail, // Your email address
        pass: Passowrd, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: ownerEmail,
      to: userEmail, // Send email to the user
      subject: "Thank You for Registering with Us!",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
        <h1 style="text-align: center; color: #4CAF50;">🎉 Congratulations! 🎉</h1>
        <p style="font-size: 16px;">
          Dear User,
        </p>
        <p style="font-size: 16px;">
          You have successfully registered on our portal. We're excited to have you on board!
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="display: inline-block; font-size: 18px; padding: 10px 20px; color: #fff; background-color: #4CAF50; border-radius: 5px; letter-spacing: 1px;">
            Welcome to the Family!
          </p>
        </div>
        <p style="font-size: 16px;">
          Feel free to explore our services and reach out if you have any questions.
        </p>
        <p style="font-size: 16px; color: #555;">Thank you for choosing us!</p>
        <p style="font-size: 14px; color: #555;">Best Regards,</p>
        <p style="font-size: 14px; color: #555;">The Team at [Your Company Name]</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; text-align: center; color: #999;">
          This is an auto-generated email. Please do not reply to this message.
        </p>
      </div>
    </div>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error: unknown) {
    throw new Error(
      "Email can't be send to your email account! Please try Letter"
    );
  }
};
