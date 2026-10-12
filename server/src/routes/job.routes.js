const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/job.controller');

router.use(auth); // every job route requires a valid JWT

router.get('/', ctrl.list);
router.get('/stats', ctrl.stats); // must stay above '/:id'
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
