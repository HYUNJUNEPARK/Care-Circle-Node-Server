const express = require('express');
const router = express.Router();

// 모든 라우트를 하나로 통합
//router.use(require('./health'));
router.use('/users', require('./users'));

module.exports = router;