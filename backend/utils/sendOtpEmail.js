const resend = require("../config/resend");

const sendOtpEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "Veloura <onboarding@resend.dev>",
    to: email,
    subject: "Your OTP Code - Veloura",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="letter-spacing: 3px;">VELOURA</h2>
        <p>Your OTP for account verification is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p style="color: #666; font-size: 13px;">This OTP is valid for 10 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error("Failed to send OTP email");
  }

  return data;
};

module.exports = sendOtpEmail;