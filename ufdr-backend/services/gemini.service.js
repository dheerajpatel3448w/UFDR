import { GoogleGenAI } from "@google/genai";

export const geminiSetup = async (texts) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    // Ensure texts is always an array of objects with a 'content' property
    const contents = (Array.isArray(texts) ? texts : [texts])

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: contents,
    });

    response.embeddings?.forEach((item, index) => {
        console.log(`Embedding for text ${index}:`, item.values.length);
    });

    return response.embeddings;
};

// Generative model setup



export async function classifySearchType(userQuery) {
    const ai = new GoogleGenAI({ apiKey:process.env.GOOGLE_API_KEY}) ;
  const prompt = `
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
    1. call_records
    2. contact
    3. chat_records
    i provide you schema of each collection below:
     call_records Schema: caller_number, receiver_number, call_type, duration,vector, timestamp
     contact Schema: name, phone_numbers, email_addresses, metadata,vector,timestamps
    chat_records Schema: app_name, sender_number, receiver_number, message_content, timestamp, message_type,vector, is_deleted, metadata

    Based on the query, decide which schema to use for search and mention the schema name in your response.
    For example, if the query is about finding a contact by name, you would respond with "normal, Contacts".
    If the query is about finding suspicious messages, you would respond with "semantic, Chat Records".
    if multiple schema are required then mention those schema name in your response separated by comma.
    Remember, only reply with the classification and schema name, nothing else.
    Your response format should be in json :{
    value: "normal" or "semantic",
    schema: "call_records" or "contact" or "chat_records" or "call_records, contact" or "call_records, chat_records" or "contact, chat_records" or "call_records, contact, chat_records"
    } 
    
     User query: "${userQuery}"
    `;


    // Use ai.generateContent directly
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
    console.log("Response from Gemini:", response.candidates[ 0].content);
    return JSON.parse(response.candidates[ 0].content.parts[0].text.replace("json","").replaceAll("```",""));
}

