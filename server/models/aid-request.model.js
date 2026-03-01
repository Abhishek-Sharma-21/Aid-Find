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
  hospitalName: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  flags: {
    type: Number,
    default: 0,
  },
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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

// Add indexes for optimized querying
aidRequestSchema.index({ requestedBy: 1 });
aidRequestSchema.index({ donatedBy: 1 });
aidRequestSchema.index({ aidType: 1 });
aidRequestSchema.index({ status: 1 });
aidRequestSchema.index({ createdAt: -1 });

export default AidRequest; 