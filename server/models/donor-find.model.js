import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  contactNumber: {
    type: String,
    required: true,
    match: /^\+?[1-9]\d{1,14}$/, // E.164 international phone format
  },
  location: {
    type: String,
    required: true,
    minlength: 3,
  },
  donorType: {
    type: String,
    required: true,
    enum: ["Blood", "Medicine", "Oxygen", "Other"],
  },
  details: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Donor", donorSchema);
