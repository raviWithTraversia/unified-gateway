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


const addAirCommercial = async(req , res) => {
    try {
        
        const {
            commercialAirPlanId,
            travelType,
            carrier,
            commercialCategory,
            supplier,
            source,
            priority,
            companyId
        } = req.body;
        if(!commercialAirPlanId) {
            return {
                response : 'Commercial air plan Id field are required'
            }
        }
        if(!travelType) {
            return {
                response : 'Travel Type field are required'
            }
        }
        if(!carrier) {
            return {
                response : 'Carrier field are required'
            }
        }
        if(!supplier) {
            return {
                response : 'Supplier field are required'
            }
        }
        if(!priority) {
            return {
                response : 'Priority field are required'
            }
        }
        const saveAirCommercial = new AirCommercial({
            commercialAirPlanId,
            travelType,
            carrier,
            commercialCategory,
            supplier,
            source,
            priority,
            companyId
        });
        
        const result = await saveAirCommercial.save();

        return {
            response : 'Air Commercial created successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getColoumnDetail = async(req , res) => {
    try {
        const coloumnData = await AirCommercialColoumnMaster.find();
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


const getRowDetail = async(req , res) => {
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


const addCommercialType = async(req ,res) => {
    try {
        const {
            airCommercialId, 
            AirCommertialColumnMasterId,
            AirCommertialRowMasterId,
            companyId,
            textType
        } = req.body;
        if(!airCommercialId || !AirCommertialColumnMasterId || !AirCommertialRowMasterId || !companyId || !textType){
            return {
                response : 'All fields are required'
            }
        }else{
            
            const checkComType =  new CommercialType.findOne({
                airCommercialId,
                AirCommertialColumnMasterId,
                AirCommertialRowMasterId,
                companyId
            });

            if(checkComType) {
                
                const saveResult = await CommercialType.findByIdAndUpdate(
                    checkComType._id,
                    {
                    airCommercialId,
                    AirCommertialColumnMasterId,
                    AirCommertialRowMasterId,
                    companyId,
                    textType
                },
                { new: true }
                );
                const result =saveResult.save();
                return {
                    response : "Air commercial type added successfully"
                }
            }else{
                const saveResult = new CommercialType({
                    airCommercialId,
                    AirCommertialColumnMasterId,
                    AirCommertialRowMasterId,
                    companyId,
                    textType
                });
                const result =saveResult.save();
                return {
                    response : "Air commercial type added successfully"
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

const getCommercialDetailList = async(req , res) => {
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



const commercialRowColoumnAdd = async(req ,res) =>{
   try {
    const {name , commercialType , type , modifiedBy} = req.body;
    if(!name || !commercialType || !type || !modifiedBy) {
        return {
            response : 'All fields are required'
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
        response : "Commercial row / coloumn created successfully"
    }    

   } catch (error) {
        throw error
   }
}


const UpdateMatrixData = async(req , res) => {
    try {
        const {
            comercialPlanId, 
            airCommercialPlanId,
            ComanyId,
            rateValue,
            fixedValue
        } = req.body;
        
        if(!comercialPlanId || !airCommercialPlanId || !ComanyId ) {
            return {
                response : "All field are required",
            }  
        }

        const checkDataExist = await Matrix.findOne({
            airCommercialPlanId: airCommercialPlanId,
            comercialPlanId: comercialPlanId,
        });
      
        if(checkDataExist) {
            
            let resultAll = await Matrix.findByIdAndUpdate(
                checkDataExist._id,
                {
                    comercialPlanId,
                    airCommercialPlanId,
                    ComanyId,
                    rateValue,
                    fixedValue
                },
                { new: true }
            );
            if(resultAll) {
                return {
                    response : "Matrix updated successfully",
                }  
            }else{
                return {
                    response : "Something went wrong!!",
                }   
            }

        }else{
            // const rateValueData = req.body.rateValue;
            const saveDataMatrix = new Matrix({
                comercialPlanId,
                airCommercialPlanId,
                ComanyId,
                rateValue,
                fixedValue
            });
            let resultAll = await saveDataMatrix.save();
            if(!resultAll) {
                return {
                    response : "Matrix updated successfully",
                }  
            }else{
                return {
                    response : "Something went wrong!!",
                }   
            }
        }

    } catch (error) {
        throw error;
    }
}


const getAirCommercialListByAirComId = async(req ,res) => {
    try {
        const airCommercialPlanId = req.params.airCommercialPlanId;
        const coloumnData = await AirCommercial.find({commercialAirPlanId : airCommercialPlanId}).populate('carrier').populate('supplier').populate('source');
        
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

        const checkExist = await AirCommercialFilter.findOne({
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
            
            let data = result.save();
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

const getComExcIncList = async(req ,res) => {
    try {
        const comercialIncExc = await AirCommercialFilter.find({})
        
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
}


const getComIncludeExclude = async(req ,res) => {
    try {
        const commercialAirPlanId = req.params.commercialAirPlanId;
        const airCommercialId = req.params.airCommercialId;
        const result = await CommercialFilterExcInd.find({
            commercialAirPlanId,
            airCommercialId
        });
        
        if(result.length > 0) {
            return {
                response : 'Commercial include exclude list',
                data : result
            }
        }else{
            return {
                data : []
            }
        }
    } catch (error) {
        throw error
    }
}



const getMatrixList = async(req ,res) => {
    try {
        const comercialPlanId = req.params.comercialPlanId;
        const airCommercialPlanId = req.params.airCommercialPlanId;
        const result = await Matrix.find({
            comercialPlanId,
            airCommercialPlanId
        });
        
        if(result.length > 0) {
            return {
                response : 'Matrix list',
                data : result
            }
        }else{
            return {
                data : []
            }
        }
    } catch (error) {
        throw error
    }
}


const deleteAirCommmercialDetail = async(req ,res) => {
    try {
        
        const id = req.params.airComId;
        const removeAirCom = await AirCommercial.findOneAndDelete({_id : id});
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
} 


const getSingleAirComList = async(req ,res) => {
    try {
        const airComId = req.params.airComId;
        const coloumnData = await AirCommercial.find({_id : airComId}).populate('carrier').populate('supplier').populate('source');
        
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
    getSingleAirComList
}