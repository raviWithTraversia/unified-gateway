// scheduler.js
const cron = require("node-cron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const bookingDetailsRail = require("../../models/Irctc/bookingDetailsRail");
const { Config } = require("../../configs/config");
const { createRailLedgerCredit } = require("../rail/irctcBooking.service");
const BookingDetails = require("../../models/booking/BookingDetails");
const { updateBookingPendingStatus } = require("../../controllers/flight/cancelation.service")
// const { getAllBooking } = require("../flightBooking/bookingApi.services");
// require("../../Public/report/agentBalenceReport");
const { updateAutoUpdatePendingBooking } = require("../flightBooking/bookingApi.services");

// API endpoint jaha se JSON aayega
const DATA_URL = `https://agentapi.kafilaholidays.in/api/agentBalenceReport`
//  today =new Date()
// today.setDate(today.getDate() - 1);
let yesterday = getYesterdayIST(1);


let payload = {
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
  fs.mkdirSync(SAVE_PATH, { recursive: true });
}

// Scheduler jo har din 4:00 PM pe chalega
cron.schedule("45 02 * * *", async () => {

  console.log("🚀 Scheduler is running... 2:45", yesterday);

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
    } while (page <= (totalPages + 1));

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

    if (files.length > 30) {
      let oldFiles = files.slice(30); // keep latest 3
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



function getYesterdayIST(daysAgo) {
  let today = new Date();

  // IST shift = +5 hours 30 minutes
  let istOffset = 5.5 * 60 * 60 * 1000;

  let istDate = new Date(today.getTime() + istOffset);

  istDate.setDate(istDate.getDate() - daysAgo);
  // return istDate

  return istDate.toISOString().split("T")[0];
}


// railBookingUpdate and provide refund

cron.schedule("00 06 * * *", async () => {
  console.log("🚀 Scheduler is running... 6:00");
  await getRailBooking();
});

cron.schedule("00 12 * * *", async () => {
  console.log("🚀 Scheduler is running... 12:00");
  await getRailBooking();
});

cron.schedule("00 18 * * *", async () => {
  console.log("🚀 Scheduler is running... 18:00");
  await getRailBooking();
});
cron.schedule("59 23 * * *", async () => {
  console.log("🚀 Scheduler is running... 23:59");
  await getRailBooking();
});

cron.schedule("00 15 * * *", async () => {
  console.log("🚀 Scheduler is running... 3:00");
  await getRailBooking();
});
cron.schedule("00 17 * * *", async () => {
  console.log("🚀 Scheduler is running... 5:00");
  await getRailBooking();
});


cron.schedule("00 19 * * *", async () => {
  console.log("🚀 Scheduler is running... 7:00");
  await getRailBooking();
});
cron.schedule("00 21 * * *", async () => {
  console.log("🚀 Scheduler is running... 9:00");
  await getRailBooking();
});
cron.schedule("00 23 * * *", async () => {
  console.log("🚀 Scheduler is running... 23:00");
  await getRailBooking();
});

cron.schedule("12 16 * * *", async () => {
  console.log("🚀 Scheduler is running... 23:59");
  await getAllPendingBookingUpdate();
})
async function getRailBooking() {
  let date = getYesterdayIST(0);
  const now = new Date();
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);


  // Query se booking data fetch karna
  let bookingData = await bookingDetailsRail.find({
    createdAt: {
      $gte: new Date(`${date}T00:00:00Z`),
      $lt: thirtyMinutesAgo
    },
    bookingStatus: "INCOMPLETE",
    // createdAt: {
    //   $gt:new Date()
    // }
  });

  if (!bookingData || bookingData.length === 0) {
    console.log("❌ No bookings found for today");
    return [];
  }

  // Promise.all ke saath handle karna
  for (const booking of bookingData) {
    try {
      await createRailLedgerCredit(booking.userId, booking);
      console.log(`✅ Updated booking ${booking._id}`);
    } catch (err) {
      console.error(`❌ Error processing booking ${booking._id}:`, err);
    }
  }
  return "All ledger entries created successfully";
}


async function getAllPendingBookingUpdate() {
  console.log("===== PENDING BOOKING SCHEDULER START =====");

  try {
    const date = getYesterdayIST(0);

    const startDate = new Date(`${date}T00:00:00Z`);
    const endDate = new Date(`${date}T23:59:59Z`);

    console.log("Processing Date:", date);

    // 1️⃣ Fetch pending bookings
    const getAllPendingBooking = await BookingDetails.find(
      {
        createdAt: { $gte: startDate, $lte: endDate },
        bookingStatus: "PENDING",
      },
      { providerBookingId: 1, _id: 1 }
    );

    console.log("Total Pending Bookings Found:", getAllPendingBooking.length);

    if (!getAllPendingBooking.length) {
      console.log("No Pending Bookings Found");
      return;
    }

    const allBookingIds = getAllPendingBooking.map((item) => item._id);

    // 2️⃣ Call provider update API
    const body = {
      _BookingId: allBookingIds,
      credentialsType: "TEST",
      companyId: "6555f84c991eaa63cb171a9f",
      Authentication: {
        CompanyId: "6555f84c991eaa63cb171a9f",
        UserId: "6555f84d991eaa63cb171aa9",
        CredentialType: "TEST",
        SalesChannel: "B2B",
        TraceId: "",
      },
    };

    console.log("Calling updateBookingPendingStatus API");
    await updateBookingPendingStatus(body);
    console.log("Provider status update completed");

    // 3️⃣ Check pending after update
    const findPendingBookingAfterUpdate = await BookingDetails.find(
      {
        _id: { $in: allBookingIds },
        bookingStatus: "PENDING",
      },
      { bookingId: 1, _id: 1 }
    );

    console.log(
      "Pending bookings after provider update:",
      findPendingBookingAfterUpdate.length
    );

    // 4️⃣ Auto fail remaining pending bookings
    if (!findPendingBookingAfterUpdate.length) {
      console.log("All pending bookings updated successfully");
      return;
    }

    for (const item of findPendingBookingAfterUpdate) {
      try {
        console.log("Auto failing booking:", item._id);
        await updateAutoUpdatePendingBooking(item._id);
        console.log("Booking auto-failed:", item._id);
      } catch (error) {
        console.error(
          "Auto update failed for booking:",
          item._id,
          error.message
        );
      }
    }

    console.log("===== PENDING BOOKING SCHEDULER END =====");

  } catch (error) {
    console.error(
      "Scheduler Failed:",
      error.message,
      error.stack
    );
  }
}

// function getAgentBalacneReportQuery(){

// }