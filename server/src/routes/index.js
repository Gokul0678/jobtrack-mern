const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/jobs', require('./job.routes'));

module.exports = router;
