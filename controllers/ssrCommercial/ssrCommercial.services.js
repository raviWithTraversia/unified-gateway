const ssrCommercialModel = require('../../models/SsrCommercial');
const user=require('../../models/User')
const EventLogs=require('../logs/EventApiLogsCommon')
const addSsrCommercial = async(req,res) => {
    try{
        const {
            seat,
            meal,
            baggage,
            bookingType,
            airlineCodeId,
            travelType,
            supplierCode,
            validDateFrom,
            validDateTo,
            status,
            description,
            modifyBy,
            companyId
          } = req.body;
          let query = {
            supplierCode: supplierCode,
            companyId: companyId,
          };
          
          if (airlineCodeId) {
            query.airlineCodeId = airlineCodeId;
          }else{
            query.airlineCodeId = null
          }
          if( bookingType){
            query.bookingType = bookingType
          }
          if(travelType){
            query.travelType = travelType
          }
          
         
      let checkIsSsrCommercialExist = await ssrCommercialModel.find(query);
      console.log("+++++++",checkIsSsrCommercialExist)
      if(checkIsSsrCommercialExist.length > 0){
        return {
            response : 'This Combination Of SSR Commercial Already Exist'
        }
      }
          const newServiceRequest = new ssrCommercialModel({
            bookingType,
            airlineCodeId : airlineCodeId || null,
            travelType,
            supplierCode,
            validDateFrom,
            validDateTo,
            status,
            description,
            seat,
            meal,
            baggage,
            companyId,
            modifyBy : req?.user?._id || null
          });
      
          const savedServiceRequest = await newServiceRequest.save();
          if(savedServiceRequest){

            const userData=await user.findById(req.user._id)
const LogsData={
            eventName:"Issuance Commercials",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:companyId,
 documentId:savedServiceRequest._id,
             description:"Add Issuance Commercials",
          }
         EventLogs(LogsData)

            return {
                response : 'Service request added successfully',
                data: savedServiceRequest,
            }
          }
         else{
            return {
                response : 'Service request not added'
            }
         }
    }catch(error){
        console.log(error);
        throw error
    }
};

