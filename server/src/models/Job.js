const mongoose = require("mongoose");

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: "Applied" },
    link: String,
    notes: String,
    appliedOn: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
module.exports.STATUSES = STATUSES;
