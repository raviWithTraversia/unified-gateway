const PortalApiLog = require("../../models/Logs/PortalApiLogs");

// Function to store logs in the PortalApiLogs collection
async function storeLog(logData) {
  try {
    logData.request = JSON.stringify(logData.request);
    logData.responce = JSON.stringify(logData.responce);
    
    const newLog = new PortalApiLog(logData);    
    await newLog.save();
    //console.log("Log saved successfully");
  } catch (error) {
    console.error("Error saving log:", error);
  }
}

module.exports = storeLog;
