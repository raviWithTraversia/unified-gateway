const EventLogModel=require('../../models/Logs/EventLogs')

const  Eventlog=async(LogData)=>{
    try{
const EventData=new EventLogModel(LogData)
EventData.save()
    }catch(error){
console.log("error saving log",error)
    }
}


module.exports=Eventlog