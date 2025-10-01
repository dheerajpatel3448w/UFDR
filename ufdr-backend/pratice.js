import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { json } from "express";
import { chat_records } from "./models/chatRecord.model.js";
import { call_records } from "./models/callRecord.model.js";
import { contact } from "./models/contact.model.js";
import { connectdb } from "./db/connectdb.js";


/*export async function classifySearchType(userQuery) {
    const ai = new GoogleGenAI({ apiKey:"AIzaSyAQiLeVVh6lnduqpOrOuZIpP2xCXfP9xh0" });
  const prompt = '
    You are a query classifier.
    Decide if the user's query should be answered using:
    - "normal" = keyword / exact text search
    - "semantic" = meaning-based vector search
    

    Examples:
    - Query: "Find all chats containing 'crypto'" → normal
    - Query: "Show me suspicious messages about money laundering" → semantic
    - Query: "Find contact with name Alice" → normal
    - Query: "Who seems suspicious in this case?" → semantic

   


    and also give which schema to use for search 
    1. Call Records
    2. Contacts
    3. Chat Records
    i provide you schema of each collection below:
    Call Records Schema: caller_number, receiver_number, call_type, duration,vector, timestamp
    Contacts Schema: name, phone_numbers, email_addresses, metadata,vector,timestamps
    Chat Records Schema: app_name, sender_number, receiver_number, message_content, timestamp, message_type,vector, is_deleted, metadata

    Based on the query, decide which schema to use for search and mention the schema name in your response.
    For example, if the query is about finding a contact by name, you would respond with "normal, Contacts".
    If the query is about finding suspicious messages, you would respond with "semantic, Chat Records".
    if multiple schema are required then mention those schema name in your response separated by comma.
    Remember, only reply with the classification and schema name, nothing else.
    Your response format should be in json :{
    value: "normal" or "semantic",
    schema: "Call Records" or "Contacts" or "Chat Records" or "Call Records, Contacts" or "Call Records, Chat Records" or "Contacts, Chat Records" or "Call Records, Contacts, Chat Records"
    } 
    
     User query: "${userQuery}"
    '


    // Use ai.generateContent directly
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
    console.log("Response from Gemini:", response.candidates[ 0].content);
    return response.candidates[ 0].content.parts[0].text.replace("json","").replaceAll("'''","");
}

// Example usage (optional, remove in production)
(async () => {
    const query1 = "Find all chats containing crypto";
    const query2 = "What suspicious activity is in this case?";

    console.log(query1, "=>", JSON.parse(await classifySearchType(query1)));
    console.log(query2, "=>", JSON.parse(await classifySearchType(query2)));
})();*/









// Example usage (optional, remove in production)
/*async function main() {
    // Connect to MongoDB first
    connectdb().then(async ()=>{
  console.log("MongoDB connected!");

    const query1 = "Find all chats and contact";
    let chatRecords = JSON.parse(await classifySearchType2(100, "chat_records or contact", query1));
    console.log(query1, "=>", chatRecords.value);
if(Array.isArray(chatRecords.value)){
    for(let chat_query of chatRecords.value){
        const chat_data = await eval(chat_query);
        console.log(chat_data);
    }
}else{
    const chat_data = await eval(chatRecords.value);
    console.log(chat_data);
}
    // Use eval with caution, or better: use Function constructor for safety
    

    // Optionally close connection when done
    await mongoose.disconnect();


    })
  
}

main().catch(console.error);

*/







