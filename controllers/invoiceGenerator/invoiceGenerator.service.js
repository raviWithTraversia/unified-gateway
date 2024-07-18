const BookingDetail = require("../../models/BookingDetails");
const InvoicingData = require("../../models/booking/InvoicingData");
const Invoicing = require("../../models/booking/Invoicing");
const InvoicePrivceBreakup = require("../../models/booking/InvoicePrivceBreakup");
var ObjectId = require("mongoose").Types.ObjectId;
 
const invoiceGenerator = async (req, res) => {
    const { bookingId } = req.body;
    let InvoicingDetail = await InvoicingData.find().sort({createdAt: -1}).limit(1);
    let invoiceRandomNumber = 100000;
    if(InvoicingDetail.length>0){
        InvoicingDetail = InvoicingDetail[0];
        let previousInvoiceNumber = InvoicingDetail?.invoiceNumber;
        previousInvoiceNumber = previousInvoiceNumber.slice(-6);
        invoiceRandomNumber = parseInt(previousInvoiceNumber) +1; 
    }else{
        invoiceRandomNumber = 100000; 
    }
    let invoiceNumber = "";
    let pipeline = [
        {
            $match: {
                bookingId
            },
        },
        {
            $lookup: {
              from: "passengerpreferences",
              localField: "_id",
              foreignField: "bid",
              as: "passengerpreferences",
            //   pipeline: [
            //     {
            //       $project: {
                    
            //       },
            //     },
            //   ],
            },
        },
        {
            $unwind: "$passengerpreferences",
        },
        {
            $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "CompanyDetail",
                pipeline: [
                {
                  $lookup:{
                    from: "agentconfigurations",
                    localField: "_id",
                    foreignField: "companyId",
                    as: "agentconfigurations",

                  }
                },
                {
                    $unwind: "$agentconfigurations",
                }
              ],
            },
        },
        {
            $unwind: "$CompanyDetail",
        },
        {
            $lookup: {
                from: 'companies', 
                localField: 'AgencyId', 
                foreignField: '_id', 
                as: 'Agencies'
            }
        },
        {
            $lookup: {
                from: 'invoicingdatas', 
                localField: '_id', 
                foreignField: 'bookingId', 
                as: 'invoicingdata',
                pipeline: [
                    {
                        $lookup:{
                            from: 'invoicepricebreakups', 
                            localField: 'invoiceNumber', 
                            foreignField: 'invoiceNumber', 
                            as: 'invoicepricebreakup',
                        }
                    },
                    {
                        $unwind: "$invoicepricebreakup",
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'invoicings', 
                localField: '_id', 
                foreignField: 'cartId', 
                as: 'invoicing'
            }
        }
    ];
    let bookingDetail = await BookingDetail.aggregate(pipeline);
    
    if(!bookingId){
        return {
            response: "BookingId is required.",
        }
    }
    if (!bookingDetail) {
        return {
            response: "BookingDetail Not found.",
        }
    }else{
        if(bookingDetail.length>0){
            bookingDetail = bookingDetail[0];
            invoiceNumber = bookingDetail?.CompanyDetail?.agentconfigurations?.InvoiceingPrefix + invoiceRandomNumber;
    
            if(bookingDetail?.passengerpreferences?.Passengers?.length>0){  
                let ttpasanegers = bookingDetail?.passengerpreferences?.Passengers;
                for(const passenger of ttpasanegers){
                    let pasType = passenger?.PaxType;
                    let allpasType= bookingDetail?.itinerary?.PriceBreakup;
                    let prcBreakUp = "";
                    for(let prcbrkup of allpasType){
                        if(prcbrkup.PassengerType == pasType){
                            prcBreakUp = prcbrkup;
                        }
                    }
                    // console.log(passenger);
                    if(bookingDetail?.invoicingdata.length == 0){
                        await InvoicingData.create({
                            invoiceNumber: invoiceNumber,
                            bookingId: bookingDetail._id,
                            passenger: passenger,
                            companyId: bookingDetail?.companyId,
                            AgencyId: bookingDetail?.AgencyId
                        }); //InvoicingData
                        await Invoicing.create({
                            cartId:bookingDetail._id,
                            passenger: passenger,
                            invoiceNumber: invoiceNumber,
                            createdBy: req.user._id,
                        });//Invoicing
                        await InvoicePrivceBreakup.create({
                            invoiceNumber: invoiceNumber,
                            passenger: passenger,
                            basicPrice: prcBreakUp?.BaseFare,
                            tax: prcBreakUp?.Tax
                        });//InvoicePriceBreakup
                    }
                }
            }
            
        } 
        let pipeline = [
            {
                $match: {
                    bookingId:bookingDetail?._id
                },
            }, 
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "CompanyDetail",
                },
            },
            {
                $unwind: "$CompanyDetail",
            },
            {
                $lookup: {
                    from: 'companies', 
                    localField: 'AgencyId', 
                    foreignField: '_id', 
                    as: 'Agencies'
                }
            },
            // {
            //     $lookup: {
            //         from: 'invoicepricebreakups', 
            //         localField: 'invoiceNumber', 
            //         foreignField: 'invoiceNumber', 
            //         as: 'invoicepricebreakup',
            //         pipeline: [
            //             {
            //               $project: {
            //                 _id:1,
            //                 invoiceNumber:1,
            //                 priceCategory:1,
            //                 priceType:1,
            //                 basicPrice:1,
            //                 tax:1,
            //                 productId:1
            //               },
            //             },
            //         ],
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'invoicings', 
            //         localField: 'bookingId', 
            //         foreignField: 'cartId', 
            //         as: 'invoicing',
            //         pipeline: [
            //             {
            //               $project: {
            //                 _id:1,
            //                 cartId:1,
            //                 productId:1,
            //                 invoiceNumber:1,
            //                 createdBy:1,
            //                 modifiedBy:1,
            //                 modifyAt:1,
            //                 additionalInvoiceType:1,
            //                 invoiceStatus:1
            //               },
            //             },
            //         ],
            //     }
            // }
        ];
        let invoiceDetail = await InvoicingData.aggregate(pipeline); 
        let invoicings = await Invoicing.aggregate([
            {
                $match:{
                    cartId: new ObjectId(bookingDetail?._id)
                }
            },
            {
                $project: {
                    _id:1,
                    cartId:1,
                    productId:1,
                    invoiceNumber:1,
                    createdBy:1,
                    modifiedBy:1,
                    modifyAt:1,
                    additionalInvoiceType:1,
                    invoiceStatus:1
                } 
            }
        ]);
        let invoicepricebreakups = await InvoicePrivceBreakup.aggregate([
            {
                $match:{
                    invoiceNumber:invoiceDetail[0]?.invoiceNumber
                }
            },
            {
                $project: {
                    _id:1,
                    invoiceNumber:1,
                    priceCategory:1,
                    priceType:1,
                    basicPrice:1,
                    tax:1,
                    productId:1
                },
            }
        ]);
        // console.log(invoiceDetail);
        if(invoiceDetail.length>0){
            invoiceDetail = invoiceDetail;
        }
        return {
            response:"Invoice Generated Successfully!",
            data: {invoiceDetail,invoicings,invoicepricebreakups}
        }
    }
   
    
    
}

module.exports = { invoiceGenerator }