const BookingDetail = require("../../models/BookingDetails");
const TransactionDetail = require("../../models/transaction")
const InvoicingData = require("../../models/booking/InvoicingData");
const Invoicing = require("../../models/booking/Invoicing");
const InvoicePrivceBreakup = require("../../models/booking/InvoicePrivceBreakup");
const PassengerPreferenceModel = require("../../models/booking/PassengerPreference");
const Ledger = require("../../models/Ledger");
var ObjectId = require("mongoose").Types.ObjectId;
const { priceRoundOffNumberValues } = require("../commonFunctions/common.function");
 
const invoiceGenerator = async (req, res) => {
    const { bookingId,providerBookingId } = req.body;
    if(req.body.providerBookingId == null || req.body.providerBookingId == undefined || req.body.providerBookingId ==""){
        return {
            response: "providerBookingId BookingId is required.",
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
                providerBookingId:providerBookingId
            },
        },
        {
            $lookup: {
              from: "passengerpreferences",
              localField: "bookingId",
              foreignField: "bookingId",
              as: "passengerpreferences",
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
                            priceType: prcBreakUp?.PassengerType,
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
                    providerBookingId:providerBookingId
                },
            },
            {
                $lookup: {
                    from: "passengerpreferences",
                    localField: "bookingId",
                    foreignField: "bookingId",
                    as: "passengerpreferences",
                },
            },
            {
                $unwind: "$passengerpreferences",
            }
        ]);
        // console.log(bDetail,"bDetail");
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

