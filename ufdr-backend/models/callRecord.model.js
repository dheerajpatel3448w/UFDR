// models/callRecord.model.js
import mongoose from "mongoose";

const callRecordSchema = new mongoose.Schema({
    ufdr_report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UFDRReport',
        required: true,
    },
    caller_number: {
        type: String,
    },
    receiver_number: {
        type: String,
    },
    call_type: {
        type: String, // e.g., incoming, outgoing, missed
    },
    duration: {
        type: Number, // in seconds
    },
    timestamp: {
        type: Date,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    vector:{
        type: [Number], // Array of numbers for vector representation

    }
},{
    timestamps:true,
});

export const call_records = mongoose.model('CallRecord', callRecordSchema);