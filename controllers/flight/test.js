const rePriceSeat = (seatObj, seatSsr) => {
    for (let seat of seatObj) {
        if (seat.Facilities) {
            for (let facility of seat.Facilities) {
                for (let key in facility) {
                    if (key === 'TotalPrice' && facility[key] > 0) {
                        let price = facility[key];
                        let markupPercent = (price / 100) * seatSsr.markup.percentCharge;
                        let discountPercent = (price / 100) * seatSsr.discount.percentCharge;
                        let totalMarkup = markupPercent + seatSsr.markup.fixCharge;
                        let totalDiscount = discountPercent + seatSsr.discount.fixCharge;
                        
                        if (totalMarkup >= seatSsr.markup.maxValue) {
                            totalMarkup = seatSsr.markup.maxValue;
                        }
                        if (totalDiscount >= seatSsr.discount.maxValue) {
                            totalDiscount = seatSsr.discount.maxValue;
                        }
                        
                        let netMarkup = totalMarkup - totalDiscount;
                        let tds = (seatSsr.discount.tds === null || seatSsr.discount.tds < 5) ? (totalDiscount / 100) * 5 : (totalDiscount / 100) * seatSsr.discount.tds;
                        
                        let newPrice = price + netMarkup;
                        facility.rePrice = newPrice;
                        facility.tds = tds;
                    }
                }
            }
        }
    }
    return seatObj;
  };
  
  const rePriceMeal = (mealObj, mealSsr) => {
    for (let obj of mealObj) {
        for (let key in obj) {
            if (key === "Price" && obj[key] > 0) {
                let price = obj[key];
                let percentPrice = (price / 100) * mealSsr.markup.percentCharge;
                let percentPriceDiscount = (price / 100) * mealSsr.discount.percentCharge;
                let fixAndPercentMarkup = percentPrice + mealSsr.markup.fixCharge;
                let fixAndPercentMarkupDiscount = percentPriceDiscount + mealSsr.discount.fixCharge;
                
                if (fixAndPercentMarkup >= mealSsr.markup.maxValue) {
                    fixAndPercentMarkup = mealSsr.markup.maxValue;
                }
                if (fixAndPercentMarkupDiscount >= mealSsr.discount.maxValue) {
                    fixAndPercentMarkupDiscount = mealSsr.discount.maxValue;
                }
                
                let netMarkup = fixAndPercentMarkup - fixAndPercentMarkupDiscount;
                let tds = (mealSsr.discount.tds === null || mealSsr.discount.tds < 5) ? (fixAndPercentMarkupDiscount / 100) * 5 : (fixAndPercentMarkupDiscount / 100) * mealSsr.discount.tds;
                
                let newPrice = price + netMarkup;
                obj.rePrice = newPrice;
                obj.tds = tds;
            }
        }
    }
    return mealObj;
  };
  
  const repriceBaggage = (baggageObj, baggageSsr) => {
    for (let baggage of baggageObj) {
        for (let key in baggage) {
            if (key === "Price") {
                if (baggage[key] > 0) {
                    let price = baggage[key];
                    let percentPrice = (baggage[key] / 100) * baggageSsr.markup.percentCharge;
                    let percentPriceDiscount = (baggage[key] / 100) * baggageSsr.discount.percentCharge;
                    let fixAndPercentMarkup = percentPrice + baggageSsr.markup.fixCharge;
                    let fixAndPercentMarkupDiscount = percentPriceDiscount + baggageSsr.discount.fixCharge;
  
                    if (fixAndPercentMarkup >= baggageSsr.markup.maxValue) {
                        fixAndPercentMarkup = baggageSsr.markup.maxValue;
                    }
                    if (fixAndPercentMarkupDiscount >= baggageSsr.discount.maxValue) {
                        fixAndPercentMarkupDiscount = baggageSsr.discount.maxValue;
                    }
                    let netMarkup = fixAndPercentMarkup - fixAndPercentMarkupDiscount;
                    let tds;
                    if (baggageSsr.discount.tds === null || baggageSsr.discount.tds < 5) {
                        tds = (fixAndPercentMarkupDiscount / 100) * 5;
                    } else {
                        tds = (fixAndPercentMarkupDiscount / 100) * baggageSsr.discount.tds;
                    }
                    let newPrice = price + netMarkup;
                    baggage.rePrice = newPrice;
                    baggage.tds = tds;
                }
            }
        }
    }
    return baggageObj;
  };

  if(tmcSsrData != null){
      //let seatObj = result.response.response.Ancl.Seat.SeatRow ;
      let mealObj = result.response.response.Ancl.Meals ;
      let baggageObj = result.response.response.Ancl.Baggage;
      let seatSsr = tmcSsrData[0].seat;
      let baggageSsr =  tmcSsrData[0].meal ;
      let mealSsr = tmcSsrData[0].baggage;

     // result.response.response.Ancl.Seat.SeatRow = rePriceSeat(seatObj,seatSsr);
      result.response.response.Ancl.Meals = rePriceMeal(mealObj,mealSsr);
      result.response.response.Ancl.Baggage = repriceBaggage(baggageObj,baggageSsr);
    }
    console.log(result)











