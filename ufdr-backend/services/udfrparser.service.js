const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const sqlite3 = require('sqlite3').verbose();
const AdmZip = require('adm-zip');
const { parse: csvParse } = require('csv-parse/sync');

class UFDRParser {
    constructor() {
        this.supportedFormats = ['.ufdr'];
    }

    async parseUfdrFile(filePath) {
        const fileExtension = path.extname(filePath).toLowerCase();
        if (fileExtension !== '.ufdr') {
            throw new Error("Only .ufdr files are supported");
        }

        // Check if file is ZIP
        if (await this.isZipFile(filePath)) {
            return await this.parseZipUfdr(filePath);
        } else {
            // Try as JSON
            return await this.parseJsonUfdr(filePath);
        }
    }

    async isZipFile(filePath) {
        try {
            const buffer = Buffer.alloc(4);
            const fd = await fs.promises.open(filePath, 'r');
            await fd.read(buffer, 0, 4, 0);
            await fd.close();
            return buffer.toString('hex') === '504b0304'; // ZIP signature
        } catch (error) {
            return false;
        }
    }

    async parseZipUfdr(filePath) {
        console.log(`🔍 Parsing UFDR archive (ZIP): ${filePath}`);
        
        const zip = new AdmZip(filePath);
        const zipEntries = zip.getEntries();
        
        let reportRoot = null;
        let pathMap = {};
        
        // Find and parse report.xml
        const reportXmlEntry = this.findReportXml(zipEntries);
        if (reportXmlEntry) {
            reportRoot = await this.readReportXml(reportXmlEntry);
            pathMap = this.buildPathMapFromReport(reportRoot);
        }

        const parsed = {
            device_info: reportRoot ? this.extractDeviceInfoFromReport(reportRoot) : {},
            chat_records: [],
            call_records: [],
            contacts: [],
            media_files: [],
            metadata: {
                extraction_date: new Date(),
                case_info: reportRoot ? this.extractCaseInfoFromReport(reportRoot) : {}
            }
        };

        // Process each entry in ZIP
        for (const entry of zipEntries) {
            if (entry.isDirectory) continue;

            const lowerName = entry.entryName.toLowerCase();
            
            try {
                if (lowerName.endsWith('.db') || lowerName.endsWith('.sqlite') || lowerName.endsWith('.sqlite3')) {
                    await this.extractFromSqlite(entry, pathMap, parsed);
                } else if (lowerName.endsWith('.csv')) {
                    await this.extractFromCsv(entry, parsed);
                } else if (lowerName.endsWith('.json')) {
                    await this.extractFromJson(entry, parsed);
                }
            } catch (error) {
                console.log(`⚠️ Extraction error for ${entry.entryName}: ${error.message}`);
            }
        }

        console.log(
            `✅ UFDR extraction (ZIP): chats=${parsed.chat_records.length}, calls=${parsed.call_records.length}, contacts=${parsed.contacts.length}, media=${parsed.media_files.length}`
        );
        
        return parsed;
    }

    findReportXml(entries) {
        for (const entry of entries) {
            const lowerName = entry.entryName.toLowerCase();
            if (lowerName.endsWith('.xml') && lowerName.includes('report')) {
                return entry;
            }
        }
        // Fallback: any XML file
        for (const entry of entries) {
            if (entry.entryName.toLowerCase().endsWith('.xml')) {
                return entry;
            }
        }
        return null;
    }

