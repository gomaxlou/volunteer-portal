import nodemailer from 'nodemailer';

// 郵件設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: EmailData) {
  const { name, email, subject, message } = data;

  // 寄給管理員的郵件
  const adminMail = {
    from: `"${name}" <${email}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `[網站聯絡表單] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D3748;">新的聯絡表單訊息</h2>
        <p style="color: #4A5568;"><strong>寄件者姓名：</strong> ${name}</p>
        <p style="color: #4A5568;"><strong>寄件者信箱：</strong> ${email}</p>
        <p style="color: #4A5568;"><strong>主旨：</strong> ${subject}</p>
        <div style="margin-top: 20px; padding: 20px; background-color: #F7FAFC; border-radius: 8px;">
          <p style="color: #4A5568; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  };

  // 自動回覆給用戶的郵件
  const userMail = {
    from: `"寶島志工服務團" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '感謝您的來信 - 寶島志工服務團',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D3748;">親愛的 ${name} 您好：</h2>
        <p style="color: #4A5568;">感謝您透過網站聯絡我們。我們已收到您的訊息，將會盡快回覆您。</p>
        <div style="margin-top: 20px; padding: 20px; background-color: #F7FAFC; border-radius: 8px;">
          <p style="color: #4A5568;"><strong>您的訊息內容：</strong></p>
          <p style="color: #4A5568; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="margin-top: 20px; color: #718096;">
          <p>如有緊急事項，請直接聯繫我們：</p>
          <p>電話：(02) 2345-6789</p>
          <p>地址：台北市信義區志工路123號</p>
        </div>
      </div>
    `,
  };

  // 發送郵件
  await Promise.all([
    transporter.sendMail(adminMail),
    transporter.sendMail(userMail),
  ]);
}