const getSsrCommercialByCompany = async (req,res) => {
    try{
    let {companyId, bookingType} = req.query;
    let query = {};
    if(companyId){
      query.companyId = companyId   
    }
    if(bookingType){
        query.bookingType = bookingType
    }
    const ssrCommercialData = await ssrCommercialModel.find(query).populate('airlineCodeId supplierCode');
    
     // console.log(ssrCommercialData);
    if(ssrCommercialData.length > 0){
        return {
            response : 'Service Request Data Found Sucessfully',
            data : ssrCommercialData
        }
    }else{
        return {
            response : 'Service Request Data Not Found',
        } 
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};
const getSsrCommercialById = async (req,res) => {
    try{
      let id = req.query.id;
      let ssrData = await ssrCommercialModel.findById(id).populate('flightCode source');
      if(ssrData){
        return {
            response : ''
        }
      }
    }catch(error){
        console.log(error);
        throw error;
    }
};

const editSsrCommercial = async (req,res) => {
  try { 
    let {id} = req.query;
    let dataForUpdate = {
        ...req.body
    };
  
    const findSsrData=await ssrCommercialModel.find({_id:id})
    let existingSsrData = await ssrCommercialModel.findByIdAndUpdate(
        id,
        {
          $set: dataForUpdate,
        },
        { new: true }
      );
      const userData=await user.findById(req.user._id)
    
    if(existingSsrData){
        const LogsData={
                    eventName:"Issuance Commercials",
                    doerId:req.user?._id,
                doerName:userData?.fname,
         companyId:existingSsrData?.companyId,
         documentId:existingSsrData?._id,
         oldValue:findSsrData[0],
         newValue:existingSsrData,
                     description:"Edit Issuance Commercials",
                  }
                 EventLogs(LogsData)
        
        return {
            response : 'Data Updated Sucessfully',
            data : existingSsrData
        }
    }else{
        return {
            response : 'Data Not Updated'
        }
    }

}catch(error){
    console.log(error);
    throw error
}
}
const deleteSsrCommercial = async (req,res) => {
    try{
    let {id} = req.query;
    let deleteSsrCommercial = await ssrCommercialModel.findByIdAndDelete(id)
    const userData=await user.findById(req.user._id)

    if(deleteSsrCommercial){
        const LogsData={
            eventName:"Issuance Commercials",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:deleteSsrCommercial.companyId,
 documentId:deleteSsrCommercial._id,
             description:"Delete Issuance Commercials",
          }
         EventLogs(LogsData)

        return {
            response : 'Ssr Commercial Data Deleted Sucessfully',
            data : []
        }
    }else{
       return {
        reponse : `Ssr Commercial Data For This Id Is Not Found`
       }
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};
let data =   {
    "UID": "108210e8-895c-4065-8b5b-2efb4746bd55",
    "BaseFare": 1566,
    "Taxes": 651,
    "TotalPrice": 2217,
    "ExtraCharges": 0,
    "TaxMarkUp": 0,
    "MarkUp": 0,
    "Commission": 0,
    "Fees": 0,
    "BookingFees": 0,
    "ServiceFee": 0,
    "CancellationFees": 0,
    "RescheduleFees": 0,
    "AdminFees": 0,
    "Discount": 0,
    "TDS": 0,
    "BaseCharges": 0,
    "SupplierDiscount": 0,
    "SupplierDiscountPercent": 0,
    "GrandTotal": 2217,
    "Currency": "INR",
    "FareType": null,
    "TourCode": "",
    "PricingMethod": "Guaranteed",
    "FareFamily": "MAIN",
    "PromotionalFare": false,
    "FareFamilyDN": null,
    "PromotionalCode": "",
    "PromoCodeType": "",
    "RefundableFare": false,
    "IndexNumber": 0,
    "Provider": "Kafila",
    "ValCarrier": "IX",
    "LastTicketingDate": "",
    "TravelTime": "",
    "PriceBreakup": [
        {
            "PassengerType": "ADT",
            "NoOfPassenger": 1,
            "Tax": 651,
            "BaseFare": 1566,
            "MarkUp": 0,
            "TaxMarkUp": 0,
            "Commission": 0,
            "Fees": 0,
            "BookingFees": 0,
            "CancellationFees": 0,
            "RescheduleFees": 0,
            "AdminFees": 0,
            "TDS": 0,
            "gst": 0,
            "ServiceFees": 0,
            "Discount": 0,
            "BaseCharges": 0,
            "TaxBreakup": [
                {
                    "TaxType": "YQ",
                    "Amount": 0
                }
            ],
            "AirPenalty": [],
            "CommercialBreakup": [
                {
                    "CommercialType": "Markup",
                    "onCommercialApply": "Base Fare",
                    "Amount": 78.30000000000001,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "GST",
                    "Amount": null,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "ServiceFees",
                    "Amount": 164.43,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "Discount",
                    "Amount": 16.443,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "TDS",
                    "Amount": 0.02,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "BookingFees",
                    "Amount": 164.43,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "SegmentKickback",
                    "Amount": 10,
                    "SupplierType": "TMC"
                },
                {
                    "CommercialType": "PLB",
                    "Amount": "900",
                    "SupplierType": "TMC"
                }
            ],
            "AgentMarkupBreakup": {
                "BookingFee": 150,
                "Basic": 100,
                "Tax": 50
            },
            "Key": null,
            "OI": [
                {
                    "FAT": null,
                    "FSK": "MH5Yfn5JNX5YTkJBMDAwfk5CMDB_fjB_Nn5_WCEw"
                }
            ]
        },
        {},
        {}
    ],
    "Sectors": [
        {
            "IsConnect": false,
            "AirlineCode": "IX",
            "AirlineName": "AirIndiaExpress",
            "Class": "X",
            "CabinClass": "BT",
            "BookingCounts": "",
            "NoSeats": 9,
            "FltNum": "784",
            "EquipType": "7M8",
            "FlyingTime": "0d:1h:0m",
            "TravelTime": "0d:1h:0m",
            "TechStopOver": 1,
            "Status": "",
            "OperatingCarrier": null,
            "MarketingCarrier": null,
            "BaggageInfo": "15KG",
            "HandBaggage": "7KG",
            "TransitTime": null,
            "MealCode": null,
            "Key": "",
            "Distance": "",
            "ETicket": "No",
            "ChangeOfPlane": "",
            "ParticipantLevel": "",
            "OptionalServicesIndicator": false,
            "AvailabilitySource": "",
            "Group": "0",
            "LinkAvailability": "true",
            "PolledAvailabilityOption": "",
            "FareBasisCode": "XNBA000",
            "HostTokenRef": "",
            "APISRequirementsRef": "",
            "Departure": {
                "Terminal": "3",
                "Date": "2024-04-28",
                "Time": "2024-04-28",
                "Day": null,
                "DateTimeStamp": "2024-04-28",
                "Code": "DEL",
                "Name": "Delhi Indira Gandhi Intl",
                "CityCode": "DEL",
                "CityName": "Delhi",
                "CountryCode": "IN",
                "CountryName": "India"
            },
            "Arrival": {
                "Terminal": "2",
                "Date": "2024-04-28",
                "Time": "2024-04-28",
                "Day": null,
                "DateTimeStamp": "2024-04-28",
                "Code": "LKO",
                "Name": "Amausi Arpt",
                "CityCode": "LKO",
                "CityName": "Lucknow",
                "CountryCode": "IN",
                "CountryName": "India"
            },
            "OI": null
        }
    ],
    "FareDifference": {
        "FareDifference": 0,
        "NewFare": 2217,
        "OldFare": 2217,
        "Journeys": [
            {
                "Security": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb3RSRVogQVBJIiwianRpIjoiMjlhNzhkZDAtOTEyZS03YzBiLWM1MGYtNDUxMDg2ZjUxMjlhIiwiaXNzIjoiZG90UkVaIEFQSSJ9.H2S04zCoNdFRYxmhgourbqH_dHHgQ3xdU2isKbDWDm0",
                "IPaxkey": "MCFBRFQ-",
                "TotalFare": 2217,
                "BasicTotal": 1566,
                "YqTotal": 0,
                "TaxTotal": 651,
                "Segments": [
                    {
                        "PaxType": "ADT",
                        "TaxBreakup": [
                            {
                                "CType": "",
                                "CCode": "",
                                "Amt": 1566
                            },
                            {
                                "CType": "CUTE",
                                "CCode": "CUT",
                                "Amt": 75
                            },
                            {
                                "CType": "RCS",
                                "CCode": "RCS",
                                "Amt": 100
                            },
                            {
                                "CType": "IN",
                                "CCode": "IN",
                                "Amt": 61
                            },
                            {
                                "CType": "P2",
                                "CCode": "P2",
                                "Amt": 236
                            },
                            {
                                "CType": "WO",
                                "CCode": "WO",
                                "Amt": 91
                            },
                            {
                                "CType": "CGST",
                                "CCode": "CST",
                                "Amt": 44
                            },
                            {
                                "CType": "SGST",
                                "CCode": "SST",
                                "Amt": 44
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "Error": {
        "Status": null,
        "Result": null,
        "ErrorMessage": "",
        "ErrorCode": null,
        "Location": null,
        "WarningMessage": "",
        "IsError": false,
        "IsWarning": false
    },
    "IsFareUpdate": false,
    "IsAncl": false,
    "Param": {
        "Trip": "D1",
        "Adt": 1,
        "Chd": 0,
        "Inf": 0,
        "Sector": [
            {
                "Src": "DEL",
                "Des": "LKO",
                "DDate": "2024-04-28"
            }
        ],
        "PF": "",
        "PC": "",
        "Routing": "ALL",
        "Ver": "1.0.0.0",
        "Auth": {
            "AgentId": "675923",
            "Token": "fd58e3d2b1e517f4ee46063ae176eee1"
        },
        "Env": "D",
        "Module": "B2B",
        "OtherInfo": {
            "PromoCode": "",
            "FFlight": "",
            "FareType": "",
            "TraceId": "65d47d09df6e2927826a9bb7",
            "IsUnitTesting": false,
            "TPnr": false,
            "FAlias": null,
            "IsLca": false
        }
    },
    "GstData": {
        "IsGst": false,
        "GstDetails": {
            "Name": "Kafila Hospitality and Travels Pvt Ltd",
            "Address": "10185-c, Arya samaj Road, Karolbagh",
            "Email": "admin@kafilatravel.in",
            "Mobile": "9899911993",
            "Pin": "110005",
            "State": "Delhi",
            "Type": "",
            "Gstn": "07AAACD3853F1ZW"
        }
    },
    "SelectedFlight": {
        "PId": 0,
        "Id": 0,
        "TId": 0,
        "Src": "DEL",
        "Des": "LKO",
        "FCode": "IX",
        "FName": "",
        "FNo": "",
        "DDate": "",
        "ADate": "",
        "Dur": "",
        "Stop": "",
        "Seat": 9,
        "Sector": "",
        "Itinerary": [
            {
                "Id": 0,
                "Src": "DEL",
                "SrcName": "Delhi",
                "Des": "LKO",
                "DesName": "Lucknow",
                "FLogo": "",
                "FCode": "IX",
                "FName": "AirIndiaExpress",
                "FNo": "784",
                "DDate": "2024-04-28",
                "ADate": "2024-04-28",
                "DTrmnl": "3",
                "ATrmnl": "2",
                "DArpt": "Delhi Indira Gandhi Intl",
                "AArpt": "Amausi Arpt",
                "Dur": "0d:1h:0m",
                "layover": "",
                "Seat": 0,
                "FClass": "X",
                "PClass": "BT",
                "FBasis": "XNBA000",
                "FlightType": "7M8",
                "OI": null
            }
        ],
        "Fare": {
            "GrandTotal": 2217,
            "BasicTotal": 1566,
            "YqTotal": 0,
            "TaxesTotal": 651,
            "Adt": {
                "Basic": 1566,
                "Yq": 0,
                "Taxes": 651,
                "Total": 2217
            },
            "Chd": null,
            "Inf": null,
            "OI": [
                {
                    "FAT": null,
                    "FSK": "MH5Yfn5JNX5YTkJBMDAwfk5CMDB_fjB_Nn5_WCEw"
                }
            ]
        },
        "FareRule": {
            "CBNBG": "7KG",
            "CHKNBG": "15KG",
            "CBH": "96HRS",
            "CWBH": "96HRS-4HRS",
            "RBH": "96HRS",
            "RWBH": "96HRS-4HRS",
            "CBHA": 3000,
            "CWBHA": 3600,
            "RBHA": 2850,
            "RWBHA": 3350,
            "SF": 50
        },
        "Alias": "MAIN",
        "FareType": null,
        "PFClass": "A-R",
        "Offer": {
            "Msg": "",
            "Refund": "",
            "IsPromoAvailable": true,
            "IsGstMandatory": false,
            "IsLcc": true
        },
        "OI": {
            "Jsk": "SVh_IDc4NH4gfn5ERUx_MDQvMjgvMjAyNCAxNjozNX5MS09_MDQvMjgvMjAyNCAxNzozNX5_",
            "Pcc": "49354F5441494E4B4146494C447E4D41494E",
            "Security": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb3RSRVogQVBJIiwianRpIjoiMjlhNzhkZDAtOTEyZS03YzBiLWM1MGYtNDUxMDg2ZjUxMjlhIiwiaXNzIjoiZG90UkVaIEFQSSJ9.H2S04zCoNdFRYxmhgourbqH_dHHgQ3xdU2isKbDWDm0"
        },
        "Deal": {
            "NETFARE": 13439,
            "TDISC": 553,
            "TDS": 28,
            "GST": 100,
            "DISCOUNT": {
                "DIS": 553,
                "SF": 0,
                "PDIS": 0,
                "CB": 0
            }
        }
    },
    "HostTokens": null,
    "Key": "",
    "SearchID": "",
    "TRCNumber": null,
    "TraceId": "65d47d09df6e2927826a9bb7",
    "OI": {
        "Jsk": "SVh_IDc4NH4gfn5ERUx_MDQvMjgvMjAyNCAxNjozNX5MS09_MDQvMjgvMjAyNCAxNzozNX5_",
        "Pcc": "49354F5441494E4B4146494C447E4D41494E",
        "Security": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb3RSRVogQVBJIiwianRpIjoiMjlhNzhkZDAtOTEyZS03YzBiLWM1MGYtNDUxMDg2ZjUxMjlhIiwiaXNzIjoiZG90UkVaIEFQSSJ9.H2S04zCoNdFRYxmhgourbqH_dHHgQ3xdU2isKbDWDm0"
    }
}

function makeReqForAncl (data) {
    

}

module.exports = {
    addSsrCommercial,
    getSsrCommercialByCompany,
    getSsrCommercialById,
    deleteSsrCommercial,
    editSsrCommercial
}