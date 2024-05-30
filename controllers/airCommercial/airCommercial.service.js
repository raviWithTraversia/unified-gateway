const Carrier = require('../../models/AirlineCode');
const FareFamilyMaster = require('../../models/FareFamilyMaster');
const AirCommercial = require('../../models/AirCommercial');
const AirCommercialRowMaster = require('../../models/AirCommertialRowMaster');
const AirCommercialColoumnMaster = require('../../models/AirCommertialColumnMaster');
const CommercialType = require('../../models/CommercialType');
const Matrix = require('../../models/UpdateAirCommercialMatrix');
const CommercialFilterExcInd = require('../../models/CommercialFilterExcludeIncludeList');
const { response } = require('../../routes/airCommercialRoute');
const AirCommercialFilter = require('../../models/AirCommercialFilter');
const CommercialHistory = require('../../models/CommercialHistory');
const EventLogs=require('../logs/EventApiLogsCommon')
const user=require('../../models/User')

const addAirCommercial = async (req, res) => {
    try {

        const {
            commercialAirPlanId,
            travelType,
            carrier,
            commercialCategory,
            supplier,
            source,
            priority,
            fareFamily,
            companyId
        } = req.body;

        const userData=await user.findById(req.user._id)
        if (!commercialAirPlanId) {
            return {
                response: 'Commercial air plan Id field are required'
            }
        }
        if (!travelType) {
            return {
                response: 'Travel Type field are required'
            }
        }
        // if (!carrier) {
        //     return {
        //         response: 'Carrier field are required'
        //     }
        // }
        // if (!supplier) {
        //     return {
        //         response: 'Supplier field are required'
        //     }
        // }
        if (!priority) {
            return {
                response: 'Priority field are required'
            }
        }
        const saveAirCommercial = new AirCommercial({
            commercialAirPlanId,
            travelType,
            carrier,
            commercialCategory,
            supplier,
            source,
            fareFamily,
            priority,
            companyId
        });

        const result = await saveAirCommercial.save();

        // Create matrix for commercial when we create commercial detail
        if (result) {
            const getMatrixData = await CommercialType.find();
            const createCommercialType = new Matrix({
                comercialPlanId: commercialAirPlanId,
                airCommercialPlanId: result._id,
                companyId,
                data: getMatrixData,
            });
            const saveData = await createCommercialType.save();
        }


        // Create Filter for Matrix............
        if (result) {
            const allFilter = await AirCommercialFilter.find();
            const dataArray = [];
            for (let i = 0; i < allFilter.length; i++) {
                const object1 = {
                    commercialFilterId: allFilter[i]._id,
                    type: "exclude",
                    value: null,
                    valueType: allFilter[i].type,
                }
                const object2 = {
                    commercialFilterId: allFilter[i]._id,
                    type: "include",
                    value: null,
                    valueType: allFilter[i].type,
                }
                dataArray.push(object1, object2);
            }

            const createFilter = new CommercialFilterExcInd({
                commercialAirPlanId: commercialAirPlanId,
                airCommercialId: result._id,
                commercialFilter: dataArray
            });

            const filterCreated = await createFilter.save();
            const LogsData={
                eventName:"AirCommercial",
                doerId:req.user._id,
            doerName:userData.fname,
        companyId:companyId,
        documentId:result._id,
                 description:"Add AirCommercial",
              }
             EventLogs(LogsData)

        }
        return {
            response: 'Air Commercial created successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getColoumnDetail = async (req, res) => {
    try {
        const coloumnData = await AirCommercialColoumnMaster.find({status:true}).sort({priority:1});

        if (coloumnData.length > 0) {
            return {
                data: coloumnData,
            }
        } else {
            return {
                response: 'Commercial coloumn not available',
                data: null,
            }
        }
    } catch (error) {
        throw error;
    }
}


const getRowDetail = async (req, res) => {
    try {
        const rowData = await AirCommercialRowMaster.find();
        if (rowData.length > 0) {
            return {
                data: rowData,
            }
        } else {
            return {
                response: 'Commercial row not available',
                data: null,
            }
        }
    } catch (error) {
        throw error;
    }
}


const addCommercialType = async (req, res) => {
    try {
        const {
            airCommercialId,
            AirCommertialColumnMasterId,
            AirCommertialRowMasterId,
            companyId,
            textType
        } = req.body;

        const userData=await user.findById(req.user._id)

        if (!airCommercialId || !AirCommertialColumnMasterId || !AirCommertialRowMasterId || !companyId || !textType) {
            return {
                response: 'All fields are required'
            }
        } else {

            const saveResult = new CommercialType({
                airCommercialId,
                AirCommertialColumnMasterId,
                AirCommertialRowMasterId,
                companyId,
                textType
            });
            const result = await saveResult.save();

            const LogsData={
                eventName:"AirCommercial",
                doerId:req.user._id,
            doerName:userData.fname,
        companyId:companyId,
        documentId:result._id,
                 description:"Add Commercial Type",
              }
             EventLogs(LogsData)
            return {
                response: "Air commercial type added successfully"
            }
        }
    } catch (error) {
        throw error;
    }
}

const getCommercialDetailList = async (req, res) => {
    try {
        const coloumnData = await CommercialType.find();
        if (coloumnData.length > 0) {
            return {
                data: coloumnData,
            }
        } else {
            return {
                response: 'Commercial type not available',
                data: null,
            }
        }
    } catch (error) {
        throw error;
    }
}



const commercialRowColoumnAdd = async (req, res) => {
    try {
        const { name, commercialType, type, modifiedBy } = req.body;
        if (!name || !commercialType || !type || !modifiedBy) {
            return {
                response: 'All fields are required'
            }
        }

        const storeData = new AirCommercialColoumnMaster({
            name,
            commercialType,
            type,
            modifiedBy
        });

        const result = await storeData.save();
      
        return {
            response: "Commercial row / coloumn created successfully"
        }

    } catch (error) {
        throw error
    }
}


const UpdateMatrixData = async (req, res) => {
    try {
        const {
            comercialPlanId,
            airCommercialPlanId,
            companyId,
            data,
            commercialFilter,
        } = req.body;

        if (!comercialPlanId || !airCommercialPlanId || !companyId) {
            return {
                response: "All field are required",
            }
        }

        const checkDataExist = await Matrix.findOne({
            airCommercialPlanId: airCommercialPlanId,
            comercialPlanId: comercialPlanId,
        });


        if (checkDataExist) {

            // Filter Commercial Data
            const checkExist = await CommercialFilterExcInd.findOne({
                airCommercialId: airCommercialPlanId,
            });

            if (checkExist) {
                await CommercialFilterExcInd.findByIdAndUpdate(
                    checkExist._id,
                    {
                        // commercialAirPlanId : airCommercialPlanId,
                        // airCommercialId : airCommercialPlanId,
                        commercialFilter,
                    },
                    { new: true }
                );
            }

            let resultAll = await Matrix.findByIdAndUpdate(
                checkDataExist._id,
                {
                    comercialPlanId,
                    airCommercialPlanId,
                    companyId: companyId,
                    data,
                },
                { new: true }
            );
            if (resultAll) {

                // Manage History 

                const checkComHistory = await CommercialHistory.findOne({ commercialId: checkExist._id });
                if (checkComHistory) {

                    let resultAll = await CommercialHistory.findByIdAndUpdate(
                        checkComHistory._id,
                        {
                            newValue: data,
                            oldValue: checkComHistory.newValue,
                            commercialFilterNewValue : commercialFilter,
                            commercialFilterOldValue : checkComHistory.commercialFilterNewValue
                        },
                        { new: true }
                    );
                } else {
                    const saveHistory = new CommercialHistory({
                        commercialId: checkExist._id,
                        newValue: data,
                        oldValue: data,
                        commercialFilterNewValue : commercialFilter,
                        commercialFilterOldValue : commercialFilter
                    });
                    const History_result = await saveHistory.save();
                }


                return {
                    response: "Matrix updated successfully",
                }
            } else {
                return {
                    response: "Something went wrong!!",
                }
            }

        } else {

            var resultData = new CommercialFilterExcInd({
                commercialAirPlanId: comercialPlanId,
                airCommercialId: airCommercialPlanId,
                commercialFilter,
            });

            let data = await result.save();
            // const rateValueData = req.body.rateValue;
            const saveDataMatrix = new Matrix({
                comercialPlanId,
                airCommercialPlanId,
                companyId: companyId,
                data
            });
            let resultAll = await saveDataMatrix.save();
            if (!resultAll) {
                return {
                    response: "Matrix updated successfully",
                }
            } else {
                return {
                    response: "Something went wrong!!",
                }
            }
        }


        

    } catch (error) {
        throw error;
    }
}


const getAirCommercialListByAirComId = async (req, res) => {
    try {
        const airCommercialPlanId = req.params.airCommercialPlanId;
        const coloumnData = await AirCommercial.find({ commercialAirPlanId: airCommercialPlanId }).populate('carrier').populate('supplier').populate('source').populate('fareFamily');

        if (coloumnData.length > 0) {
            return {
                data: coloumnData,
            }
        } else {
            return {
                response: 'Commercial not available',
                data: null,
            }
        }
    } catch (error) {
        throw error
    }
}


// Filter Coloumn exclude and include
const addCommercialFilterExcInc = async (req, res) => {
    try {
        const { commercialAirPlanId, airCommercialId, commercialFilter } = req.body;
        if (!commercialAirPlanId || !airCommercialId || !commercialFilter) {
            return {
                response: "All fields are required",
            };
        }

        const checkExist = await CommercialFilterExcInd.findOne({
            commercialAirPlanId: commercialAirPlanId,
            airCommercialId: airCommercialId,
        });

        if (checkExist) {
            let data = await CommercialFilterExcInd.findByIdAndUpdate(
                checkExist._id,
                {
                    commercialAirPlanId,
                    airCommercialId,
                    commercialFilter,
                },
                { new: true }
            );

            if (data) {
                return {
                    response: "Commercial updated successfully",
                };
            } else {
                return {
                    response: "Something went wrong, try again later!",
                };
            }
        } else {


            var result = new CommercialFilterExcInd({
                commercialAirPlanId,
                airCommercialId,
                commercialFilter,
            });

            let data = await result.save();
            if (data) {
                return {
                    response: "Commercial updated successfully",
                };
            } else {
                return {
                    response: "Something went wrong, try again later!",
                };
            }
        }


    } catch (error) {
        throw error;
    }
};

const getComExcIncList = async (req, res) => {
    try {
        const comercialIncExc = await AirCommercialFilter.find({}).sort({ _id: 1 });

        if (comercialIncExc.length > 0) {
            return {
                data: comercialIncExc,
            }
        } else {
            return {
                response: 'Commercial include exclude list not available',
                data: null,
            }
        }
    } catch (error) {
        throw error
    }
};
const getComIncludeExclude = async (req, res) => {
    try {
        // const commercialAirPlanId = req.params.commercialAirPlanId;
        // const airCommercialId = req.params.airCommercialId;
        // console.log(commercialAirPlanId);
        const { commercialAirPlanId, airCommercialId } = req.query;
        const result = await CommercialFilterExcInd.find({
            commercialAirPlanId: commercialAirPlanId,
            airCommercialId: airCommercialId
        });

        if (result.length > 0) {
            return {
                response: 'Commercial include exclude list',
                data: result
            }
        } else {
            return {
                data: []
            }
        }
    } catch (error) {
        throw error
    }
};
const getMatrixList = async (req, res) => {
    try {
        const comercialPlanId = req.params.comercialPlanId;
        const airCommercialPlanId = req.params.airCommercialPlanId;
        const result = await Matrix.findOne({
            comercialPlanId,
            airCommercialPlanId
        });

        if (result) {
            return {
                response: 'Matrix list',
                data: result
            }
        } else {
            return {
                data: []
            }
        }
    } catch (error) {
        throw error
    }
};
const deleteAirCommmercialDetail = async (req, res) => {
    try {

        const id = req.params.airComId;
        const removeAirCom = await AirCommercial.findOneAndDelete({ _id: id });
        if (removeAirCom) {
            return {
                response: "Air Commercial Deleted Sucessfully",
            };
        } else {
            return {
                response: "Air commercial not deleted , Something went wrong",
            };
        }

    } catch (error) {
        throw error;
    }
};
const getSingleAirComList = async (req, res) => {
    try {
        const airComId = req.params.airComId;
        const coloumnData = await AirCommercial.find({ _id: airComId }).populate('carrier').populate('supplier').populate('source');

        if (coloumnData.length > 0) {
            return {
                data: coloumnData,
            }
        } else {
            return {
                response: 'Commercial not available',
                data: null,
            }
        }
    } catch (error) {
        throw error
    }
};
const getCommercialHistoryList = async (req, res) => {
    try {
        const commercialId = req.params.commercialId;
        const coloumnData = await CommercialHistory.find({ commercialId: commercialId })
        .populate([ {path:"newValue.AirCommertialRowMasterId",model:"AirCommertialColumnMaster"},
        {path:"newValue.AirCommertialColumnMasterId",model:"AirCommertialColumnMaster"},
        {path:"oldValue.AirCommertialRowMasterId",model:"AirCommertialColumnMaster"},
        {path:"oldValue.AirCommertialColumnMasterId",model:"AirCommertialColumnMaster"},
            
            {path:'commercialFilterNewValue.commercialFilterId', model:"AirCommercialFilter"},{path:'commercialFilterOldValue.commercialFilterId',model:"AirCommercialFilter"},
           

        ])

    ;
        if (coloumnData.length > 0) {
            return {
                data: coloumnData,
            }
        } else {
            return {
                response: 'Commercial History not available',
                data: null,
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
};
const updateAirCommercialFilter = async (req,res) => {
  try{
    const { id } = req.query;
   const updates = req.body;
   const userData=await user.findById(req.user._id)
 let data = await AirCommercial.find({_id : id});
const updatedAirCommercial = await AirCommercial.findOneAndUpdate(
   { _id : id},
    updates,
    {
      new: true,
    }
  );
    if(updatedAirCommercial){
        const LogsData={
            eventName:"AirCommercial",
            doerId:req.user._id,
        doerName:userData.fname,
    companyId:updatedAirCommercial.companyId,
    oldValue:data[0],
    documentId:id,
    newValue:updatedAirCommercial,
             description:"Edit AirCommercial",
          }
         EventLogs(LogsData)

       return {
        response : "AirCommercial Data Upadted Sucessfully",
        data : updatedAirCommercial
       } 
    }else{
        return {
            response : "AirCommercial Data Not Updated"
        }
    }
  }catch(error){
    console.log(error);
    throw error
  }
};
module.exports = {
    addAirCommercial,
    getColoumnDetail,
    getRowDetail,
    addCommercialType,
    getCommercialDetailList,    
    commercialRowColoumnAdd,
    UpdateMatrixData,
    getAirCommercialListByAirComId,
    getComExcIncList,
    addCommercialFilterExcInc,
    getComIncludeExclude,
    getMatrixList,
    deleteAirCommmercialDetail,
    getSingleAirComList,
    getCommercialHistoryList,
    updateAirCommercialFilter
}