const raw_results = {
    
        "chat_records": [
            {
                "_id": "68db74627a34ae779023c13d",
                "app_name": "Telegram",
                "sender_number": "Alice",
                "receiver_number": "David",
                "message_content": "Please confirm your attendance.",
                "timestamp": "2025-09-28T14:40:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c13c",
                "app_name": "SMS",
                "sender_number": "Jack",
                "receiver_number": "Charlie",
                "message_content": "Deadline extended by two days.",
                "timestamp": "2025-09-28T13:35:00.000Z",
                "metadata": {
                    "message_length": 30,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c134",
                "app_name": "Telegram",
                "sender_number": "Eve",
                "receiver_number": "David",
                "message_content": "Send me the project files ASAP.",
                "timestamp": "2025-09-28T13:30:00.000Z",
                "metadata": {
                    "message_length": 33,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c143",
                "app_name": "Telegram",
                "sender_number": "Grace",
                "receiver_number": "Jack",
                "message_content": "Team call at 6 PM.",
                "timestamp": "2025-09-28T13:15:00.000Z",
                "metadata": {
                    "message_length": 22,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c13b",
                "app_name": "WhatsApp",
                "sender_number": "Hank",
                "receiver_number": "Ivy",
                "message_content": "Let's catch up tomorrow.",
                "timestamp": "2025-09-28T12:50:00.000Z",
                "metadata": {
                    "message_length": 25,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c133",
                "app_name": "SMS",
                "sender_number": "Alice",
                "receiver_number": "Charlie",
                "message_content": "See you at the party tonight.",
                "timestamp": "2025-09-28T12:45:00.000Z",
                "metadata": {
                    "message_length": 28,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c142",
                "app_name": "SMS",
                "sender_number": "Frank",
                "receiver_number": "Ivy",
                "message_content": "Confirm receipt of files.",
                "timestamp": "2025-09-28T12:30:00.000Z",
                "metadata": {
                    "message_length": 25,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c13a",
                "app_name": "Telegram",
                "sender_number": "Eve",
                "receiver_number": "Frank",
                "message_content": "Please find the attached report.",
                "timestamp": "2025-09-28T12:15:00.000Z",
                "metadata": {
                    "message_length": 30,
                    "contains_links": true,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c141",
                "app_name": "WhatsApp",
                "sender_number": "Eve",
                "receiver_number": "Hank",
                "message_content": "Final review completed.",
                "timestamp": "2025-09-28T11:50:00.000Z",
                "metadata": {
                    "message_length": 25,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c157",
                "app_name": "SMS",
                "sender_number": "Eve",
                "receiver_number": "Frank",
                "message_content": "Urgent: verify identity documents.",
                "timestamp": "2025-09-28T11:35:00.000Z",
                "metadata": {
                    "message_length": 37,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "identity",
                        "verify"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "Frank"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c140",
                "app_name": "Telegram",
                "sender_number": "David",
                "receiver_number": "Grace",
                "message_content": "Update the document by tonight.",
                "timestamp": "2025-09-28T11:20:00.000Z",
                "metadata": {
                    "message_length": 30,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c156",
                "app_name": "Telegram",
                "sender_number": "Alice",
                "receiver_number": "David",
                "message_content": "Crypto transaction flagged as suspicious.",
                "timestamp": "2025-09-28T11:10:00.000Z",
                "metadata": {
                    "message_length": 45,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "crypto",
                        "suspicious"
                    ],
                    "evidence_type": "financial",
                    "related_to": [
                        "David",
                        "John"
                    ]
                }
            },
   
            {
                "_id": "68db74627a34ae779023c151",
                "app_name": "SMS",
                "sender_number": "Bob",
                "receiver_number": "Alice",
                "message_content": "Urgent: update project status.",
                "timestamp": "2025-09-28T09:00:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "project",
                        "update"
                    ],
                    "evidence_type": "coordination",
                    "related_to": [
                        "Alice"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c13e",
                "app_name": "WhatsApp",
                "sender_number": "Bob",
                "receiver_number": "Eve",
                "message_content": "Project discussion at 3 PM.",
                "timestamp": "2025-09-28T08:55:00.000Z",
                "metadata": {
                    "message_length": 30,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c150",
                "app_name": "Telegram",
                "sender_number": "Charlie",
                "receiver_number": "John",
                "message_content": "Document verification completed.",
                "timestamp": "2025-09-28T08:35:00.000Z",
                "metadata": {
                    "message_length": 33,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium",
                    "keywords": [
                        "document",
                        "verification"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "Alice"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c14f",
                "app_name": "WhatsApp",
                "sender_number": "John",
                "receiver_number": "Alice",
                "message_content": "Crypto wallet balance updated.",
                "timestamp": "2025-09-28T08:10:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "crypto",
                        "wallet"
                    ],
                    "evidence_type": "financial",
                    "related_to": [
                        "Alice"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c136",
                "app_name": "SMS",
                "sender_number": "Ivy",
                "receiver_number": "Jack",
                "message_content": "Can you review the document?",
                "timestamp": "2025-09-28T08:00:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c14e",
                "app_name": "SMS",
                "sender_number": "Ivy",
                "receiver_number": "Jack",
                "message_content": "Confirm the payment details ASAP.",
                "timestamp": "2025-09-28T07:40:00.000Z",
                "metadata": {
                    "message_length": 38,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "payment",
                        "confirm"
                    ],
                    "evidence_type": "financial",
                    "related_to": [
                        "Jack"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c137",
                "app_name": "Telegram",
                "sender_number": "Grace",
                "receiver_number": "Alice",
                "message_content": "Reminder: submit your report.",
                "timestamp": "2025-09-28T07:20:00.000Z",
                "metadata": {
                    "message_length": 30,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c14d",
                "app_name": "Telegram",
                "sender_number": "Grace",
                "receiver_number": "Hank",
                "message_content": "Team call at 6 PM. Attendance mandatory.",
                "timestamp": "2025-09-28T07:15:00.000Z",
                "metadata": {
                    "message_length": 50,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium",
                    "keywords": [
                        "meeting",
                        "attendance"
                    ],
                    "evidence_type": "coordination",
                    "related_to": [
                        "Hank"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c14c",
                "app_name": "WhatsApp",
                "sender_number": "Eve",
                "receiver_number": "Frank",
                "message_content": "Did you receive the confidential files?",
                "timestamp": "2025-09-28T06:40:00.000Z",
                "metadata": {
                    "message_length": 42,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "confidential",
                        "files"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "Grace"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c14b",
                "app_name": "SMS",
                "sender_number": "Alice",
                "receiver_number": "David",
                "message_content": "Reminder: submit report by EOD.",
                "timestamp": "2025-09-28T06:15:00.000Z",
                "metadata": {
                    "message_length": 38,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "report",
                        "deadline"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "David"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c145",
                "app_name": "Telegram",
                "sender_number": "Charlie",
                "receiver_number": "John",
                "message_content": "Here is the document you asked for.",
                "timestamp": "2025-09-28T06:00:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": true,
                    "language": "English",
                    "importance": "Medium",
                    "keywords": [
                        "document",
                        "report"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "Alice"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c128",
                "app_name": "Telegram",
                "sender_number": "Charlie",
                "receiver_number": "John",
                "message_content": "Here is the document you asked for.",
                "timestamp": "2025-09-28T06:00:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c11c",
                "app_name": "Telegram",
                "sender_number": "Charlie",
                "receiver_number": "John",
                "message_content": "Here is the document you asked for.",
                "timestamp": "2025-09-28T06:00:00.000Z",
                "metadata": {
                    "message_length": 32,
                    "contains_links": false,
                    "language": "English",
                    "importance": "Medium"
                }
            },
            {
                "_id": "68db74627a34ae779023c14a",
                "app_name": "Telegram",
                "sender_number": "Jack",
                "receiver_number": "Bob",
                "message_content": "Please review the attached contract.",
                "timestamp": "2025-09-28T05:45:00.000Z",
                "metadata": {
                    "message_length": 35,
                    "contains_links": true,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "contract",
                        "review"
                    ],
                    "evidence_type": "documents",
                    "related_to": [
                        "Bob"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c149",
                "app_name": "WhatsApp",
                "sender_number": "Hank",
                "receiver_number": "Ivy",
                "message_content": "Let's finalize the crypto transaction today.",
                "timestamp": "2025-09-28T05:20:00.000Z",
                "metadata": {
                    "message_length": 45,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "crypto",
                        "transaction"
                    ],
                    "evidence_type": "financial",
                    "related_to": [
                        "Jack",
                        "Alice"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c144",
                "app_name": "WhatsApp",
                "sender_number": "John",
                "receiver_number": "Alice",
                "message_content": "Check out this crypto address: abc123xyz",
                "timestamp": "2025-09-28T04:50:00.000Z",
                "metadata": {
                    "message_length": 35,
                    "contains_links": true,
                    "language": "English",
                    "importance": "High",
                    "keywords": [
                        "crypto",
                        "wallet",
                        "address"
                    ],
                    "evidence_type": "financial",
                    "related_to": [
                        "Bob",
                        "Charlie"
                    ]
                }
            },
            {
                "_id": "68db74627a34ae779023c126",
                "app_name": "WhatsApp",
                "sender_number": "John",
                "receiver_number": "Alice",
                "message_content": "Check out this crypto address: abc123xyz",
                "timestamp": "2025-09-28T04:50:00.000Z",
                "metadata": {
                    "message_length": 35,
                    "contains_links": true,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c11a",
                "app_name": "WhatsApp",
                "sender_number": "John",
                "receiver_number": "Alice",
                "message_content": "Check out this crypto address: abc123xyz",
                "timestamp": "2025-09-28T04:50:00.000Z",
                "metadata": {
                    "message_length": 35,
                    "contains_links": true,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c12b",
                "app_name": "SMS",
                "sender_number": "Hank",
                "receiver_number": "Ivy",
                "message_content": "Happy Birthday!",
                "timestamp": "2025-09-27T14:05:00.000Z",
                "metadata": {
                    "message_length": 15,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
            {
                "_id": "68db74627a34ae779023c11f",
                "app_name": "SMS",
                "sender_number": "Hank",
                "receiver_number": "Ivy",
                "message_content": "Happy Birthday!",
                "timestamp": "2025-09-27T14:05:00.000Z",
                "metadata": {
                    "message_length": 15,
                    "contains_links": false,
                    "language": "English",
                    "importance": "High"
                }
            },
          
        ],
        
    }

const query="find all chat"
const ed = await getstructeddata(raw_results,query);
console.log(ed)











    