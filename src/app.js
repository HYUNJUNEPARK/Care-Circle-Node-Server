const express = require("express");
const cors = require("cors");
const config = require('./config/server');
const routes = require('./routes');
const app = express();

const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler')
//const verifyAuthToken = require("./middlewares/verifyAuthToken");
const httpLogger = require("./middlewares/httpLogger");

// CORS 설정
app.use(cors(config.cors));

// 요청, 응답 로깅
app.use(httpLogger);

// JSON 바디 파서
app.use(express.json());

// AUTH 토큰 검증 미들웨어
//app.use(verifyAuthToken);

// API 라우트
app.use('/api', routes);

// 에러 핸들링
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;