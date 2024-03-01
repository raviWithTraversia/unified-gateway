const nodemailer = require('nodemailer');
const sendFlightQuotation = async (mailConfig ,emailTo,emailCc,emailBcc,remark,notes) => {
    const transporter = nodemailer.createTransport({
      host: mailConfig.host, 
      port: mailConfig.port, 
      secure: false, 
      auth: {
        user: mailConfig.userName,
        pass: mailConfig.password, 
      },
    });

  // Function to send an email
function sendEmail() {
    const emailTo = 'recipient@example.com';
    const emailCc = ['cc1@example.com', 'cc2@example.com', 'cc3@example.com']; 
    const emailBcc = 'bcc@example.com'; 
    const remark = 'This is a remark.';
    const notes = '<h1>Hello,</h1><p>This is the HTML content of the email.</p>';

    // Email options
    const mailOptions = {
        from: 'your_email@gmail.com', 
        to: emailTo,
        cc: emailCc.join(','), 
        bcc: emailBcc,
        subject: 'Flight Fares Quotation',
        html: `<p>${notes}</p><p>${remark}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
};
sendEmail();
  };