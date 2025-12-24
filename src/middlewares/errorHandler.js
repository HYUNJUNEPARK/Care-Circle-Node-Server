// 에러 핸들링 미들웨어
const errorHandler = (err, req, res, next) => {
  // 서버용 로그
  console.error(
    "===== 에러 핸들링 미들워어 =====\n",
    err,
    {
      path: req.originalUrl,
      method: req.method,
      error: err.stack || err,
    }
  );

  const statusCode = err.statusCode || 500;

  // 클라이언트 응답 포맷 통일
  res.status(statusCode).json(
    {
      success: err.success,
      code: err.code,
      message: err.message,
      detail: err.detail
    }
  );
};

module.exports = errorHandler;