const transactionList = async (req, res) => {
    const { fromDate, toDate, agencyId } = req.query;
    if(!fromDate || !toDate){
        return {
            response: "fromDate toDate is required.",
        } 
    }else{ 
        let query = {};
        if(agencyId){
            let agencyIdToMatch = new ObjectId(agencyId);
            query.companyId = { $in: [agencyIdToMatch]};
        }
        query.createdAt = {
            $gte: new Date(fromDate + 'T00:00:00.000Z'), 
            $lte: new Date(toDate + 'T23:59:59.999Z')   
        };
        let pipeline = [
            {
                $match:query
            },
            {
                $lookup: {
                    from: 'bookingdetails', 
                    localField: 'bookingId', 
                    foreignField: 'bookingId', 
                    as: 'bookingdetails',
                    pipeline: [
                        {
                            $project: {
                                _id:1,
                                userId:1,
                                companyId:1,
                                AgencyId:1,
                                BookedBy:1,
                                bookingId:1,
                                prodBookingId:1,
                                provider:1,
                                bookingStatus:1,
                                paymentGateway:1,
                                paymentMethodType:1,
                                PNR:1,
                                APnr:1,
                                GPnr:1,
                                SalePurchase:1,
                                bookingTotalAmount:1,
                                productType:1,
                                Supplier:1
                            },
                        },
                    ],
                }
            },
            {
                $lookup:{
                    from: 'users', 
                    localField: 'userId', 
                    foreignField: '_id', 
                    as: 'userdetails',
                }
            },
            {
                $unwind:"$userdetails"
            },
            // {
            //     $project: {
                   
            //     } 
            // }
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ];

        let transtns = await TransactionDetail.aggregate(pipeline);
        let transactions = [];
        if(transtns.length>0){
            for(let tr of transtns){
                let pGateway = '';
                const gateway = tr?.paymentGateway?.toLowerCase();

                if (gateway === 'payu') {
                    pGateway = 'PYU';
                } else if (gateway === 'easebuzz') {
                    pGateway = 'EZB';
                }
                console.log(pGateway)
                let obj1 = {
                    _id: tr._id,
                    userId: tr?.userId,
                    companyId: tr?.companyId,
                    bookingId: tr?.bookingId,
                    trnsNo: tr?.trnsNo,
                    cardNo: tr?.cardNo,
                    holderName: tr?.holderName,
                    cardExpDate: tr?.cardExpDate,
                    cardValidFrom: tr?.cardValidFrom,
                    cardIssueNo: tr?.cardIssueNo,
                    securityCode: tr?.securityCode,
                    cardType: tr?.cardType,
                    deliveryName: tr?.deliveryName,
                    deliveryCountry: tr?.deliveryCountry,
                    deliveryState: tr?.deliveryState,
                    deliveryCity: tr?.deliveryCity,
                    deliveryZip: tr?.deliveryZip,
                    deliveryAddress: tr?.deliveryAddress,
                    deliveryTel: tr?.deliveryTel,
                    billingName: tr?.billingName,
                    billingCountry: tr?.billingCountry,
                    billingState: tr?.billingState,
                    billingCity: tr?.billingCity,
                    billingZip: tr?.billingZip,
                    billingAddress: tr?.billingAddress,
                    cardBillingTel: tr?.cardBillingTel,
                    billingEmail: tr?.billingEmail,
                    billingNumber:tr?.billingNumber,
                    chargesType: tr?.chargesType,
                    bankName: tr?.bankName,
                    trnsType: tr?.trnsType,
                    paymentMode:tr?.paymentMode,
                    paymentGateway: tr?.paymentGateway,
                    trnsStatus: tr?.trnsStatus,
                    statusDetail: tr?.statusDetail,
                    trnsAddressResult: tr?.trnsAddressResult,
                    trnsPostCodeResult: tr?.trnsPostCodeResult,
                    pgCharges:tr?.pgCharges,
                    transactionAmount: tr?.transactionAmount,
                    trnsStatusMessage: tr?.trnsStatusMessage,
                    creationDate: tr?.creationDate,
                    createdAt: tr?.createdAt,
                    updatedAt: tr?.updatedAt,
                    ACC_ALIAS: pGateway,
                    bookingdetails:tr?.bookingdetails,
                    userdetails: tr?.userdetails
                };
                transactions.push(obj1);
                let obj2 ={
                    _id: tr._id,
                    userId: tr?.userId,
                    companyId: tr?.companyId,
                    bookingId: tr?.bookingId,
                    trnsNo: tr?.trnsNo,
                    cardNo: tr?.cardNo,
                    holderName: tr?.holderName,
                    cardExpDate: tr?.cardExpDate,
                    cardValidFrom: tr?.cardValidFrom,
                    cardIssueNo: tr?.cardIssueNo,
                    securityCode: tr?.securityCode,
                    cardType: tr?.cardType,
                    deliveryName: tr?.deliveryName,
                    deliveryCountry: tr?.deliveryCountry,
                    deliveryState: tr?.deliveryState,
                    deliveryCity: tr?.deliveryCity,
                    deliveryZip: tr?.deliveryZip,
                    deliveryAddress: tr?.deliveryAddress,
                    deliveryTel: tr?.deliveryTel,
                    billingName: tr?.billingName,
                    billingCountry: tr?.billingCountry,
                    billingState: tr?.billingState,
                    billingNumber:tr?.billingNumber,
  billingCity: tr?.billingCity,
                    billingZip: tr?.billingZip,
                    billingAddress: tr?.billingAddress,
                    cardBillingTel: tr?.cardBillingTel,
                    billingEmail: tr?.billingEmail,
                    chargesType: tr?.chargesType,
                    bankName: tr?.bankName,
                    trnsType: tr?.trnsType,
                    paymentMode:tr?.paymentMode,
                    paymentGateway: tr?.paymentGateway,
                    trnsStatus: tr?.trnsStatus,
                    statusDetail: tr?.statusDetail,
                    trnsAddressResult: tr?.trnsAddressResult,
                    trnsPostCodeResult: tr?.trnsPostCodeResult,
                    pgCharges:tr?.pgCharges,
                    transactionAmount: tr?.transactionAmount,
                    trnsStatusMessage: tr?.trnsStatusMessage,
                    creationDate: tr?.creationDate,
                    createdAt: tr?.createdAt,
                    updatedAt: tr?.updatedAt,
                    trnsType:"CREDIT",
                    ACC_ALIAS:tr?.userdetails?.userId,
                    bookingdetails:tr.bookingdetails,
                    userdetails: tr.userdetails
                };
                transactions.push(obj2);
            }
        }
        return {
            response:"Success",
            data: transactions
        }
    }
} 

