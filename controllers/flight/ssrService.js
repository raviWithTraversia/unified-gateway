let req = {
"Trip":0,
"FCode":"IX",
"FNo":"784",
"FType":"Boeing 7M8",
"Deck":"1",
"Compartemnt":"Y",
"Group":"1",
"SeatCode":"3A",
"Avlt":true,
"SeatRow":3,
"Currency":"INR",
"SsrDesc":"WINDOW",
"Price":1200.0,
"DDate":"20240428",
"Src":"DEL",
"Des":"LKO",
"OI":"SVghNzg0ISAhNjM4NDk5MTg5MDAwMDAwMDAwIURFTCFMS08hM0EhWQ--",
"Leg":0

};

let provider = "Kafila"
const processSsrArray = (reqArray, provider) => {
  const res = {
    Number: 0,
    Facilities: [],
  };

  reqArray.forEach((req) => {
    const fRes = {
      ProviderDefinedType: provider,
      Compartemnt: req.Compartemnt,
      Type: 'Seat',
      Seatcode: req.SeatCode,
      Availability: req.Avlt,
      Paid: req.Avlt,
      Currency: req.Currency,
      Characteristics: [req.SsrDesc],
      TotalPrice: req.Price,
      Key: req.OI,
    };

    res.Facilities.push(fRes);
  });

  res.Number = Math.max(...reqArray.map((req) => req.SeatRow));

  return res;
};


const seatArr = [];

arrayOfArrays.forEach((subArray, index) => {
  console.log(`Processing subarray ${index + 1}`);
  const result = processSsrArray(subArray, "yourProvider");
  seatArr.push(result);
});

console.log(seatArr);
let res = {
    "Number":"3",
    "Facilities":[
    {
    "Type":"Seat",
    "SeatCode":"3A",
    "Availability":"Open",
    "Paid":true,
    "Characteristics":[
    "LEGROOM",
    "PRIME",
    "WINDOW"
    ],
    "Key":null,
    "Currency":null,
    "TotalPrice":1200.0,
    "ProviderDefinedType":null
    }
]
}