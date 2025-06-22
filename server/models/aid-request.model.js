import mongoose from "mongoose";

const aidRequestSchema = new mongoose.Schema({
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  aidType: {
    type: String,
    enum: ["Blood", "Medicine", "Oxygen", "Other"],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Fulfilled", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AidRequest = mongoose.model("AidRequest", aidRequestSchema);
export default AidRequest; 