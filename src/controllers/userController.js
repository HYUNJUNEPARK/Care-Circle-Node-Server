const pool = require('../config/database');
const ApiError = require("../errors/ApiError");
const ERROR_CODES = require("../errors/errorCodes")

/**
 * 모든 사용자 조회
 */
const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.execute('SELECT * FROM users');

    return res.json(
      {
        success: true,
        data: users
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 이메일 중복 확인
 */
const findUserByEmail = async (req, res, next) => {
  try {

    const emailRaw = String(req.query.email ?? "").trim();
    if (!emailRaw) {
      throw new ApiError(ERROR_CODES.MISSING_REQUIRED_PARAM, "email param");
    }

    // URL에서 들어온 email은 보통 자동 디코딩되지만, 안전하게 한 번 더 처리
    const email = decodeURIComponent(emailRaw);

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    //사용자가 존재하지 않는 경우
    if (users.length === 0) {
      return res.status(200).json(
        {
          success: true,
          exists: false
        }
      );
    }

    //사용자가 존재하는 경우
    return res.json(
      {
        success: true,
        exists: true
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 정보 동기화
 */
const syncUser = async (req, res) => {
  try {
    const user = req.firebaseUser;
    const uid = user.uid;
    const email = user.email;
    if (!uid) throw new ApiError(ERROR_CODES.MISSING_REQUIRED_PARAM, "uid");
    if (!email) throw new ApiError(ERROR_CODES.MISSING_REQUIRED_PARAM, "email");

    // DB 사용자 존재 여부 확인
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE firebase_uid = ?', [uid]);

    if (existingUsers.length === 0) {
      // 신규 사용자 정보 저장(동기화)
      await pool.execute('INSERT INTO users (firebase_uid, email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [uid, email]);
    } else {
      // 기존 사용자 정보에 로그인 시간 업데이트
      await pool.execute('UPDATE users SET last_login_at = NOW() WHERE firebase_uid = ?', [uid]);
    }

    return res.json(
      {
        success: true,
        message: 'User synchronized successfully'
      }
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 아이디로 사용자 검색 
 */
// const findUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);

//     if (users.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: users[0]
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };


module.exports = { getAllUsers, findUserByEmail, syncUser };