export async function normalquery(schema_types,user_query,ufdr_report_id) {
  console.log(ufdr_report_id);
    const ai = new GoogleGenAI({ apiKey:process.env.GOOGLE_API_KEY});

    
const prompt2 = `

You are an expert DIGITAL FORENSIC OFFICER and an AI assistant that generates executable MongoDB queries (Mongoose-style) for extracting evidence from UFDR reports. Think like a careful, evidence-focused forensic analyst: precise, non-destructive, minimal projections, include timestamps, default to sorting results by most recent. Handle ONLY NORMAL (non-vector) searches.

CRITICAL: DO NOT EVER RETURN THE EXAMPLE TEMPLATES OR REFERENCE SNIPPETS IN YOUR OUTPUT. The reference templates in this prompt are for developer context only. Your OUTPUT MUST BE ONLY the final executable JavaScript queries tailored to the user's INPUT. No extra text, no templates, no comments outside the code block.

INPUT (replace at runtime):
- Schema Types: {schema_types}    // one or more of: "contact", "chat", "call"
- User Query: "{user_query}"      // user's natural language request
- LIMIT (optional): integer (default 100)

SCHEMAS (field names & default projections — use for building filters & projections):

Contact ('contact') default projection:
{ _id:1, name:1, phone_numbers:1, email_addresses:1, ufdr_report_id:1, createdAt:1 }

Chat Record ('chat_records') default projection:
{ _id:1, app_name:1, sender_number:1, receiver_number:1, message_content:1, timestamp:1, metadata:1 }

Call Record ('call_records') default projection:
{ _id:1, caller_number:1, receiver_number:1, call_type:1, duration:1, timestamp:1, metadata:1 }

MANDATORY RULES FOR OUTPUT:
1. OUTPUT ONLY executable JavaScript Mongoose statements (one or more statements). Nothing else.
2. For each schema in {schema_types}, return ONE OR MORE queries tailored to the user's natural language request. If user asks for multiple schemas, return separate statements for each schema.
3. NEVER generate destructive operations (no delete/update/replace). Only read ops: 'find', 'findOne', 'aggregate' (read-only), or safe helper calls.
4. Default sort: '{ timestamp: -1 }'; if the schema has no 'timestamp' use '{ createdAt: -1 }'.
5. Default limit: '{LIMIT}' if provided else '100'. Always include '.limit(...)' or '$limit' unless user explicitly asks for 'full' records or 'count'.
6. Use the default projections above. If user requests 'full', use projection '{}' but still include '.sort()' and '.limit()'.
7. Use case-insensitive regex for partial text matches (names, message_content): '{ field: { $regex: "<escaped user text>", $options: "i" } }'.
8. Use exact matches for structured fields (phone numbers, ufdr_report_id, app_name).
9. If user specifies a date range, include '{ timestamp: { $gte: ISODate("YYYY-MM-DD"), $lte: ISODate("YYYY-MM-DD") } }'.
10. If user requests 'count', 'summary', or 'timeline', return aggregation pipelines ('$match' + '$count' or '$group') — still only code.
11. Escape regex metacharacters when forming regex filters from user input (emails, dots, etc.).
12. If the user provides explicit limit, date, or ufdr_report_id values in the query text, use them exactly; otherwise apply sensible defaults.
13. If you cannot map the user request to any of the provided schema fields, return a single JS statement that throws an Error with a short message (so the backend can surface it). Example (allowed as only output): 'throw new Error("Could not map request to schema fields: <brief reason>");'
for find and aggregate use ufdr_report_id : 
REFERENCE TEMPLATES (DO NOT OUTPUT — developer reference only):
- contact.find({ufdr_report_id :'${ufdr_report_id}'},...).sort(...).limit(...);
- chat_records.find({ufdr_report_id :'${ufdr_report_id}'},...).sort(...).limit(...);
- call_records.find({ufdr_report_id :'${ufdr_report_id}'},...).sort(...).limit(...);
- call_records.aggregate([...]) for counts/summaries.
- contact.aggregate([...])
- chat_records.aggregate([...])
output format :

 json:{
value:"javascript code"
}

if multiple query you can return like this:
 json:{
value:["javascript code1","javascript code2"];
}

NOW: Based on the INPUT below, PRODUCE ONLY the executable Mongoose queries (no explanation, no templates, no extra lines). Ensure all regex special characters are escaped.

INPUT:
Schema Types: ${schema_types}
User Query: ${user_query}
ufdr_report_id: "${ufdr_report_id}"
LIMIT: ${100}



`

    // Use ai.generateContent directly
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt2,
  });
    console.log("Response from Gemini:", response.candidates[ 0].content);
    return response.candidates[ 0].content.parts[0].text.replace("json","").replaceAll("```","");
}


