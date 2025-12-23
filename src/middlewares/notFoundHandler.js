const notFoundHandler = (req, res, next) => {
  console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = notFoundHandler;