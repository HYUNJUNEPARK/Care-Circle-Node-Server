npm init -y
→ package.json 생성.

npm install express cors dotenv
→ cors: CORS 허용 (나중에 웹/앱에서 호출할 때 편함)
→ dotenv: 환경변수(.env) 파일 읽기

npm install --save-dev nodemon
→ nodemon: 코드 변경 시 서버 자동 재시작 (개발용)


npm i express firebase-admin cors
-> Firebase 연동 

/*
사용자 정보 DB

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,

  role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  status ENUM('ACTIVE','INACTIVE','BLOCKED','DELETED') NOT NULL DEFAULT 'ACTIVE',

  display_name VARCHAR(255) NULL,
  photo_url VARCHAR(1024) NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL,
  deleted_at DATETIME NULL,

  UNIQUE KEY uq_users_firebase_uid (firebase_uid),
  UNIQUE KEY uq_users_email (email)
);

*/

===ERROR LIST===

FirebaseAppError: Error while making request: self-signed certificate in certificate chain. Error code: SELF_SIGNED_CERT_IN_CHAIN
-> 
회사/사내/보안 네트워크 환경애서 Node.js 실행 환경이 신뢰하지 못하는 인증서가 네트워크 중간에 끼어 있음
package.json 에 "dev": "nodemon app.js" -> "dev": "NODE_TLS_REJECT_UNAUTHORIZED=0 nodemon app.js" 
```
  "scripts": {
    "start": "node server.js",
    "dev": "NODE_TLS_REJECT_UNAUTHORIZED=0 nodemon app.js"
  },
```