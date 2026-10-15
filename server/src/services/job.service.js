const mongoose = require("mongoose");
const Job = require("../models/Job");
const ApiError = require("../utils/ApiError");

const pick = (b) => ({
  company: b.company,
  role: b.role,
  status: b.status,
  link: b.link,
  notes: b.notes,
  appliedOn: b.appliedOn,
});
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.list = (userId, { status, q } = {}) => {
  const filter = { user: userId };
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ company: rx }, { role: rx }];
  }
  return Job.find(filter).sort("-appliedOn");
};

exports.stats = async (userId) => {
  const rows = await Job.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const stats = Object.fromEntries(Job.STATUSES.map((s) => [s, 0]));
  rows.forEach((r) => {
    stats[r._id] = r.count;
  });
  return stats;
};

exports.create = (userId, data) => Job.create({ ...pick(data), user: userId });

exports.update = async (userId, id, data) => {
  const job = await Job.findOneAndUpdate(
    { _id: id, user: userId },
    pick(data),
    { new: true, runValidators: true },
  );
  if (!job) throw new ApiError(404, "Application not found");
  return job;
};

exports.remove = async (userId, id) => {
  const job = await Job.findOneAndDelete({ _id: id, user: userId });
  if (!job) throw new ApiError(404, "Application not found");
};
