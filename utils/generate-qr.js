const fs = require("fs");
const path = require("path");
const { ROOT_DIR } = require("./root-dir");
console.log({ ROOT_DIR });

async function generateQR({ text, fileName }) {
  try {
    await QRCode.toFile(
      path.join(ROOT_DIR, "Public", "qr-codes", fileName),
      text
    );
    return fileName;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function prepareRailBookingQRDataString({ booking }) {
  try {
    let qrDataString = `PNR NO. ${booking.pnrNumber}
    ID: ${booking.reservationId}
    ${booking.psgnDtlList
      ?.map(
        (psgn) => `Passenger Name: ${psgn.passengerName}
      Gender: ${psgn.passengerGender}
      Age: ${psgn.passengerAge}
      Status: ${psgn.currentStatus}
      `
      )
      .join("\n ")}
      Quota: ${booking.bookedQuota}
      Train Number: ${booking.trainNumber}
      Train Name: ${booking.trainName}
      Scheduled Departure: ${booking.boardingDate}
      From : ${booking.fromStnName}
      To : ${booking.resvnUptoStnName}
      Date Of Journey: ${booking.boardingDate}
      Class: ${booking.journeyClass}
      Ticket Fare: RS. ${booking.totalFare}
      IRCTC CF: RS. ${booking.serviceChargeTotal} + PG Charges Extra.
    `;
    return qrDataString;
  } catch (errorPreparingRailBookingQRDataString) {
    console.log({ errorPreparingRailBookingQRDataString });
    return false;
  }
}

module.exports = {
  generateQR,
  prepareRailBookingQRDataString,
};
