import { call_records } from "../models/callRecord.model.js"
import { contact } from "../models/contact.model.js"
import { chat_records } from "../models/chatRecord.model.js"
import { geminiSetup } from "./gemini.service.js"


export const vectoremmeding = async(result) => {
    console.log("ok");
    for(let chat_record of result.chat_records){
        console.log(chat_record,"ok");
        const data = await geminiSetup(chat_record.message_content);
        console.log(data);
       chat_record.vector = data[0].values;
       await chat_record.save(); 
    }
    for(let call of result.call_records){
                const callText = `
Caller: ${call.caller_number || "Unknown"}
Receiver: ${call.receiver_number || "Unknown"}
Type: ${call.call_type || "Unknown"}
Duration: ${call.duration || 0} seconds
Timestamp: ${call.timestamp ? call.timestamp.toISOString() : "Unknown"}
`;
        const data = await geminiSetup(callText);


       call.vector = data[0].values;
       await call.save(); 
    }
    for(let contact of result.contacts){
        const contactText = `
Name: ${contact.name || "Unknown"}
Phone Numbers: ${contact.phone_numbers?.join(", ") || "None"}
Email Addresses: ${contact.email_addresses?.join(", ") || "None"}
Notes: ${contact.metadata?.notes || "None"}
Organization: ${contact.metadata?.organization || "None"}
`;

        const data = await geminiSetup(contactText);
         contact.vector = data[0].values;
         await contact.save();
    }

    return result;

  
  
}
