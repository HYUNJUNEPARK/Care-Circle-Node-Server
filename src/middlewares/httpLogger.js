const httpLogger = (req, res, next) => {
    //요청 로깅
    console.info(
        {
            api: `${req.method} ${req.path}`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        }
    );

    //응답 로깅
    res.on('finish', () => {
        console.info({
            api: `${req.method} ${req.path}`,
            status: res.statusCode,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    });

    next();
}

module.exports = httpLogger;