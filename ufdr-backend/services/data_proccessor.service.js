import fs from 'fs';
import path from 'path';
import { call_records } from '../models/callRecord.model.js';
import { contact } from '../models/contact.model.js';
import { chat_records } from '../models/chatRecord.model.js';
import { media_files } from '../models/mediaFile.model.js';
import { UFDRReport } from '../models/ufdrReport.model.js';

export const  process_ufdr_file= async(file,case_number,investigator,title,description,user) => {

const dataProcessor =  file.toString('utf-8');
const data = JSON.parse(dataProcessor);

const ufdrReport = await UFDRReport.create({
    case_number,
    investigator,
    title,
    description,
    user,
    filename: file,
    device_info: data.device_info || {},
    extraction_date: data.extraction_date ? new Date(data.extraction_date) : null,
    processed: true ,
});
console.log(ufdrReport);
const ufdr_report_id = ufdrReport._id;
let call_records_id, contacts_id, chat_records_id
if (data.call_records && Array.isArray(data.call_records)) {
    const callRecordsToInsert = data.call_records.map(record => ({
        ...record,
        ufdr_report_id,
    }));
   call_records_id= await call_records.insertMany(callRecordsToInsert);
}

if (data.contacts && Array.isArray(data.contacts)) {
    const contactsToInsert = data.contacts.map(contactItem => ({
        ...contactItem,
        ufdr_report_id,
    }));
  contacts_id =  await contact.insertMany(contactsToInsert);
}   
if (data.chat_records && Array.isArray(data.chat_records)) {
    const chatRecordsToInsert = data.chat_records.map(chat => ({
        ...chat,        
        ufdr_report_id,
        }));
  chat_records_id =  await chat_records.insertMany(chatRecordsToInsert);
}

return {
    ufdrReport,
    call_records: call_records_id,
    contacts: contacts_id,
    chat_records: chat_records_id,
}

  
}
