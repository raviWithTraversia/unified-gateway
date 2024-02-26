const seriesDepartureGroupModel = require('../../models/SeriesDepartureGroup');

const addSeriesDepartureGroup = async (req,res) => {
    try{
        if ( !req.body.groupName ) {
            return {
                 response: 'Missing required fields in request body'
          }
        };
        let count = 0;
         count = req?.body?.seriesDepartureIds?.length;
        req.body.count = count;
          const newSeriesDepartureGroup = new seriesDepartureGroupModel(req.body);
          await newSeriesDepartureGroup.save();
          return{
            response : 'Series Departure Group created successfully',
             data: newSeriesDepartureGroup
          }
    }catch(error){
        console.log(error);
        throw error;
    }
};
const getSeriesDepartureGroup = async (req ,res) =>{
  try{
    const seriesDepartureGroup = await seriesDepartureGroupModel.findById(req.query.id).populate('seriesDepartureIds').populate({
      path: 'userId',
      select: 'fname lastName', 
    }); 
    if(seriesDepartureGroup){
        return {
            response : 'Series Departure Group Data Found Sucessfully',
             data: seriesDepartureGroup
        }
    }
      return {
        response :'Series Departure Group not found'
      }
  }catch(error){
    console.log(error);
        throw error;
  }
};

const updatedSeriesDepartureGroup = async (req,res) => {
    try {
        const updatedSeriesDepartureGroup = await seriesDepartureGroupModel.findByIdAndUpdate(
          req.qery.id,
          req.body,
          { new: true, runValidators: true } 
        );
        if (!updatedSeriesDepartureGroup) {
          return {
            response : 'Series Departure Group not found' 
          }
        }
        return {
            response : 'Series Departure Group updated successfully',
            data: updatedSeriesDepartureGroup
        }
      } catch (error) {
        if (error.name === 'ValidationError') { 
            return {
                response : ValidationError,
                data : error.message
            }
        } else {
          console.log(error);
          throw error
        }
      }
}

module.exports = {
    addSeriesDepartureGroup,
    getSeriesDepartureGroup ,
    updatedSeriesDepartureGroup 
}