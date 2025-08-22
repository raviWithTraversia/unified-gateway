// scheduler.js
const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {Config} = require("../../configs/config");
// require("../../Public/report/agentBalenceReport");

// API endpoint jaha se JSON aayega
const DATA_URL = `https://agentapi.kafilaholidays.in/api/agentBalenceReport`
 today =new Date()
today.setDate(today.getDate() - 1);
let yesterday=today.toISOString().split("T")[0];


let payload={
  "companyId": Config.TMCID,
  "userId": "",
  "date": yesterday,
  "page": 1,
  "limit": 100
}

// JSON ko save karne ka folder
const SAVE_PATH = path.join(__dirname, "../../Public/report/agentBalanceReport");


// Agar folder nahi hai to bana do
if (!fs.existsSync(SAVE_PATH)) {
  fs.mkdirSync(SAVE_PATH,{ recursive: true });
}

// Scheduler jo har din 4:00 PM pe chalega
cron.schedule("45 02 * * *", async () => {
  
  console.log("🚀 Scheduler is running... 2:45",today);

  try {
    let page = 1;
    let data = [];
    // payload.date = new Date().toISOString().split("T")[0];
    let totalPages = 1;

    do {
      payload.page = page;
      const response = await axios.post(DATA_URL, payload);
      let total = response.data?.Result?.totalCount || 0;
      totalPages = Math.ceil(total / 100);
      if (totalPages < page) {
        break;
      }

      data.push(...(response.data?.Result?.data || response.data));
      page++;
    } while (page <= (totalPages+1));

    // Create file name
    const fileName = `agentBalanceReport-data-${yesterday}.json`;
    const filePath = path.join(SAVE_PATH, fileName);

    // Save new file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ File saved: ${fileName}`);

    // ---- Keep only 3 latest files ----
    let files = fs.readdirSync(SAVE_PATH)
      .filter(f => f.startsWith("agentBalanceReport-data-"))
      .sort((a, b) => fs.statSync(path.join(SAVE_PATH, b)).mtime - fs.statSync(path.join(SAVE_PATH, a)).mtime);

    if (files.length > 3) {
      let oldFiles = files.slice(3); // keep latest 3
      for (let f of oldFiles) {
        fs.unlinkSync(path.join(SAVE_PATH, f));
        console.log(`🗑 Deleted old file: ${f}`);
      }
    }
    // ----------------------------------

  } catch (err) {
    console.error("❌ Error downloading data:", err.message);
  }
});




// function getAgentBalacneReportQuery(){

// }