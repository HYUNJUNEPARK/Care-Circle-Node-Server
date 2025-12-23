const pool = require('../config/database');

/**
 * 모든 사용자 조회
 */
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT * FROM users');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

/**
 * 아이디로 사용자 검색 
 */
const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

/**
 * 이메일 중복 확인
 */
const findUserByEmail = async (req, res) => {
  try {
    // const { email } = req.params;
    const emailRaw = String(req.query.email ?? "").trim();
    // 간단 검증 (필요하면 더 엄격하게)
    if (!emailRaw) {
      return res.status(400).json({
        success: false,
        message: "Missing query param: email",
      });
    }

    // URL에서 들어온 email은 보통 자동 디코딩되지만, 안전하게 한 번 더 처리
    let email = emailRaw;
    try {
      email = decodeURIComponent(emailRaw);
    } catch {
      // 확실하지 않음: 잘못된 인코딩이 들어온 경우
      return res.status(400).json({
        success: false,
        message: "Invalid email encoding",
      });
    }

    console.info(`findUserByEmail`, email)

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(200).json({
        exists: false
      });
    }

    res.json({
      exists: true
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

/**
 * 사용자 동기화
 */
const syncUser = async (req, res) => {

  try {
    const user = req.firebaseUser;
    const uid = user.uid;
    const email = user.email;
    console.log('syncUser called', uid, email);

    // 사용자 존재 여부 확인
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE firebase_uid = ?', [uid]);

    if (existingUsers.length === 0) {
      // 신규 사용자 생성
      await pool.execute('INSERT INTO users (firebase_uid, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [uid, email]);
    } else {
      // 기존 사용자 정보 업데이트
      await pool.execute('UPDATE users SET last_login_at = NOW() WHERE firebase_uid = ?', [uid]);
    }

    return res.json({
      success: true,
      message: 'User synchronized successfully'
    });

  } catch (error) {
    console.error('syncUser:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
}


module.exports = { getAllUsers, findUserByEmail, findUserById, syncUser };