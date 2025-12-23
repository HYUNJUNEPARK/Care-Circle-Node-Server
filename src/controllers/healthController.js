const pool = require('../config/database');

// Health 체크 컨트롤러
const healthCheck = async (req, res) => {
  try {
    // 데이터베이스 연결 상태 확인 및 users 테이블 데이터 조회
    //const [users] = await pool.execute('SELECT * FROM users');

    res.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      // database: {
      //   status: "connected",
      //   usersCount: users.length,
      //   users: users
      // }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      status: "error",
      serverTime: new Date().toISOString(),
      // database: {
      //   status: "error",
      //   message: error.message
      // }
    });
  }
};

module.exports = { healthCheck };