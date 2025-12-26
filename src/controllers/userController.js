const admin = require('../firebaseAdmin');
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
    console.error(`getAllUsers`, error);
    next(error);
  }
};

/**
 * 로그인 사용자 정보 조회
 */
const getLoginUserInfo = async (req, res, next) => {
  try {
    const user = req.firebaseUser;
    const uid = user.uid;

    const [users] = await pool.execute('SELECT * FROM users WHEN uid = ?', [uid])
    if (users.length === 0) {
      throw new ApiError(ERROR_CODES.USER_NOT_FOUND, "login user info is not found");
    }

    return res.status(200).json(
      {
        success: true,
        data: users[0]
      }
    );

  } catch (error) {
    console.error(`getLoginUserInfo`, error);
    next(error);
  }
}

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
    console.error(`findUserByEmail`, error);
    next(error);
  }
};

/**
 * 계정 삭제(완전 삭제)
 */
const deleteUserByUid = async (req, res, next) => {
  try {
    const uid = req.firebaseUser.uid
    if (!uid) {
      throw new ApiError(ERROR_CODES.MISSING_REQUIRED_PARAM, "uid param");
    }

    // DB에서 사용자 유무 조회
    const [users] = await pool.execute('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
    if (users.length === 0) {
      //사용자가 없는 경우
      throw new ApiError(ERROR_CODES.USER_NOT_FOUND, "not found user in DB");
    }

    const user = users[0];
    //console.error(`testLog 111 ${user}`);
    console.error(`testLog 222 ${uid}`);

    // FB Auth 에서 삭제
    await admin.auth().deleteUser(uid);

    // DB 에서 삭제
    await pool.execute('DELETE FROM users WHERE firebase_uid = ?', [uid]);

    return res.json(
      {
        success: true,
        data: "delete success"
      }
    );
  } catch (error) {
    console.error(`deleteUserByUid`, error);
    next(error)
  }
}


/**
 * 사용자 정보 동기화
 */
const syncUser = async (req, res, next) => {
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
    console.error(`syncUser`, error);
    next(error);
  }
}

module.exports = { getAllUsers, getLoginUserInfo, findUserByEmail, syncUser, deleteUserByUid };