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
  status ENUM('ACTIVE','BLOCKED','DELETED') NOT NULL DEFAULT 'ACTIVE',

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