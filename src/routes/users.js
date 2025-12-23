const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyAuthToken = require("../middlewares/verifyAuthToken");

//api/users
router.get('/', verifyAuthToken, userController.getAllUsers);

//api/users/id
// router.get('/:id', userController.findUserById);

//api/users/exists
router.get('/exists', userController.findUserByEmail);

//api/users/sync
router.post('/sync', verifyAuthToken, userController.syncUser);

module.exports = router;