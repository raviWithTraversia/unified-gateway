const groupTicketRequestModel = require("../../models/GroupTicketRequest");
const smtpModel = require("../../models/Smtp");
const userModel = require("../../models/User");
const addTicketRequset = async (req,res) => {
    try {
        const groupTicketRequest = await groupTicketRequestModel.create(req.body);
        if(!groupTicketRequest){
          return {
            response : 'Group Ticket Request Data Not Created'
          }
        }else{
            return {
                response : 'Group Ticket Request Data Created Sucessfully',
                data : groupTicketRequest
            }
        }
      } catch (error) {
        console.log(error.message);
        throw error
      }
};
const getTicketRequestId = async (req, res) => {
    try {
        const groupTicketRequest = await groupTicketRequestModel.findById(req.query.id).populate('agentId');
        //console.log("===>>>",groupTicketRequest)
        if (!groupTicketRequest) {
          return { response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request found sucessfully",
                data : groupTicketRequest
            }
        }
      } catch (error) {
       console.log( error.message );
       throw error
      }
};
const getTicketRequestByUserId = async (req, res) => {
    try {
        let agentId = req.query.agentId;
        const groupTicketRequest = await groupTicketRequestModel.find({agentId}).populate('agentId');
        console.log("==>", groupTicketRequest)
        if (!groupTicketRequest) {
          return { response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request found sucessfully",
                data : groupTicketRequest
            }
        }
      } catch (error) {
       console.log( error.message );
       throw error
      }
};
const updateTicketRequest = async (req,res) => {
    try {
        const groupTicketRequest = await groupTicketRequestModel.findByIdAndUpdate(
          req.query.id,
          req.body,
          { new: true }
        );
        if (!groupTicketRequest) {
          return{
            response: 'Group ticket request not found' };
        }
        else{
            return {
                response : "Group ticket request updated sucessfully",
                data : groupTicketRequest
            }
        }

      } catch (error) {
        console.log( error );
       throw error
      }
};
const statusChangeMail = async (recipientEmail,ticketData,mailConfig) => {
    const transporter = nodemailer.createTransport({
      host: mailConfig.host, 
      port: mailConfig.port, 
      secure: false, 
      auth: {
        user: mailConfig.userName,
        pass: mailConfig.password, 
      },
    });
    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kafila Ticket Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo {
            width: 200px;
            height: auto;
        }
        .ticket-details {
            margin-bottom: 20px;
        }
        .ticket-details h2 {
            color: #333;
            margin-bottom: 10px;
        }
        .ticket-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .ticket-details table th,
        .ticket-details table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .remarks {
            margin-top: 20px;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://kafilaui.traversia.net/assets/images/kafila_logo.png" alt="Kafila Logo">
        </div>
        <div class="ticket-details">
            <h2>Ticket Details</h2>
            <table>
                <tr>
                    <th>Status:</th>
                    <td>Pending</td>
                </tr>
                <tr>
                    <th>Agent ID:</th>
                    <td>6555f84d991eaa63cb171aa9</td>
                </tr>
                <tr>
                    <th>Company ID:</th>
                    <td>6555f84c991eaa63cb171a9f</td>
                </tr>
                <!-- Add more rows for other ticket details -->
            </table>
        </div>
        <div class="remarks">
            <h3>Remarks:</h3>
            <p>Remarks here</p>
        </div>
    </div>
</body>
</html>
 `;
    const mailOptions = {
      from: mailConfig.emailFrom,
      to: recipientEmail,
      subject: "Group ",
      text: `Click the following link to reset your password: ${baseUrl}/auth/verifyToken?token=${resetToken}&userId=${user._id}`,
      html: htmlContent, 
    };
  
    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      return {
        response : `Password reset email sent `,
        data : true
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return {
        response : "Error sending password reset email:",
         data : error
      }
    }
  };
module.exports = {
    addTicketRequset,
    getTicketRequestId,
    getTicketRequestByUserId,
    updateTicketRequest,
    statusChangeMail
}