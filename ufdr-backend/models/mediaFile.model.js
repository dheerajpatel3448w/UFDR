// models/mediaFile.model.js
 import mongoose from "mongoose";

const mediaFileSchema = new mongoose.Schema({
    ufdr_report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UFDRReport',
        required: true,
    },
    filename: {
        type: String,
    },
    file_path: {
        type: String,
    },
    file_type: {
        type: String, // e.g., image, video, audio
    },
    file_size: {
        type: Number, // in bytes
    },
    created_date: {
        type: Date,
    },
    modified_date: {
        type: Date,
    },
    hash_md5: {
        type: String,
    },
    hash_sha256: {
        type: String,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
vector:{
        type: [Number], // Array of numbers for vector representation
}
},{
    timestamps:true
});
 export const media_files = mongoose.model('MediaFile', mediaFileSchema);