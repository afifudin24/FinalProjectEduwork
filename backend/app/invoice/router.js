const router = require('express').Router();
const invoiceController = require('./controller');
const { police_check } = require('../../middlewares/index');
const multer = require('multer');
const os = require('os');
router.get(
  '/invoices/:order_id',
  //   police_check('read', 'Invoice'),
  invoiceController.show,
);

router.put(
  '/invoices/:order_id',
  multer({ dest: os.tmpdir() }).single('image'),
  invoiceController.update,
);

module.exports = router;
