const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 注册
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  db.createUser(username, password, (err, userId) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ success: true, userId });
  });
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.getUserByUsername(username, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ success: true, username: user.username, userId: user.id });
  });
});

// 获取进度
app.get('/api/progress/:userId', (req, res) => {
  const userId = req.params.userId;
  
  db.getUserProgress(userId, (err, progress) => {
    if (err || !progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.json(progress);
  });
});

// 提交测验答案
app.post('/api/quiz', (req, res) => {
  const { userId, question, userAnswer, correctAnswer, topic } = req.body;
  const isCorrect = userAnswer === correctAnswer;
  
  db.updateProgress(userId, isCorrect, question, topic, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save quiz' });
    }
    if (isCorrect) {
      db.incrementQuizzes(userId, () => {});
    }
    res.json({ correct: isCorrect, correctAnswer });
  });
});

// 完成课程
app.post('/api/complete-lesson', (req, res) => {
  const { userId } = req.body;
  
  db.incrementLessons(userId, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update progress' });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});
