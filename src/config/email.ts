import nodemailer from 'nodemailer';

// Create a transporter using Ethereal for development
// In production, you would use environment variables for a real SMTP service
export const createTransporter = async () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
};

// Export a singleton or a function to get it
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"Tripzy Support" <support@tripzy.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
  return info;
};
