import fs from 'fs';
import { process_ufdr_file } from '../services/data_proccessor.service.js';
import { vectoremmeding } from '../services/vector.service.js';
import { classifySearchType, getstructeddata, normalquery, solveparsing } from '../services/gemini.service.js';
import { chat_records } from '../models/chatRecord.model.js';
import { call_records } from '../models/callRecord.model.js';
import { contact } from '../models/contact.model.js';
import { UFDRReport } from '../models/ufdrReport.model.js';
import { report } from 'process';
import { jsonrepair } from 'jsonrepair';
export const uploadUfdrFile = async (req, res) => {
    
   const tempFilePath = req.file.buffer;
   const user = req.user._id;
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, detail: "No file uploaded." });
        }
        
        const { case_number, investigator ,title,description} = req.body;
        console.log(`📁 Received file: ${req.file.originalname}`);
        console.log(`📋 Case number: ${case_number}`);
        
        console.log("🔄 Starting UFDR file processing...");
        const result = await process_ufdr_file(
            tempFilePath, case_number, investigator,title,description,user
        );
       
            const vector = await vectoremmeding(result);
            console.log("✅ Data indexed into vector DB", vector);
        res.json({
            success: true,
            message: "UFDR file processed successfully",
            filename: req.file.originalname,
            file_size: req.file.size,
            case_number,
            investigator,
            result
        });

    } catch (error) {
        console.error(`❌ Error processing UFDR file: ${error.message}`);
        res.status(500).json({ detail: `Error processing UFDR file: ${error.message}` });
    } finally {
        // Clean up temporary file
        if (tempFilePath) {
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
                else console.log(`🗑️ Cleaned up temporary file`);
            });
        }
    }
};

export const queryresolver = async(req,res) => {
    const {query,ufdrId} = req.body;
    console.log(query,ufdrId);
     const result = await classifySearchType(query);
        console.log(result);
        if(!result){
            return res.status(500).json({ detail: `Error classifying the query` });
        }
    if(result.value === "normal"){
        const result2 = JSON.parse(await normalquery(result.schema,query,ufdrId));
        if(!result2){
            return res.status(500).json({ detail: `Error processing the query` });
        }
         
    console.log(query, "=>", result2.value);
     let result_data2 ={};
if(Array.isArray(result2.value)){
    for(let result_query of result2.value){
      const  result_data = await eval(result_query);
        result_data2[`${result_query.split(".")[0]}`] = result_data;
    }
}else{
     const result_data = await eval(result2.value)
        result_data2[`${result2.value.split(".")[0]}`] = result_data;

}
console.log(result_data2);


        return res.status(200).json({ result: result_data2, message: "Query processed successfully", success: true });
    }






        return res.status(200).json({ message: "Query processed successfully", success: true });
    

  
}

export const getallreport = async(req,res) => {
    const user = req.user._id;
    const data = await UFDRReport.find({user})
console.log(data);
    if(!data){
        return res.status(400).json({message:"error"});
    }

    return res.status(200).json({report:data,message:"successful"});
  
}

export const queryresolver2 = async(req,res) => {
   const {query,raw_result} = req.body; 
  const getuserfreindlydata = await getstructeddata(raw_result,query);
console.log(getuserfreindlydata)
let data2;
try {
    data2 =  JSON.parse(getuserfreindlydata);
    console.log(data2)
       return res.status(200).json({result:data2,message:"get successfully",success: true });
} catch (err) {
    console.log(err);
    const data3 = await solveparsing(getuserfreindlydata,err);
    const data4 =JSON.parse(data3);

  return res.status(200).json({result:data4,message:"get successfully",success: true });
}



}

