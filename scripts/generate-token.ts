const jwt = require('jsonwebtoken');

// 創建一個新的管理員 token
const token = jwt.sign(
  { 
    id: 1,
    role: 'admin'
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { 
    expiresIn: '24h' // token 24小時後過期
  }
);

console.log('新的管理員 token:');
console.log(token);
