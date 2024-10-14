const bookingDetails = require("../../models/Irctc/bookingDetailsRail");
const creditNotes = require("../../models/Irctc/RailCreditNotes");
const { Config } = require("../../configs/config");
const {ObjectId}=require("mongodb")


const RailCreditNotes = async (req,res) => {
    try{
  
    const {pnrNumber,companyId} = req.body;
  
   if (!pnrNumber || !companyId) {
      return {
        response: "Company or User id field are required",
      };
    }
  
    
  let creditNoteDetail = await creditNotes.find().sort({createdAt: -1}).limit(1);
    let invoiceRandomNumber = 100000;
    if(creditNoteDetail.length>0){
        creditNoteDetail = creditNoteDetail[0];
        let previousInvoiceNumber = creditNoteDetail?.creditNoteNo;
        previousInvoiceNumber = previousInvoiceNumber.slice(-6);
        invoiceRandomNumber = parseInt(previousInvoiceNumber) +1; 
    }else{
        invoiceRandomNumber = 100000; 
    }
    let invoiceNumber=""
  const CancelBookingData = await bookingDetails.aggregate([
    {
      $match: {
        pnrNumber: pnrNumber
      }
    },
    {
      $lookup: {
        from: "railcancellations",
        localField: "reservationId",
        foreignField: "reservationId",
        as: "cancelationBookingData"
      }
    },
    {
      $unwind: {
        path: "$cancelationBookingData",
        preserveNullAndEmptyArrays: true
      }
    },
   
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "CompanyDetail",
        pipeline: [
          {
            $lookup: {
              from: "agentconfigurations",
              let: { companyId: "$_id" }, 
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$companyId", "$$companyId"] 
                    }
                  }
                }
              ],
              as: "agentconfigurations"
            }
          },
          {
            $unwind: {
              path: "$agentconfigurations",
              preserveNullAndEmptyArrays: true
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: "$CompanyDetail",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "invoicingraildatas",
        localField: "_id",
        foreignField: "bookingId",
        as: "invoicingdatas"
      }
    },
    {
      $unwind: {
        path: "$invoicingdatas",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        cancelData: { $first: "$cancelationBookingData._id" },
       userId: { $first: "$userId" },
       status:{$first:"$cancelationBookingData.status"},
        companyId: { $first: "$companyId" },
       agentconfigurations: { $first: "$CompanyDetail.agentconfigurations" }, // Use the correct path
InvoicingData: { $first: "$invoicingdatas._id" },
SalePurchase: { $first: { $ifNull: ["$SalePurchase", ""] } },
bookingId:{$first:"$cartId"}
      }
    },
    {
      $project: {
       
       
        bookingId: 1,
        userId: 1,
        companyId: 1,
agentconfigurations: 1,
        InvoicingData: 1,
        status:1,
        cancelData:1
     }
    }
  ]);
  
  // console.log(CancelBookingData[0]?.itinerary,"jdi")
  // const DealAmountAndTds=await 
  invoiceNumber =CancelBookingData[0]?.agentconfigurations?.RailCreditNotesPrefix + invoiceRandomNumber;
  
  console.log(invoiceNumber)
  
    if(!CancelBookingData||CancelBookingData.length<=0){
      return ({
        response:"Data not found"
      })
    }
  console.log(CancelBookingData[0]?.InvoicingData)
  
   
    
    let creditNote = await creditNotes.findOne({ bookingId: CancelBookingData[0]?.bookingId }).populate([
      {
          path: "userId",
          populate: {
              path: 'company_ID',
              model: 'Company'
          }
      },
      { path: "companyId" },
      { path: "invoiceId" },
      {path:"RailCancelationData"},
      {path:"BookingData"}
  ]);
  
  if (!creditNote) {
      creditNote = new creditNotes({
          creditNoteNo: invoiceNumber,
          userId: CancelBookingData[0]?.userId,
          companyId: CancelBookingData[0]?.companyId,
          invoiceId: CancelBookingData[0]?.InvoicingData,
         status: CancelBookingData[0]?.status,
         RailCancelationData:CancelBookingData[0]?.cancelData,
         BookingData:CancelBookingData[0]?._id,
         bookingId:CancelBookingData[0]?.bookingId
          });
  
      await creditNote.save();
  
      await creditNote.populate([
          {
              path: "userId",
              populate: {
                  path: 'company_ID',
                  model: 'Company'
              }
          },
          { path: "companyId" },
          { path: "invoiceId" },
          {path:"RailCancelationData"},
      {path:"BookingData"}
      ])
  }
  
    
    
  
  
    return {
      response: "Fetch Data Successfully",
      data:creditNote
      // data: creditNotesData
    };
  }
  
  catch(error){
    throw error
  }
  };

  module.exports={
    RailCreditNotes
  }