export const getstructeddata = async(raw_results,query) => {
      const ai = new GoogleGenAI({ apiKey:process.env.GOOGLE_API_KEY});
console.log(query);
const prompt2 = `
## ROLE AND CONTEXT:
You are a Digital Forensic Analysis Assistant for a UFDR (Universal Forensic Data Repository) project. Your task is to analyze raw database query results from call records, chat records, and contact data, then extract and present forensically significant information in a structured, actionable format.

## INPUT DATA STRUCTURES:
You will receive raw MongoDB results from these collections:

### CALL RECORDS SCHEMA:
- caller_number, receiver_number, call_type, duration, timestamp, metadata

### CHAT RECORDS SCHEMA: 
- app_name, sender_number, receiver_number, message_content, timestamp, message_type, is_deleted, metadata

### CONTACTS SCHEMA:
- name, phone_numbers, email_addresses, metadata

## ANALYSIS INSTRUCTIONS:

### 1. DATA TYPE IDENTIFICATION:
First identify which types of data are present in the results:
- Only Call Records
- Only Chat Records  
- Only Contacts
- Mixed data (specify which combinations)

### 2. FORENSIC ANALYSIS FRAMEWORK:
For each data type present, extract the following forensic information:

#### FOR CALL RECORDS:
- **Communication Patterns**: Frequent numbers, call duration patterns, time distribution
- **Suspicious Indicators**: Unknown numbers, unusual call times, short-duration repeated calls
- **Timeline Analysis**: Call frequency peaks, gaps in communication
- **Relationship Mapping**: Identify primary contacts and their call patterns

#### FOR CHAT RECORDS:
- **Content Analysis**: Keywords indicating suspicious activity, emotional tone
- **Application Usage**: Which apps are used most, encrypted vs non-encrypted
- **Deletion Patterns**: Check is_deleted flags for potential evidence tampering
- **Media Sharing**: Message_type analysis for file sharing patterns
- **Conversation Clusters**: Group related messages by time and participants

#### FOR CONTACTS:
- **Contact Network**: Size of contact list, categorization attempts
- **Duplicate Analysis**: Same person with multiple numbers
- **Suspicious Entries**: Contacts without names, international numbers
- **Email Correlation**: Link contacts with email patterns

### 3. CROSS-REFERENCE ANALYSIS:
- **Number Linking**: Connect numbers across calls, chats, and contacts
- **Timeline Correlation**: Match call events with chat conversations
- **Relationship Validation**: Verify if frequent contacts exist in contact list

### 4. EVIDENCE HIGHLIGHTS:
Extract and categorize:
- **CRITICAL EVIDENCE**: Directly incriminating content
- **SUPPORTING EVIDENCE**: Patterns supporting conclusions  
- **CONTEXTUAL EVIDENCE**: Background information
- **ANOMALIES**: Unusual patterns requiring investigation

### 5. INVESTIGATIVE SUGGESTIONS:
Provide specific next steps for investigators:
- Numbers to investigate further
- Time periods to focus on
- Additional data to request
- Potential leads to follow

## OUTPUT FORMAT REQUIREMENTS:
Present analysis in this exact structure:

### EXECUTIVE SUMMARY
[2-3 paragraph overview of key findings]

### DATA COMPOSITION
- Call Records: X records found
- Chat Records: Y records found  
- Contacts: Z records found
- Time Range: [Start] to [End]

### KEY FINDINGS

#### COMMUNICATION PATTERNS
[Analysis of calling/messaging behavior]

#### SUSPICIOUS ACTIVITIES
[Red flags and anomalies detected]

#### RELATIONSHIP NETWORK
[Mapping of key contacts and their interactions]

### EVIDENCE CATEGORIZATION

🟥 **CRITICAL EVIDENCE**
- [List significant direct evidence]

🟨 **SUPPORTING EVIDENCE** 
- [List corroborating patterns]

🟩 **CONTEXTUAL EVIDENCE**
- [List background information]

### TIMELINE ANALYSIS
[Chronological significant events]

### INVESTIGATIVE RECOMMENDATIONS
1. [Priority action 1]
2. [Priority action 2] 
3. [Additional steps]

### TECHNICAL DETAILS
[Raw data statistics and technical observations]

## IMPORTANT NOTES:
- Focus on forensic relevance, not just data presentation
- Highlight patterns over individual data points
- Suggest concrete investigative next steps
- Maintain legal and ethical analysis standards
- Cross-reference across all available data types
- Consider both content and metadata significance 
 USER QUERY: "${query}"
    
    RAW RESULTS: ${JSON.stringify(raw_results)}
    
    Please analyze this forensic data and provide comprehensive insights.
    
Do not include any extra text, comments, or trailing commas.
The JSON structure should have the following keys:
- "EXECUTIVE_SUMMARY"
- "DATA_COMPOSITION"
- "KEY_FINDINGS"
- "EVIDENCE_CATEGORIZATION"
- "TIMELINE_ANALYSIS"
- "INVESTIGATIVE_RECOMMENDATIONS"
- "TECHNICAL_DETAILS"

All values should be valid JSON types (string, number, array, object, boolean, null). 
Make sure there are **no duplicate keys** and **no extra commas**.
    output for result in json:{
  value:{your structured data}
    }
`


    // Use ai.generateContent directly
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt2,
  });
    console.log("Response from Gemini:", response.candidates[ 0].content);
    return response.candidates[ 0].content.parts[0].text.replace("json","").replaceAll("```","")
  
}

export const solveparsing = async(data,err) => {
console.log("error come");
  const ai = new GoogleGenAI({ apiKey:process.env.GOOGLE_API_KEY});
  const prompt2 = `
  this is data : ${data}
  this is err :${err}
  solve this err give me anwer in json format - json:{
  {your correct data}
  }  
  remeber does not change any content only solve error 
  `
   const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt2,
  });
    console.log("Response from Gemini:", response.candidates[ 0].content);
    return response.candidates[ 0].content.parts[0].text.replace("json","").replaceAll("```","")
  
}




 