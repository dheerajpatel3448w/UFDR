import mongoose from 'mongoose';

const ufdrReportSchema = new mongoose.Schema({
    case_number: { type: String, required: true, unique: true },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: String,
    description: String,
    investigator: String,
    status: { type: String, default: 'active' },

    // UFDR specific fields
    filename: String,
    device_info:{
        type: mongoose.Schema.Types.Mixed,

    },
    extraction_date:{
        type: Date,
    },
    processed: { type: Boolean, default: false }
}, { timestamps: true });



// Note: The relationships to other models are defined in the other models
// via a reference ('ref') to this 'UFDRReport' model.
// You can query them using .populate()
export const UFDRReport = mongoose.model('UFDRReport', ufdrReportSchema);