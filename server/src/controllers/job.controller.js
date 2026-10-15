const asyncHandler = require("../utils/asyncHandler");
const jobService = require("../services/job.service");

exports.list = asyncHandler(async (req, res) =>
  res.json(await jobService.list(req.userId, req.query)),
);
exports.stats = asyncHandler(async (req, res) =>
  res.json(await jobService.stats(req.userId)),
);
exports.create = asyncHandler(async (req, res) =>
  res.status(201).json(await jobService.create(req.userId, req.body)),
);
exports.update = asyncHandler(async (req, res) =>
  res.json(await jobService.update(req.userId, req.params.id, req.body)),
);
exports.remove = asyncHandler(async (req, res) => {
  await jobService.remove(req.userId, req.params.id);
  res.json({ deleted: true });
});
