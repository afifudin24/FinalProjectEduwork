const router = require('express').Router();
const UserController = require('./controller');
const { police_check } = require('../../middlewares/index');

router.get('/getUsers', police_check('get', 'User'), UserController.getAll);
router.post('/addUser', police_check('create', 'User'), UserController.store);
router.delete(
  '/deleteUser/:id',
  police_check('delete', 'User'),
  UserController.destroy,
);
module.exports = router;
