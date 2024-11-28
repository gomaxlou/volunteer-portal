-- Drop existing users table if exists
DROP TABLE IF EXISTS users;

-- Create new users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chinese_name TEXT NOT NULL,
    english_name TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    gender TEXT NOT NULL CHECK (gender IN ('M', 'F')),
    birthday DATE NOT NULL,
    phone TEXT NOT NULL,
    id_number TEXT NOT NULL UNIQUE,
    skills TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (
    chinese_name, english_name, username, password, email, 
    gender, birthday, phone, id_number, skills, role
) VALUES (
    '系統管理員', 'System Admin', 'admin', 
    '$2b$10$vJqCBDuJ0WWF1P7yGZkisu8vxLWsrq.JHzHndJ.7KV5ZPHxoGBnY2', -- password: admin123
    'admin@volunteer.org', 
    'M', '1990-01-01', '0912-345-678', 
    'A123456789', '系統管理,資料庫管理,網站維護', 
    'admin'
);

-- Insert test users
INSERT INTO users (
    chinese_name, english_name, username, password, email,
    gender, birthday, phone, id_number, skills, role
) VALUES 
    ('張小明', 'Ming Chang', 'mingchang', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'ming.chang@example.com', 'M', '1992-03-15', '0912-111-222', 'B234567890', '攝影,活動企劃', 'user'),
    ('李美玲', 'Mary Lee', 'marylee', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'mary.lee@example.com', 'F', '1988-07-22', '0923-222-333', 'C345678901', '教學,美術設計', 'user'),
    ('王大華', 'David Wang', 'davidwang', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'david.wang@example.com', 'M', '1995-11-30', '0934-333-444', 'D456789012', '音樂,舞蹈', 'user'),
    ('陳雅婷', 'Tina Chen', 'tinachen', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'tina.chen@example.com', 'F', '1991-05-18', '0945-444-555', 'E567890123', '心理諮商,團康活動', 'user'),
    ('林志偉', 'William Lin', 'williamlin', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'william.lin@example.com', 'M', '1987-09-25', '0956-555-666', 'F678901234', '運動指導,急救醫療', 'user'),
    ('黃佳琳', 'Karen Huang', 'karenhuang', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'karen.huang@example.com', 'F', '1993-12-08', '0967-666-777', 'G789012345', '環境保育,手工藝', 'user'),
    ('吳建志', 'Ken Wu', 'kenwu', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'ken.wu@example.com', 'M', '1994-02-14', '0978-777-888', 'H890123456', '電腦維修,程式設計', 'user'),
    ('蔡雅琪', 'Yuki Tsai', 'yukitsai', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'yuki.tsai@example.com', 'F', '1990-08-27', '0989-888-999', 'I901234567', '外語教學,導覽解說', 'user'),
    ('楊宗翰', 'Hans Yang', 'hansyang', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'hans.yang@example.com', 'M', '1989-04-11', '0990-999-000', 'J012345678', '社會工作,心理輔導', 'user'),
    ('周思怡', 'Sylvia Chou', 'sylviachou', '$2b$10$8K1p/dD6NXwZrDfuHYQQh.XD1Zr0gqxX5XW5rZ5pF5K0K5K5K5K5K', 'sylvia.chou@example.com', 'F', '1996-06-20', '0901-000-111', 'K123456789', '文書處理,活動主持', 'user');
