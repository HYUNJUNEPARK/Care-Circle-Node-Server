const admin = require("firebase-admin");
const path = require("path");

// serviceAccountKey.json 경로 ./serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, ".", "serviceAccountKey.json");

// JSON 로드
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;