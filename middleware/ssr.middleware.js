const ssrMiddleWare = async (req, res, next) => {
  if (req && req.Ancl) {
    const response = { ...req.Ancl };
    if (response.Seat && Array.isArray(response.Seat)) {
      response.Seat.forEach((trip) => {
        if (Array.isArray(trip)) {
          trip.forEach((segment) => {
            if (Array.isArray(segment)) {
              segment.forEach((seat) => {
                if (seat.SeatCode) {
                  seat.SeatCode = seat.SeatCode.replace("-", "_");
                }
                if (seat.OI) {
                  seat.OI = seat.OI.replace("Q", "Z");
                }
              });
            }
          });
        }
      });
    }

    if (response.Baggage && Array.isArray(response.Baggage)) {
      response.Baggage.forEach((trip) => {
        if (Array.isArray(trip)) {
          trip.forEach((baggage) => {
            if (baggage.OI) {
              baggage.OI = baggage.OI.replace("Q", "Z");
            }
          });
        }
      });
    }

    res.AnclResponse = response;
  }

  next();
};

module.exports = {
  ssrMiddleWare,
};
