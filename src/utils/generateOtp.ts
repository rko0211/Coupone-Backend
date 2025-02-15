
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  return otp; // Return OTP for sending to the user
};


