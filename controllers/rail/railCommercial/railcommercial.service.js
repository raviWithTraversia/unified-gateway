const User=require('../../../models/User')
const railCommercial=require('../../../models/Irctc/Railcommercial')
const companies=require('../../../models/Company');


const createCommercialPlan=async(req,res)=>{
    try{
const {companyId,modifyBy,Conveniencefee,Agent_service_charge,PG_charges,description}=req.body;
const requiredFields=["companyId","modifyBy","Conveniencefee","Agent_service_charge","PG_charges","description"];
const missingFields = requiredFields.filter(field => !req.body[field]);

if (missingFields.length > 0) {
  return ({
    response: `The following fields are missing or null: ${missingFields.join(", ")}`
  });
}


const companyData=await companies.findById(companyId)
        if(!companyData&&companyData.type!=="TMC"){
            return ({
                response:"TMC ID Required"
            })
        }

await railCommercial.create(
    {companyId:companyId,modifyBy:modifyBy,Conveniencefee:Conveniencefee,Agent_service_charge:Agent_service_charge,PG_charges:PG_charges,description:description}
)
return({
    response:"railCommercial Create succefully"
})

    }
    catch(error){
        throw error
    }
}


const FindTmcCommercial=async(req,res)=>{
    try{
        const {companyId}=req.params;
        if(!companyId){
            return({
                response:"companyId is required"
            })
        }
        const companyData=await companies.findById(companyId)
        if(!companyData&&companyData.type!=="TMC"){
            return ({
                response:"TMC ID Required"
            })
        }

        const railAllCommercial=await railCommercial.find({companyId:companyId})
        if(railAllCommercial.length<=0){
            return({
                response:"rail Commercial Data not found"
            })
        }

        return({
            response:"rail Commercial found Succefully",
            data:railAllCommercial
        })

    }
    catch(error){
        throw error
    }
}

const FindOneCommercial=async(req,res)=>{
    try{
        const {id}=req.params
    if(!id){
        return({
            response:"please provide Id"
        })
    }
    console.log(id)

    const commercialData=await railCommercial.findById(id)

    if(!commercialData){
        return ({
            response:'Data not found'
        })
    }

    return ({
        response:"Commercial Data found Succefully",
        data:commercialData
    })
    }catch(error){
        throw error
    }
    
}

const updateOneCommercial=async(req,res)=>{
    try{
        const {id}=req.params
        const {companyId,Conveniencefee,Agent_service_charge,PG_charges,description}=req.body;

    if(!id){
        return({
            response:"please provide Id"
        })
    }
    const requiredFields = ["companyId", "Conveniencefee", "Agent_service_charge", "PG_charges", "description"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return ({
        response: `The following fields are missing or null: ${missingFields.join(", ")}`
      });
    }


    const companyData=await companies.findById(companyId)
    if(!companyData&&companyData.type!=="TMC"){
        return ({
            response:"TMC ID Required"
        })
    }

    const commercialData=await railCommercial.findByIdAndUpdate(id,{$set: {Conveniencefee:Conveniencefee,Agent_service_charge:Agent_service_charge,PG_charges:PG_charges,description:description}},{new:true})

    if(!commercialData){
        return ({
            response:'Data not found'
        })
    }

    return ({
        response:"Update Commercial Succefully",
    })
    }catch(error){
        throw error
    }
    
}


const deleteOneCommercial=async(req,res)=>{
    try{
        const {id}=req.params
        const userId=req.body.userId

    if(!id){
        return({
            response:"please provide Id"
        })
    }
    // if(!userId){
    //     return({
    //         response:"please provide userId"
    //     })
    // }


    // const userData=await User.findById(userId).populate("company_ID")
    // if(userData.company_ID.type!=="TMC"){
    //     return({
    //         response:"please provide Tmc Id"
    //     })

    // }

    
    

    const commercialData=await railCommercial.findByIdAndDelete(id)

    if(!commercialData){
        return ({
            response:'Data not found'
        })
    }

    return ({
        response:"Delete Commercial Succefully",
    })
 } catch(error){
        throw error
    }
    
}

module.exports={createCommercialPlan,FindTmcCommercial,updateOneCommercial,FindOneCommercial,deleteOneCommercial}