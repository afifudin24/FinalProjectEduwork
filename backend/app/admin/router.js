const router = require('express').Router();
const adminController = require('./controller');
router.get('/countAll', adminController.countAll);
module.exports = router;
