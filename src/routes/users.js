const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyAuthToken = require("../middlewares/verifyAuthToken");

//api/users
router.get('/', userController.getAllUsers);

//api/users
router.delete('/', verifyAuthToken, userController.deleteUserByUid)

//api/users/me
router.get('/me', verifyAuthToken, userController.getLoginUserInfo);

//api/users/exists
router.get('/exists', userController.findUserByEmail);

//api/users/sync
router.post('/sync', verifyAuthToken, userController.syncUser);

module.exports = router;