const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tripzy Notification</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .header {
      background-color: #000000;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888888;
      border-top: 1px solid #eeeeee;
    }
    .footer a {
      color: #888888;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100%;
        margin-top: 0;
        border-radius: 0;
      }
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TRIPZY</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Tripzy. All rights reserved.</p>
      <p>123 Ride Street, Transport City, TC 90210</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getWelcomeEmail = (firstName: string) => {
  const content = `
    <h2>Welcome to Tripzy, ${firstName}!</h2>
    <p>We are thrilled to have you on board. Tripzy is your go-to platform for reliable and comfortable rides.</p>
    <p>Get ready to experience seamless travel at your fingertips.</p>
    <div style="text-align: center;">
      <a href="#" class="button">Book Your First Ride</a>
    </div>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Safe travels,<br>The Tripzy Team</p>
  `;
  return getBaseTemplate(content);
};

export const getRideBookingEmail = (firstName: string, origin: string, destination: string) => {
  const content = `
    <h2>Ride Confirmed!</h2>
    <p>Hi ${firstName},</p>
    <p>Your ride has been successfully booked.</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #000000; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>From:</strong> ${origin}</p>
      <p style="margin: 5px 0;"><strong>To:</strong> ${destination}</p>
    </div>
    <p>Your driver is on the way. You can track your ride in the app.</p>
    <div style="text-align: center;">
      <a href="#" class="button">Track Driver</a>
    </div>
    <p>Safe travels,<br>The Tripzy Team</p>
  `;
  return getBaseTemplate(content);
};
