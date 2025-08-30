const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teamwandercall@gmail.com',
    pass: 'dhbb wdgi qsle akkg'
  }
});

const generateOTPEmailHTML = (otp, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - WanderCall</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">WanderCall</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Verify Your Email Address</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${userName}!</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              Welcome to WanderCall! To complete your registration, please verify your email address using the OTP below:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="background: white; border-radius: 10px; padding: 20px; display: inline-block;">
                <span style="font-size: 32px; font-weight: 700; color: #667eea; letter-spacing: 8px;">${otp}</span>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0; font-size: 14px;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 WanderCall. All rights reserved.<br>
                This is an automated email, please do not reply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateWelcomeEmailHTML = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to WanderCall!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">WanderCall</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Welcome to Your Adventure!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Welcome ${userName}! 🎉</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              Congratulations! Your WanderCall account has been successfully created. You're now part of our community of adventure seekers and experience enthusiasts.
            </p>
            
            <div style="background: #f8f9ff; border-radius: 15px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Explore unique experiences curated just for you</li>
                <li>Connect with fellow adventurers in our community</li>
                <li>Book unforgettable experiences around the world</li>
                <li>Earn rewards with every adventure</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 10px; font-weight: 600; display: inline-block;">Start Exploring</a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 WanderCall. All rights reserved.<br>
                Need help? Contact us at teamwandercall@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendOTPEmail = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: `"WanderCall" <teamwandercall@gmail.com>`,
      to: email,
      subject: 'Verify Your Email - WanderCall',
      html: generateOTPEmailHTML(otp, userName)
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

const generatePasswordResetEmailHTML = (otp, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - WanderCall</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">WanderCall</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">🔒 Password Reset Request</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${userName}!</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              We received a request to reset your password. Use the OTP below to change your password:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 15px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Password Change OTP</p>
              <div style="background: white; border-radius: 10px; padding: 20px; display: inline-block;">
                <span style="font-size: 32px; font-weight: 700; color: #f97316; letter-spacing: 8px;">${otp}</span>
              </div>
            </div>
            
            <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="color: #c2410c; margin: 0; font-size: 14px; font-weight: 600;">⚠️ Security Notice:</p>
              <p style="color: #9a3412; margin: 5px 0 0 0; font-size: 14px; line-height: 1.5;">
                This OTP will expire in 10 minutes. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 WanderCall. All rights reserved.<br>
                This is an automated email, please do not reply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendWelcomeEmail = async (email, userName) => {
  const mailOptions = {
    from: `"WanderCall" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to WanderCall! 🎉',
    html: generateWelcomeEmailHTML(userName)
  };

  return transporter.sendMail(mailOptions);
};

const sendPasswordResetOTP = async (email, otp, userName) => {
  try {
    const mailOptions = {
      from: `"WanderCall" <teamwandercall@gmail.com>`,
      to: email,
      subject: '🔒 Password Reset OTP - WanderCall',
      html: generatePasswordResetEmailHTML(otp, userName)
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset email failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetOTP
};