const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const db = new sqlite3.Database(path.join(__dirname, '../data.db'));

// 初始化数据库表
db.serialize(() => {
  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // 进度表
  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      lessons_completed INTEGER DEFAULT 0,
      quizzes_completed INTEGER DEFAULT 0,
      weak_subject TEXT,
      weak_topic TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 测验记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      question TEXT,
      user_answer TEXT,
      is_correct INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

// 用户注册
function createUser(username, password, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hash],
      function(err) {
        if (err) return callback(err);
        db.run(
          'INSERT INTO user_progress (user_id, lessons_completed, quizzes_completed, weak_subject, weak_topic) VALUES (?, 0, 0, "Math", "Fractions")',
          [this.lastID],
          (err) => callback(err, this.lastID)
        );
      }
    );
  });
}

// 用户登录
function getUserByUsername(username, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], callback);
}

// 获取用户进度
function getUserProgress(userId, callback) {
  db.get('SELECT * FROM user_progress WHERE user_id = ?', [userId], callback);
}

// 更新用户进度（测验后）
function updateProgress(userId, isCorrect, question, topic, callback) {
  db.run(
    'INSERT INTO quiz_attempts (user_id, question, user_answer, is_correct) VALUES (?, ?, ?, ?)',
    [userId, question, 'submitted', isCorrect ? 1 : 0],
    (err) => {
      if (err) return callback(err);
      if (!isCorrect) {
        db.run(
          'UPDATE user_progress SET weak_topic = ? WHERE user_id = ?',
          [topic, userId],
          callback
        );
      } else {
        callback(null);
      }
    }
  );
}

// 增加课程完成数
function incrementLessons(userId, callback) {
  db.run(
    'UPDATE user_progress SET lessons_completed = lessons_completed + 1 WHERE user_id = ?',
    [userId],
    callback
  );
}

// 增加测验完成数
function incrementQuizzes(userId, callback) {
  db.run(
    'UPDATE user_progress SET quizzes_completed = quizzes_completed + 1 WHERE user_id = ?',
    [userId],
    callback
  );
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserProgress,
  updateProgress,
  incrementLessons,
  incrementQuizzes
};
