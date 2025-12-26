const admin = require("../firebaseAdmin");
const ApiError = require("../errors/ApiError");
const ERROR_CODES = require("../errors/errorCodes");

const verifyAuthToken = async(req, res, next) => {
  try {
    //헤더 authroization 필드 토큰 검증 
    const auth = req.headers.authorization || "";
    const match = auth.match(/^Bearer (.+)$/);
    if (auth === "" | !match) {
      throw new ApiError(ERROR_CODES.UNAUTHORIZED);
    }

    //Firebase Auth 에서 토큰 유효성 검증
    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // Firebase가 서버에서 직접 검증한 신뢰 가능한 사용자 정보 결과를 요청 객체(req)에 붙여서 다음 단계에서 재사용(클라이언트에서 변조했을 가능성이 있음)
    req.firebaseUser = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = verifyAuthToken;