    async readReportXml(entry) {
        const content = entry.getData().toString('utf8');
        return new Promise((resolve, reject) => {
            xml2js.parseString(content, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    buildPathMapFromReport(root) {
        const pathMap = {};
        
        // Traverse XML structure to find file elements
        const traverse = (node) => {
            if (typeof node === 'object' && node !== null) {
                if (node.file) {
                    for (const fileElem of [].concat(node.file)) {
                        const info = {};
                        
                        // Extract attributes
                        if (fileElem.$) {
                            Object.assign(info, fileElem.$);
                        }
                        
                        // Extract metadata
                        if (fileElem.metadata && fileElem.metadata[0] && fileElem.metadata[0].item) {
                            const metadata = fileElem.metadata[0];
                            if (metadata.$ && metadata.$.section) {
                                info.section = metadata.$.section;
                            }
                            
                            for (const item of [].concat(metadata.item)) {
                                if (item.$ && item.$.name === 'Local Path' && item._) {
                                    info.local_path = item._;
                                    pathMap[item._] = info;
                                }
                            }
                        }
                        
                        // Fallback index by path
                        if (info.path) {
                            pathMap[info.path] = info;
                        }
                    }
                }
                
                // Recursively traverse all properties
                for (const key in node) {
                    traverse(node[key]);
                }
            }
        };
        
        traverse(root);
        return pathMap;
    }

    extractDeviceInfoFromReport(root) {
        const deviceInfo = {};
        
        const findDeviceInfo = (node) => {
            if (typeof node === 'object' && node !== null) {
                if (node.device_info || node.device || node.Device) {
                    const deviceElem = node.device_info || node.device || node.Device;
                    const device = deviceElem[0] || deviceElem;
                    
                    const tags = ['make', 'model', 'imei', 'android_version', 'build_number', 'os_version', 'manufacturer'];
                    for (const tag of tags) {
                        if (device[tag] && device[tag][0]) {
                            const key = ['make', 'manufacturer'].includes(tag) ? 'manufacturer' : tag;
                            deviceInfo[key] = device[tag][0];
                        }
                    }
                    return true;
                }
                
                for (const key in node) {
                    if (findDeviceInfo(node[key])) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        findDeviceInfo(root);
        return deviceInfo;
    }

    extractCaseInfoFromReport(root) {
        const caseInfo = {};
        
        const findCaseInfo = (node) => {
            if (typeof node === 'object' && node !== null) {
                if (node.case_info || node.case || node.Case) {
                    const caseElem = node.case_info || node.case || node.Case;
                    const caseData = caseElem[0] || caseElem;
                    
                    const tags = ['case_number', 'examiner', 'description', 'extraction_date', 'number', 'investigator'];
                    for (const tag of tags) {
                        if (caseData[tag] && caseData[tag][0]) {
                            const key = tag === 'number' ? 'case_number' : tag;
                            caseInfo[key] = caseData[tag][0];
                        }
                    }
                    return true;
                }
                
                for (const key in node) {
                    if (findCaseInfo(node[key])) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        findCaseInfo(root);
        return caseInfo;
    }

    async extractFromSqlite(entry, pathMap, parsed) {
        return new Promise((resolve, reject) => {
            // Create temporary file for SQLite
            const tempPath = path.join(__dirname, 'temp', `temp_${Date.now()}.db`);
            const tempDir = path.dirname(tempPath);
            
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            fs.writeFileSync(tempPath, entry.getData());
            
            const db = new sqlite3.Database(tempPath, sqlite3.OPEN_READONLY, (err) => {
                if (err) {
                    fs.unlinkSync(tempPath);
                    reject(err);
                    return;
                }

                // Get all tables
                db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
                    if (err) {
                        db.close();
                        fs.unlinkSync(tempPath);
                        reject(err);
                        return;
                    }

                    const schema = {};
                    let tablesProcessed = 0;

                    tables.forEach(tableRow => {
                        const tableName = tableRow.name;
                        db.all(`PRAGMA table_info('${tableName}')`, (err, columns) => {
                            if (err) {
                                console.log(`⚠️ Error getting schema for ${tableName}: ${err.message}`);
                            } else {
                                schema[tableName] = columns.map(col => col.name);
                            }

                            tablesProcessed++;
                            if (tablesProcessed === tables.length) {
                                // All schemas collected, now extract data
                                this.extractChatsFromSqlite(db, schema, parsed);
                                this.extractCallsFromSqlite(db, schema, parsed);
                                this.extractContactsFromSqlite(db, schema, parsed);
                                this.extractMediaFromSqlite(db, schema, parsed);
                                
                                db.close();
                                fs.unlinkSync(tempPath);
                                resolve();
                            }
                        });
                    });

                    if (tables.length === 0) {
                        db.close();
                        fs.unlinkSync(tempPath);
                        resolve();
                    }
                });
            });
        });
    }

    hasColumns(cols, required) {
        const colsLower = cols.map(c => c.toLowerCase());
        return required.every(req => colsLower.includes(req.toLowerCase()));
    }

    extractChatsFromSqlite(db, schema, parsed) {
        for (const [tableName, columns] of Object.entries(schema)) {
            try {
                const lowerCols = columns.map(c => c.toLowerCase());
                
                // Find relevant columns
                const textCandidates = lowerCols.filter(c => 
                    ['data', 'message', 'body', 'text', 'content'].some(k => c.includes(k))
                );
                const senderCandidates = lowerCols.filter(c =>
                    ['sender', 'from', 'author', 'address', 'src', 'caller'].some(k => c.includes(k))
                );
                const receiverCandidates = lowerCols.filter(c =>
                    ['receiver', 'to', 'dest', 'remote', 'chat', 'recipient', 'callee'].some(k => c.includes(k))
                );
                const tsCandidates = lowerCols.filter(c =>
                    ['time', 'date', 'timestamp'].some(k => c.includes(k))
                );

                if (textCandidates.length === 0) continue;

                const selectCols = [];
                const selSender = senderCandidates[0] ? columns[lowerCols.indexOf(senderCandidates[0])] : null;
                const selReceiver = receiverCandidates[0] ? columns[lowerCols.indexOf(receiverCandidates[0])] : null;
                const selText = columns[lowerCols.indexOf(textCandidates[0])];
                const selTs = tsCandidates[0] ? columns[lowerCols.indexOf(tsCandidates[0])] : null;

                if (selSender) selectCols.push(selSender);
                if (selReceiver) selectCols.push(selReceiver);
                selectCols.push(selText);
                if (selTs) selectCols.push(selTs);

                const query = `SELECT ${selectCols.join(', ')} FROM ${tableName}`;
                
                db.all(query, (err, rows) => {
                    if (err) return;

                    for (const row of rows) {
                        let idx = 0;
                        const sender = selSender ? row[selSender] : null;
                        if (selSender) idx++;
                        const receiver = selReceiver ? row[selReceiver] : null;
                        if (selReceiver) idx++;
                        const content = row[selText];
                        idx++;
                        const timestamp = selTs ? row[selTs] : null;

                        parsed.chat_records.push({
                            app_name: 'Chat',
                            sender_number: sender,
                            receiver_number: receiver,
                            message_content: content,
                            timestamp: this.coerceTimestamp(timestamp),
                            message_type: 'text',
                            is_deleted: false,
                            metadata: { source_table: tableName }
                        });
                    }
                });
            } catch (error) {
                // Skip table if error occurs
                continue;
            }
        }
    }

    extractCallsFromSqlite(db, schema, parsed) {
        const callTables = Object.entries(schema).filter(([table, cols]) =>
            this.hasColumns(cols, ['number', 'type', 'duration']) || 
            this.hasColumns(cols, ['caller', 'receiver', 'duration'])
        );

        for (const [tableName, columns] of callTables) {
            try {
                const colSet = new Set(columns.map(c => c.toLowerCase()));
                let query;

                if (colSet.has('caller') && colSet.has('receiver') && colSet.has('duration')) {
                    query = `SELECT caller, receiver, duration, type, date FROM ${tableName}`;
                } else {
                    query = `SELECT number, number, duration, type, date FROM ${tableName}`;
                }

                db.all(query, (err, rows) => {
                    if (err) return;

                    for (const row of rows) {
                        const [a, b, duration, callType, dateVal] = Object.values(row);
                        parsed.call_records.push({
                            caller_number: a,
                            receiver_number: b,
                            call_type: callType ? String(callType) : 'unknown',
                            duration: duration ? parseInt(duration) : 0,
                            timestamp: this.coerceTimestamp(dateVal),
                            metadata: { source_table: tableName }
                        });
                    }
                });
            } catch (error) {
                console.log(`⚠️ Call extraction error from ${tableName}: ${error.message}`);
            }
        }
    }

    extractContactsFromSqlite(db, schema, parsed) {
        for (const [tableName, columns] of Object.entries(schema)) {
            try {
                const lowerCols = columns.map(c => c.toLowerCase());
                
                const nameCols = lowerCols.filter(c => 
                    ['display_name', 'name', 'given_name'].some(k => c.includes(k))
                );
                const phoneCols = lowerCols.filter(c => 
                    ['phone', 'number', 'msisdn'].some(k => c.includes(k))
                );
                const emailCols = lowerCols.filter(c => c.includes('email'));

                if (nameCols.length === 0) continue;

                const selectCols = [columns[lowerCols.indexOf(nameCols[0])]];
                if (phoneCols.length > 0) selectCols.push(columns[lowerCols.indexOf(phoneCols[0])]);
                if (emailCols.length > 0) selectCols.push(columns[lowerCols.indexOf(emailCols[0])]);

                const query = `SELECT ${selectCols.join(', ')} FROM ${tableName}`;
                
                db.all(query, (err, rows) => {
                    if (err) return;

                    for (const row of rows) {
                        const values = Object.values(row);
                        let idx = 0;
                        
                        const name = values[idx++];
                        const phoneNumbers = [];
                        const emailAddresses = [];

                        if (phoneCols.length > 0) {
                            const val = values[idx++];
                            if (val !== null && String(val).trim() !== '') {
                                phoneNumbers.push(String(val));
                            }
                        }

                        if (emailCols.length > 0) {
                            const val = values[idx];
                            if (val !== null && String(val).trim() !== '') {
                                emailAddresses.push(String(val));
                            }
                        }

                        parsed.contacts.push({
                            name: name,
                            phone_numbers: phoneNumbers,
                            email_addresses: emailAddresses,
                            metadata: { source_table: tableName }
                        });
                    }
                });
            } catch (error) {
                continue;
            }
        }
    }

    extractMediaFromSqlite(db, schema, parsed) {
        for (const [tableName, columns] of Object.entries(schema)) {
            try {
                const lowerCols = columns.map(c => c.toLowerCase());
                
                let filenameCol = null;
                let pathCol = null;
                let mimeCol = null;
                let sizeCol = null;
                let createdCol = null;
                let modifiedCol = null;

                for (const col of lowerCols) {
                    if (!filenameCol && ['filename', 'name'].some(k => col.includes(k))) {
                        filenameCol = columns[lowerCols.indexOf(col)];
                    }
                    if (!pathCol && ['_data', 'path', 'file_path', 'local_path'].some(k => col.includes(k))) {
                        pathCol = columns[lowerCols.indexOf(col)];
                    }
                    if (!mimeCol && ['mime', 'file_type', 'type'].some(k => col.includes(k))) {
                        mimeCol = columns[lowerCols.indexOf(col)];
                    }
                    if (!sizeCol && col.includes('size')) {
                        sizeCol = columns[lowerCols.indexOf(col)];
                    }
                    if (!createdCol && ['date_added', 'created'].some(k => col.includes(k))) {
                        createdCol = columns[lowerCols.indexOf(col)];
                    }
                    if (!modifiedCol && ['date_modified', 'modified'].some(k => col.includes(k))) {
                        modifiedCol = columns[lowerCols.indexOf(col)];
                    }
                }

                const selectCols = [];
                if (pathCol || filenameCol) selectCols.push(pathCol || filenameCol);
                if (mimeCol) selectCols.push(mimeCol);
                if (sizeCol) selectCols.push(sizeCol);
                if (createdCol) selectCols.push(createdCol);
                if (modifiedCol) selectCols.push(modifiedCol);

                if (selectCols.length === 0) continue;

                const query = `SELECT ${selectCols.join(', ')} FROM ${tableName}`;
                
                db.all(query, (err, rows) => {
                    if (err) return;

                    for (const row of rows) {
                        const values = Object.values(row);
                        let idx = 0;
                        
                        const pathOrName = values[idx++];
                        const mime = mimeCol ? values[idx++] : null;
                        const size = sizeCol ? values[idx++] : null;
                        const created = createdCol ? values[idx++] : null;
                        const modified = modifiedCol ? values[idx] : null;

                        const filename = pathCol && pathOrName ? 
                            path.basename(pathOrName) : 
                            (filenameCol ? pathOrName : null);

                        parsed.media_files.push({
                            filename: filename,
                            file_path: pathCol ? pathOrName : null,
                            file_type: mime,
                            file_size: size ? parseInt(size) : 0,
                            created_date: this.coerceTimestamp(created),
                            modified_date: this.coerceTimestamp(modified),
                            hash_md5: null,
                            hash_sha256: null,
                            metadata: { source_table: tableName }
                        });
                    }
                });
            } catch (error) {
                continue;
            }
        }
    }

    async extractFromCsv(entry, parsed) {
        try {
            const content = entry.getData().toString('utf8');
            const records = csvParse(content, { columns: true });
            
            // Simple extraction logic for CSV
            for (const record of records) {
                const lowerKeys = Object.keys(record).map(k => k.toLowerCase());
                
                // Check if this looks like a contact
                if (lowerKeys.some(k => ['name', 'display_name'].includes(k))) {
                    const nameKey = Object.keys(record).find(k => 
                        ['display_name', 'name'].includes(k.toLowerCase())
                    );
                    const phoneKey = Object.keys(record).find(k => 
                        ['phone', 'number', 'msisdn'].some(p => k.toLowerCase().includes(p))
                    );
                    const emailKey = Object.keys(record).find(k => 
                        k.toLowerCase().includes('email')
                    );

                    if (nameKey && record[nameKey]) {
                        parsed.contacts.push({
                            name: record[nameKey],
                            phone_numbers: phoneKey && record[phoneKey] ? [String(record[phoneKey])] : [],
                            email_addresses: emailKey && record[emailKey] ? [String(record[emailKey])] : [],
                            metadata: { source_table: entry.entryName }
                        });
                    }
                }
            }
        } catch (error) {
            console.log(`⚠️ CSV extraction error for ${entry.entryName}: ${error.message}`);
        }
    }

    async extractFromJson(entry, parsed) {
        try {
            const content = entry.getData().toString('utf8');
            const data = JSON.parse(content);
            
            this.extractFromJsonObject(entry.entryName, data, parsed);
        } catch (error) {
            console.log(`⚠️ JSON extraction error for ${entry.entryName}: ${error.message}`);
        }
    }

    extractFromJsonObject(name, obj, parsed) {
        if (typeof obj !== 'object' || obj === null) return;

        // Update device info if present
        if (obj.device_info && typeof obj.device_info === 'object') {
            Object.assign(parsed.device_info, obj.device_info);
        }

        const mappings = [
            ['chat_records', 'chat_records'],
            ['messages', 'chat_records'],
            ['calls', 'call_records'],
            ['call_records', 'call_records'],
            ['contacts', 'contacts'],
            ['media', 'media_files'],
            ['media_files', 'media_files']
        ];

        for (const [srcKey, target] of mappings) {
            const arr = obj[srcKey];
            if (Array.isArray(arr)) {
                for (const item of arr) {
                    if (typeof item !== 'object' || item === null) continue;

                    if (target === 'chat_records') {
                        parsed.chat_records.push({
                            app_name: item.app_name,
                            sender_number: item.sender || item.sender_number,
                            receiver_number: item.receiver || item.receiver_number,
                            message_content: item.message || item.message_content,
                            timestamp: this.coerceTimestamp(item.timestamp),
                            message_type: item.message_type || 'text',
                            is_deleted: Boolean(item.is_deleted || false),
                            metadata: item.metadata || {}
                        });
                    } else if (target === 'call_records') {
                        parsed.call_records.push({
                            caller_number: item.caller || item.caller_number,
                            receiver_number: item.receiver || item.receiver_number,
                            call_type: item.type || item.call_type || 'unknown',
                            duration: item.duration ? parseInt(item.duration) : 0,
                            timestamp: this.coerceTimestamp(item.timestamp),
                            metadata: item.metadata || {}
                        });
                    } else if (target === 'contacts') {
                        let phones = item.phone_numbers;
                        if (!phones && item.phone !== undefined) {
                            phones = [String(item.phone)];
                        }
                        let emails = item.email_addresses;
                        if (!emails && item.email !== undefined) {
                            emails = [String(item.email)];
                        }

                        parsed.contacts.push({
                            name: item.name,
                            phone_numbers: phones || [],
                            email_addresses: emails || [],
                            metadata: item.metadata || {}
                        });
                    } else if (target === 'media_files') {
                        parsed.media_files.push({
                            filename: item.filename,
                            file_path: item.file_path || item.path,
                            file_type: item.file_type || item.mime,
                            file_size: item.file_size ? parseInt(item.file_size) : 0,
                            created_date: this.coerceTimestamp(item.created_date),
                            modified_date: this.coerceTimestamp(item.modified_date),
                            hash_md5: item.hash_md5,
                            hash_sha256: item.hash_sha256,
                            metadata: item.metadata || {}
                        });
                    }
                }
            }
        }
    }

    async parseJsonUfdr(filePath) {
        console.log(`🔍 Parsing UFDR JSON payload: ${filePath}`);
        
        let data;
        try {
            const content = await fs.promises.readFile(filePath, 'utf8');
            data = JSON.parse(content);
        } catch (error) {
            throw new Error(`Failed to read UFDR JSON: ${error.message}`);
        }

        const parsed = {
            device_info: data.device_info || {},
            chat_records: [],
            call_records: [],
            contacts: [],
            media_files: [],
            metadata: data.metadata || { extraction_date: new Date() }
        };

        // Check for direct arrays
        const hasDirectArrays = ['chat_records', 'call_records', 'contacts', 'media_files']
            .some(key => key in data);

        if (hasDirectArrays) {
            // Extract from direct arrays
            if (Array.isArray(data.chat_records)) {
                for (const chat of data.chat_records) {
                    parsed.chat_records.push({
                        app_name: chat.app_name,
                        sender_number: chat.sender_number,
                        receiver_number: chat.receiver_number,
                        message_content: chat.message_content,
                        timestamp: this.coerceTimestamp(chat.timestamp),
                        message_type: chat.message_type || 'text',
                        is_deleted: Boolean(chat.is_deleted || false),
                        metadata: chat.metadata || {}
                    });
                }
            }

            if (Array.isArray(data.call_records)) {
                for (const call of data.call_records) {
                    parsed.call_records.push({
                        caller_number: call.caller_number,
                        receiver_number: call.receiver_number,
                        call_type: call.call_type || 'unknown',
                        duration: call.duration ? parseInt(call.duration) : 0,
                        timestamp: this.coerceTimestamp(call.timestamp),
                        metadata: call.metadata || {}
                    });
                }
            }

            if (Array.isArray(data.contacts)) {
                for (const contact of data.contacts) {
                    parsed.contacts.push({
                        name: contact.name,
                        phone_numbers: contact.phone_numbers || [],
                        email_addresses: contact.email_addresses || [],
                        metadata: contact.metadata || {}
                    });
                }
            }

            if (Array.isArray(data.media_files)) {
                for (const media of data.media_files) {
                    parsed.media_files.push({
                        filename: media.filename,
                        file_path: media.file_path,
                        file_type: media.file_type,
                        file_size: media.file_size ? parseInt(media.file_size) : 0,
                        created_date: this.coerceTimestamp(media.created_date),
                        modified_date: this.coerceTimestamp(media.modified_date),
                        hash_md5: media.hash_md5,
                        hash_sha256: media.hash_sha256,
                        metadata: media.metadata || {}
                    });
                }
            }
        } else {
            // Recursive traversal
            this.traverseAndExtract(data, parsed);
        }

        console.log(
            `✅ UFDR extraction (JSON): chats=${parsed.chat_records.length}, calls=${parsed.call_records.length}, contacts=${parsed.contacts.length}, media=${parsed.media_files.length}`
        );

        return parsed;
    }

    traverseAndExtract(obj, parsed) {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                this.traverseAndExtract(item, parsed);
            }
            return;
        }

        if (typeof obj !== 'object' || obj === null) {
            return;
        }

        const lowerKeys = Object.keys(obj).map(k => k.toLowerCase());

        // Check for chat-like objects
        if (lowerKeys.some(k => ['message', 'message_content', 'text', 'body', 'content'].includes(k))) {
            const messageKey = Object.keys(obj).find(k => 
                ['message', 'message_content', 'text', 'body', 'content'].includes(k.toLowerCase())
            );
            
            parsed.chat_records.push({
                app_name: obj.app_name,
                sender_number: obj.sender || obj.sender_number || obj.from || obj.author,
                receiver_number: obj.receiver || obj.receiver_number || obj.to || obj.recipient,
                message_content: obj[messageKey],
                timestamp: this.coerceTimestamp(obj.timestamp || obj.date || obj.time),
                message_type: obj.message_type || 'text',
                is_deleted: Boolean(obj.is_deleted || false),
                metadata: obj.metadata || {}
            });
        }

        // Check for call-like objects
        if (lowerKeys.includes('duration') && 
            (lowerKeys.some(k => ['caller', 'caller_number', 'number'].includes(k)) || 
             lowerKeys.some(k => ['receiver', 'receiver_number', 'callee'].includes(k)))) {
            
            parsed.call_records.push({
                caller_number: obj.caller || obj.caller_number || obj.number,
                receiver_number: obj.receiver || obj.receiver_number || obj.callee,
                call_type: obj.type || obj.call_type || 'unknown',
                duration: obj.duration ? parseInt(obj.duration) : 0,
                timestamp: this.coerceTimestamp(obj.timestamp || obj.date || obj.time),
                metadata: obj.metadata || {}
            });
        }

        // Check for contact-like objects
        if (lowerKeys.some(k => ['name', 'display_name'].includes(k)) && 
            (lowerKeys.some(k => k.includes('phone')) || lowerKeys.some(k => k.includes('email')))) {
            
            let phones = obj.phone_numbers;
            if (!phones) {
                for (const [key, value] of Object.entries(obj)) {
                    if (key.toLowerCase().includes('phone') && (typeof value === 'string' || typeof value === 'number')) {
                        phones = [String(value)];
                        break;
                    }
                }
            }

            let emails = obj.email_addresses;
            if (!emails) {
                for (const [key, value] of Object.entries(obj)) {
                    if (key.toLowerCase().includes('email') && (typeof value === 'string' || typeof value === 'number')) {
                        emails = [String(value)];
                        break;
                    }
                }
            }

            parsed.contacts.push({
                name: obj.name || obj.display_name,
                phone_numbers: phones || [],
                email_addresses: emails || [],
                metadata: obj.metadata || {}
            });
        }

        // Check for media-like objects
        if (lowerKeys.some(k => k === 'filename') || 
            (lowerKeys.some(k => ['path', 'file_path', '_data'].includes(k)) && 
             lowerKeys.some(k => ['mime', 'file_type', 'type'].includes(k)))) {
            
            const filename = obj.filename || 
                (obj.path || obj.file_path ? path.basename(obj.path || obj.file_path) : null);

            parsed.media_files.push({
                filename: filename,
                file_path: obj.file_path || obj.path,
                file_type: obj.file_type || obj.mime || obj.type,
                file_size: obj.file_size ? parseInt(obj.file_size) : 0,
                created_date: this.coerceTimestamp(obj.created_date || obj.date_added),
                modified_date: this.coerceTimestamp(obj.modified || obj.modified_date || obj.date_modified),
                hash_md5: obj.hash_md5,
                hash_sha256: obj.hash_sha256,
                metadata: obj.metadata || {}
            });
        }

        // Continue traversal
        for (const value of Object.values(obj)) {
            this.traverseAndExtract(value, parsed);
        }
    }

    coerceTimestamp(value) {
        if (value === null || value === undefined) {
            return null;
        }

        try {
            if (typeof value === 'number') {
                // Handle milliseconds (common in JavaScript)
                if (value > 1e12) {
                    return new Date(value);
                } else {
                    // Assume seconds, convert to milliseconds
                    return new Date(value * 1000);
                }
            }

            if (typeof value === 'string') {
                if (/^\d+$/.test(value)) {
                    const numValue = parseInt(value);
                    if (numValue > 1e12) {
                        return new Date(numValue);
                    } else {
                        return new Date(numValue * 1000);
                    }
                } else {
                    // Try to parse as ISO string or other date format
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                }
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // Additional helper methods would go here...
}

module.exports = UFDRParser;