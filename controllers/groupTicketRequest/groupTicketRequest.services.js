const groupTicketRequestModel = require("../../models/GroupTicketRequest");
const smtpModel = require("../../models/Smtp");
const userModel = require("../../models/User");
const {Config} = require("../../configs/config");
const addTicketRequset = async (req,res) => {
    try {
      let totalCount = req.body.adultCount + req.body.childCount + req.body.infantCount ;
      req.body.totalCount = totalCount ;
        const groupTicketRequest = await groupTicketRequestModel.create(req.body);

        if(!groupTicketRequest){
          return {
            response : 'Group Ticket Request Data Not Created'
          }
        }else{
          let userDetail = await userModel.findOne({_id : req.body.agentId});
        //  console.log(userDetail)
          let mailConfig = await smtpModel.findOne({ companyId: userDetail.company_ID});
         // console.log("===>>>>>>>>>>>",mailConfig)
          if (!mailConfig) {
            let id = Config.MAIL_CONFIG_ID;
            mailConfig = await smtpModel.findById(id);
          };
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
        <title>Ticket Details</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 800px;
                margin: 20px auto;
                padding: 20px;
                background-color: #f5f5f5;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            img {
                max-width: 200px;
                display: block;
                margin: 0 auto;
                margin-bottom: 20px;
            }
            h2 {
                font-size: 24px;
                margin-bottom: 20px;
            }
            p, li {
                font-size: 16px;
                margin-bottom: 10px;
            }
            strong {
                font-weight: bold;
            }
            ul {
                list-style-type: none;
                padding-left: 0;
            }
        </style>
    </head>
    <body>
    
    <div class="container">
    
        <!-- Logo -->
        <img src="https://kafilaui.traversia.net/assets/images/kafila_logo.png" alt="Kafila Logo">
    
        <!-- Ticket Details -->
        <h2>Ticket Details</h2>
        <p><strong>Status:</strong> Pending</p>
        <p><strong>Agent ID:</strong> 6555f84d991eaa63cb171aa9</p>
        <p><strong>Company ID:</strong> 6555f84c991eaa63cb171a9f</p>
        <p><strong>Segments:</strong></p>
        <ol>
            <li>
                <p><strong>Origin:</strong> DEL</p>
                <p><strong>Destination:</strong> BOM</p>
                <p><strong>Origin Name:</strong> Ahmedabad</p>
                <p><strong>Destination Name:</strong> Dubai</p>
                <p><strong>Departure Date:</strong> 2024-06-28</p>
                <p><strong>Departure Time:</strong> 00:01</p>
                <p><strong>Departure Time To:</strong> 23:59</p>
                <p><strong>Class of Service:</strong> Economy</p>
            </li>
            <li>
                <p><strong>Origin:</strong> BOM</p>
                <p><strong>Destination:</strong> DEL</p>
                <p><strong>Origin Name:</strong> Ahmedabad</p>
                <p><strong>Destination Name:</strong> Dubai</p>
                <p><strong>Departure Date:</strong> 2024-07-28</p>
                <p><strong>Departure Time:</strong> 00:01</p>
                <p><strong>Departure Time To:</strong> 23:59</p>
                <p><strong>Class of Service:</strong> Economy</p>
            </li>
        </ol>
        <p><strong>Remarks:</strong> Remarks here</p>
        <p><strong>Total Count:</strong> 10</p>
        <p><strong>Adult Count:</strong> 8</p>
        <p><strong>Child Count:</strong> 1</p>
        <p><strong>Infant Count:</strong> 1</p>
        <p><strong>Quoted Price:</strong></p>
        <ul>
            <li><strong>Total Price:</strong> 10000</li>
            <li><strong>Adult Price:</strong> 8000</li>
            <li><strong>Child Price:</strong> 1500</li>
            <li><strong>Infant Price:</strong> 500</li>
        </ul>
        <p><strong>Trip Type:</strong> ROUNDTRIP</p>
        <p><strong>Travel Type:</strong> Domestic</p>
    
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