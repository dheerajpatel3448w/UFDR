
import mongoose from "mongoose";

const chatRecordSchema = new mongoose.Schema({
    ufdr_report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UFDRReport', // This creates the relationship
        required: true,
    },
    app_name: {
        type: String, // e.g., WhatsApp, Telegram
    },
    sender_number: {
        type: String,
    },
    receiver_number: {
        type: String,
    },
    message_content: {
        type: String,
    },
    timestamp: {
        type: Date,
    },
    message_type: {
        type: String, // e.g., text, image, video
    },
    is_deleted: {
        type: Boolean,
        default: false,
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

export const chat_records = mongoose.model('ChatRecord', chatRecordSchema);