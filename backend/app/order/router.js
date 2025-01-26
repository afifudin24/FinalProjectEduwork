const router = require('express').Router();
const { police_check } = require('../../middlewares/index');
const orderController = require('./controller');

router.post(
  '/orders',
  // police_check('create', 'Order'),
  orderController.store,
);

router.get('/orders', police_check('view', 'Order'), orderController.index);
router.get('/getAllOrder', orderController.getAllOrder);
router.put(
  '/order/:id',
  police_check('Update', 'Order'),
  orderController.update,
);
router.get(
  '/getReportOrder',
  police_check('view', 'Order'),
  orderController.report,
);

module.exports = router;