const pgTransactionList = async (req, res) => {
    const { fromDate, toDate, agencyId } = req.query;
    if(!fromDate || !toDate){
        return {
            response: "fromDate toDate is required.",
        } 
    }else{ 
        let query = {};
        if(agencyId){
            let agencyIdToMatch = new ObjectId(agencyId);
            query.companyId = { $in: [agencyIdToMatch]};
        }
        query.createdAt = {
            $gte: new Date(fromDate + 'T00:00:00.000Z'), 
            $lte: new Date(toDate + 'T23:59:59.999Z')   
        };
        let pipeline = [
            {
                $match:query
            },
            {
                $lookup: {
                    from: 'bookingdetails', 
                    localField: 'bookingId', 
                    foreignField: 'bookingId', 
                    as: 'bookingdetails',
                    pipeline: [
                        {
                            $project: {
                                _id:1,
                                userId:1,
                                companyId:1,
                                AgencyId:1,
                                BookedBy:1,
                                bookingId:1,
                                prodBookingId:1,
                                provider:1,
                                bookingStatus:1,
                                paymentGateway:1,
                                paymentMethodType:1,
                                PNR:1,
                                APnr:1,
                                GPnr:1,
                                SalePurchase:1,
                                bookingTotalAmount:1,
                                productType:1,
                                Supplier:1
                            },
                        },
                    ],
                }
            },
            {
                $lookup:{
                    from: 'users', 
                    localField: 'userId', 
                    foreignField: '_id', 
                    as: 'userdetails',
                }
            },
            {
                $unwind:"$userdetails"
            },
            // {
            //     $project: {
                   
            //     } 
            // }
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ];

        let transtns = await TransactionDetail.aggregate(pipeline);
        let transactions = [];
        if(transtns.length>0){
            for(let tr of transtns){
                let obj2 ={
                    _id: tr._id,
                    userId: tr?.userId,
                    companyId: tr?.companyId,
                    bookingId: tr?.bookingId,
                    trnsNo: tr?.trnsNo,
                    cardNo: tr?.cardNo,
                    holderName: tr?.holderName,
                    cardExpDate: tr?.cardExpDate,
                    cardValidFrom: tr?.cardValidFrom,
                    cardIssueNo: tr?.cardIssueNo,
                    securityCode: tr?.securityCode,
                    cardType: tr?.cardType,
                    deliveryName: tr?.deliveryName,
                    deliveryCountry: tr?.deliveryCountry,
                    deliveryState: tr?.deliveryState,
                    deliveryCity: tr?.deliveryCity,
                    deliveryZip: tr?.deliveryZip,
                    deliveryAddress: tr?.deliveryAddress,
                    deliveryTel: tr?.deliveryTel,
                    billingName: tr?.billingName,
                    billingNumber:tr?.billingNumber,
                    billingCountry: tr?.billingCountry,
                    billingState: tr?.billingState,
                    billingCity: tr?.billingCity,
                    billingZip: tr?.billingZip,
                    billingAddress: tr?.billingAddress,
                    cardBillingTel: tr?.cardBillingTel,
                    billingEmail: tr?.billingEmail,
                    chargesType: tr?.chargesType,
                    bankName: tr?.bankName,
                    trnsType: tr?.trnsType,
                    paymentMode:tr?.paymentMode,
                    paymentGateway: tr?.paymentGateway,
                    trnsStatus: tr?.trnsStatus,
                    statusDetail: tr?.statusDetail,
                    trnsAddressResult: tr?.trnsAddressResult,
                    trnsPostCodeResult: tr?.trnsPostCodeResult,
                    pgCharges:tr?.pgCharges,
                    transactionAmount: tr?.transactionAmount,
                    trnsStatusMessage: tr?.trnsStatusMessage,
                    creationDate: tr?.creationDate,
                    createdAt: tr?.createdAt,
                    updatedAt: tr?.updatedAt,
                    trnsType:"CREDIT",
                    ACC_ALIAS:"BC",
                    bookingdetails:tr.bookingdetails,
                    userdetails: tr.userdetails
                };
                transactions.push(obj2);

                let obj1 = {
                    _id: tr._id,
                    userId: tr?.userId,
                    companyId: tr?.companyId,
                    bookingId: tr?.bookingId,
                    trnsNo: tr?.trnsNo,
                    cardNo: tr?.cardNo,
                    holderName: tr?.holderName,
                    cardExpDate: tr?.cardExpDate,
                    cardValidFrom: tr?.cardValidFrom,
                    cardIssueNo: tr?.cardIssueNo,
                    securityCode: tr?.securityCode,
                    cardType: tr?.cardType,
                    deliveryName: tr?.deliveryName,
                    deliveryCountry: tr?.deliveryCountry,
                    deliveryState: tr?.deliveryState,
                    deliveryCity: tr?.deliveryCity,
                    deliveryZip: tr?.deliveryZip,
                    deliveryAddress: tr?.deliveryAddress,
                    deliveryTel: tr?.deliveryTel,
                    billingName: tr?.billingName,
                    billingCountry: tr?.billingCountry,
                    billingState: tr?.billingState,
                    billingCity: tr?.billingCity,
                    billingZip: tr?.billingZip,
                    billingNumber:tr?.billingNumber,
                    billingAddress: tr?.billingAddress,
                    cardBillingTel: tr?.cardBillingTel,
                    billingEmail: tr?.billingEmail,
                    chargesType: tr?.chargesType,
                    bankName: tr?.bankName,
                    trnsType: tr?.trnsType,
                    paymentMode:tr?.paymentMode,
                    paymentGateway: tr?.paymentGateway,
                    trnsStatus: tr?.trnsStatus,
                    statusDetail: tr?.statusDetail,
                    trnsAddressResult: tr?.trnsAddressResult,
                    trnsPostCodeResult: tr?.trnsPostCodeResult,
                    pgCharges:tr?.pgCharges,
                    transactionAmount: tr?.transactionAmount,
                    trnsStatusMessage: tr?.trnsStatusMessage,
                    creationDate: tr?.creationDate,
                    createdAt: tr?.createdAt,
                    updatedAt: tr?.updatedAt,
                    ACC_ALIAS:tr?.userdetails?.userId,
                    bookingdetails:tr?.bookingdetails,
                    userdetails: tr?.userdetails
                };
                transactions.push(obj1);
            }
        }
        return {
            response:"Success",
            data: transactions
        }
    }
} 



