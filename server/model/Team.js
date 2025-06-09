import mongoose from "mongoose";

const Team = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now }
})

export default mongoose.model('Team', Team);
