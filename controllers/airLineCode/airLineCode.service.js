const AirLineCode = require('../../models/AirlineCode');
const AirLineCoustmerCare=require('../../models/AirlineCustumerCare')
const getAllAirLineCode = async(req , res) => {
    try {
        const result = await AirLineCode.find({});
        if (result.length > 0) {
            return {
                response: 'AirLine code fetch successfully',
                data: result
            }
        } else {
            return {
                response: 'AirLine code not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const getAirLineCustumereCare = async(req , res) => {
    try {
        const {AirLineCode}=req.body
        const result = await AirLineCoustmerCare.find({airlineCode:{$in:AirLineCode}});
        if (result) {
            return {
                response: 'AirLine code fetch successfully',
                data: result
            }
        } else {
            return {
                response: 'AirLine code not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}
module.exports = {getAllAirLineCode,getAirLineCustumereCare}