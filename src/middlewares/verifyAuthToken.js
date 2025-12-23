const admin = require("../firebaseAdmin");

const verifyAuthToken = async(req, res, next) => {
  try {
    const auth = req.headers.authorization || "";

    console.log(`Authorization Header:`, auth);

    const match = auth.match(/^Bearer (.+)$/);

    if (!match) {
      return res.status(500).json(
        {
          success: false,
          message: "Invalid Format Token"
        }
      );
    }

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    console.info("Firebase token verified\n", decoded);

    // Firebase가 서버에서 직접 검증한 신뢰 가능한 사용자 정보 결과를 요청 객체(req)에 붙여서 다음 단계에서 재사용
    req.firebaseUser = decoded;

    return next();
  } catch (err) {
    console.error("Firebase token verification failed", { error: String(err) });
    return res.status(401).json({ success: false, message: "Invalid token", error: String(err) });
  }
}

module.exports = verifyAuthToken;