const ledgerListWithFilter = async(req,res)=>{ 
    const { fromDate, toDate, agencyId,companyId } = req.query;
    if(!fromDate || !toDate){
        return {
            response: "fromDate toDate is required.",
        } 
    }else{ 
        let query = {
            remarks: /^DI against /
        };
    console.log(agencyId,"agencyId")
        if(agencyId){
            // let agencyIds = agencyId. split(',');
            // let userIdObjects = agencyIds.map(id => new ObjectId(id));
            // query.userId = {$in:userIdObjects};
            query.userId = new ObjectId(agencyId);
        }
        query.creationDate = {
            $gte: new Date(fromDate + 'T00:00:00.000Z'),
            $lte: new Date(toDate + 'T23:59:59.999Z')
        };
    
        if (agencyId) {
            query.$or = [
                { userId: new ObjectId(agencyId) },
                { 'companies.parent': new ObjectId(companyId) }
            ];
        }
    
        let pipeline = [
            {
                $match: query
            },
            {
                $lookup: {
                    from: "companies",
                    localField: 'companyId',
                    foreignField: "_id",
                    as: "companies"
                }
            },
            {
                $unwind: {
                    path: "$companies",
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     $lookup: {
            //         from: "transactionDetails",
            //         localField: "cartId",
            //         foreignField: "bookingId",
            //         as: "transactionData"
            //     }
            // },
            // {
            //     $unwind: {
            //         path: "$transactionData",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    ledgerId: 1,
                    transactionAmount: 1,
                    product: 1,
                    currencyType: 1,
                    fop: 1,
                    transactionType: 1,
                    remarks: 1,
                    creationDate: 1,
                    cartId: 1,
                    billingNumber:1,
                    runningAmount: 1,
                    userData: '$userData',
                    billingNumber:1,
                    createdAt:1,
                    transactionId:1,

                    // transactionData: '$transactionData',
                    // // Optional: For debugging, include these in your projection
                    // debug_transactionDataBookingId: "$transactionData.bookingId"
                }
            }
        ];
        let ldgrs = await Ledger.aggregate(pipeline);
        let ledgers = [];
        if(ldgrs.length>0){ 
            console.log("jkdsjds")
            for(let ldgr of ldgrs){
                let obj1 = {
                    ledgerId:ldgr.ledgerId,
                    transactionAmount:  await priceRoundOffNumberValues(ldgr?.transactionAmount),
                    product:ldgr?.product,
                    currencyType:ldgr?.currencyType,
                    transactionType:ldgr?.transactionType,
                    remarks:ldgr?.remarks,
                    billingNumber:ldgr?.billingNumber,
                    createdAt:ldgr?.createdAt,
                    transactionId:ldgr?.transactionId,
                    ACC_ALIAS:"CD",
                    userData:{
                        userId:ldgr?.userData?.userId,
                    }
                };
                ledgers.push(obj1);
                let obj2 ={
                    ledgerId:ldgr.ledgerId,
                    transactionAmount: await priceRoundOffNumberValues(ldgr?.transactionAmount),
                    product:ldgr?.product,
                    currencyType:ldgr?.currencyType,
                    transactionType:"DEBIT",
                    remarks:ldgr?.remarks,
                    billingNumber:ldgr?.billingNumber,
                    transactionId:ldgr?.transactionId,
 createdAt:ldgr?.createdAt,
 ACC_ALIAS:ldgr?.userData?.userId,
                    userData:{
                        userId:ldgr?.userData?.userId,
                    }
                };
                ledgers.push(obj2);
            }
        }

        return {
            response:"Success",
            data: ledgers
        }
    }
}

module.exports = { invoiceGenerator,transactionList,ledgerListWithFilter ,pgTransactionList}