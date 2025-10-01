// models/contact.model.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    ufdr_report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UFDRReport',
        required: true,
    },
    name: {
        type: String,
    },
    phone_numbers: {
        type: [String], // Array of strings for phone numbers
    },
    email_addresses: {
        type: [String], // Array of strings for emails
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

export const contact = mongoose.model('Contact', contactSchema);