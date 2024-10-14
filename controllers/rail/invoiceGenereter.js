const BookingDetail = require("../../models/Irctc/bookingDetailsRail");
const InvoicingData = require("../../models/Irctc/invvoicingRailData");
const Invoicing = require("../../models/Irctc/invoicingRail");
const Comapny=require('../../models/Company')
const InvoicePrivceBreakup = require("../../models/Irctc/invoiceRailPriceBrekup");

var ObjectId = require("mongoose").Types.ObjectId;



const RailInoviceGerneter = async (req, res) => {
    const { bookingId,pnr } = req.body;
    if(req.body.pnr == null || req.body.pnr == undefined || req.body.pnr ==""){
        return {
            response: "pnr BookingId is required.",
        }
    }

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
                // bookingId:bookingId,
                pnrNumber: pnr
            },
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
                from: 'invoicingraildatas', 
                localField: '_id', 
                foreignField: 'bookingId', 
                as: 'invoicingdata',
                pipeline: [
                    {
                        $lookup:{
                            from: 'invoicerailpricebreakups', 
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
                from: 'invoicingrails', 
                localField: '_id', 
                foreignField: 'cartId', 
                as: 'invoicing'
            }
        }
    ];
    let bookingDetail = await BookingDetail.aggregate(pipeline);
    // console.log(bookingDetail,"bookingDetail");
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
            console.log(bookingDetail?.CompanyDetail?.agentconfigurations?.companyId,'shadaab')
            const companyData=await Comapny.findById(bookingDetail?.CompanyDetail?.agentconfigurations?.companyId)
            if(!companyData.length>0&&!companyData.type=="TMC"){

            return {
                response:"Invoice not found"
            }
            
            }
            invoiceNumber = bookingDetail?.CompanyDetail?.agentconfigurations?.RailInvoiceingPrefix + invoiceRandomNumber;
            console.log(invoiceNumber,"invoiceNumber")
            if(bookingDetail?.psgnDtlList?.length>0){  
                let ttpasanegers = bookingDetail?.psgnDtlList;
                for(const passenger of ttpasanegers){
                    // let pasType = passenger?.PaxType;
                    // let allpasType= bookingDetail?.itinerary?.PriceBreakup;
                    // let prcBreakUp = "";
                    // for(let prcbrkup of allpasType){
                    //     if(prcbrkup.PassengerType == pasType){
                    //         prcBreakUp = prcbrkup;
                    //     }
                    // }
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
                            priceType: "ADT",
                            // basicPrice: prcBreakUp?.BaseFare,
                            // tax: prcBreakUp?.Tax
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
        ];
        // let invoiceDetail = await InvoicingData.aggregate(pipeline); 
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
        // let invoicepricebreakups = await InvoicePrivceBreakup.aggregate([
        //     {
        //         $match:{
        //             invoiceNumber:invoiceDetail[0]?.invoiceNumber
        //         }
        //     },
        //     {
        //         $project: {
        //             _id:1,
        //             invoiceNumber:1,
        //             priceCategory:1,
        //             priceType:1,
        //             basicPrice:1,
        //             tax:1,
        //             productId:1
        //         },
        //     }
        // ]);
        let companyAgency = await InvoicingData.aggregate([
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
            {
                $project:{
                    companyId:1,
                    AgencyId:1,
                    CompanyDetail:1,
                    Agencies:1
                }
            }
        ]);
        let bDetail = await BookingDetail.aggregate([
            {
                $match: {
                    pnrNumber:pnr
                },
            },
          
        ]);
        let CompanyDetail = {};
        let Agencies = {};
        if(companyAgency.length>0){
            CompanyDetail = companyAgency[0]?.CompanyDetail;
            Agencies = companyAgency[0]?.Agencies;
            bDetail = bDetail[0];
        }
        
        // console.log(invoiceDetail);
        // if(invoiceDetail.length>0){
        //     invoiceDetail = invoiceDetail;
        // }
        return {
            response:"Invoice Generated Successfully!",
            data: {CompanyDetail,Agencies,invoicings,bDetail}
        }
    }
   
    
    
}

module.exports={RailInoviceGerneter}