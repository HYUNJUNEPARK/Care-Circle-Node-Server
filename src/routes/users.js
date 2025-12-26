const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyAuthToken = require("../middlewares/verifyAuthToken");

//api/users
router.get('/',  verifyAuthToken, userController.getAllUsers);

//api/users
router.delete('/', verifyAuthToken, userController.deleteUser)

//api/users/logged-in
router.get('/logged-in', verifyAuthToken, userController.getLoginUserInfo);

//api/users/exists
router.get('/exists', userController.findUserByEmail);

//api/users/sync
router.post('/sync', verifyAuthToken, userController.syncUser);

//api/users/status
router.patch('/status', verifyAuthToken, userController.changeUserStatus);

module.exports = router;