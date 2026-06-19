/**
 * 西游记每日更新邮件通知脚本
 * 
 * 环境变量：
 *   QQ_EMAIL_FROM - 发送方邮箱地址
 *   QQ_EMAIL_AUTH_CODE - QQ邮箱SMTP授权码
 *   NOTIFICATION_EMAILS - 收件人邮箱列表（逗号分隔）
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 读取配置
const QQ_EMAIL_FROM = process.env.QQ_EMAIL_FROM;
const QQ_EMAIL_AUTH_CODE = process.env.QQ_EMAIL_AUTH_CODE;
const NOTIFICATION_EMAILS = process.env.NOTIFICATION_EMAILS;

if (!QQ_EMAIL_FROM || !QQ_EMAIL_AUTH_CODE || !NOTIFICATION_EMAILS) {
  console.error('❌ 缺少必要的环境变量');
  console.error('  需要：QQ_EMAIL_FROM, QQ_EMAIL_AUTH_CODE, NOTIFICATION_EMAILS');
  process.exit(1);
}

// 解析收件人列表
const recipients = NOTIFICATION_EMAILS.split(',').map(email => email.trim());
console.log(`📧 收件人：${recipients.join(', ')}`);

// 读取章节数据
const chaptersPath = path.join(_dirname, '..', 'data', 'chapters.json');
const progressPath = path.join(_dirname, '..', 'data', 'progress.json');

let chaptersData;
let progressData;
try {
  chaptersData = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
  progressData = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  console.log('✅ 成功读取章节数据');
} catch (error) {
  console.error('❌ 读取数据文件失败：', error.message);
  process.exit(1);
}

// 获取最新更新的章节（假设是 currentChapter 和 currentChapter+1）
const currentChapter = progressData.currentChapter;
const newChapters = [];

// 查找最近更新的章节（有 content 且 updateDate 是今天的）
const today = new Date().toISOString().split('T')[0];
chaptersData.chapters.forEach(ch => {
  if (ch.updateDate && ch.updateDate.startsWith(today) && ch.content && ch.content.length > 0) {
    newChapters.push(ch);
  }
});

// 如果没找到今天的更新，则取 currentChapter 之前的2章
if (newChapters.length === 0) {
  for (let i = currentChapter - 1; i >= Math.max(1, currentChapter - 2); i--) {
    const ch = chaptersData.chapters.find(c => c.id === i);
    if (ch && ch.content && ch.content.length > 0) {
      newChapters.unshift(ch);
    }
  }
}

console.log(`📖 找到 ${newChapters.length} 个新章节`);

if (newChapters.length === 0) {
  console.log('⚠️ 没有新章节需要通知');
  process.exit(0);
}

// 生成邮件内容
const siteURL = 'https://lunchwu-dev.github.io/west-journey-legend/';
let emailBody = `
🐒 西游记 · 小朋友的睡前故事 - 每日更新通知

您好！

今天的西游记连载故事已经更新啦！🎉

【新解锁章节】
`;

newChapters.forEach(ch => {
  const chapterURL = `${siteURL}?chapter=${ch.id}`;
  emailBody += `
第${ch.id}章：${ch.title}
👉 点击阅读：${chapterURL}
`;
});

emailBody += `
【故事简介】
${chaptersData.description || '师徒四人一路向西，经历九九八十一难，最终取得真经。'}

【访问网站】
🌟 首页：${siteURL}
📖 目录：${siteURL}#toc

------
西游记儿童版连载 | 每晚 22:00 准时更新
`;

const emailSubject = `🐒 西游记新故事解锁！第${newChapters.map(ch => ch.id).join('、')}回已更新`;

// 创建邮件传输器
const transporter = nodemailer.createTransporter({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 使用 SSL
  auth: {
    user: QQ_EMAIL_FROM,
    pass: QQ_EMAIL_AUTH_CODE, // QQ邮箱的SMTP授权码
  },
});

// 发送邮件
async function sendEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"西游记儿童版" <${QQ_EMAIL_FROM}>`,
      to: recipients.join(','),
      subject: emailSubject,
      text: emailBody,
      // 也可以添加 HTML 版本
      html: emailBody.replace(/\n/g, '<br>').replace(/👉 点击阅读：(.*)/g, '<a href="$1">👉 点击阅读</a>'),
    });

    console.log('✅ 邮件发送成功！');
    console.log(`   消息 ID：${info.messageId}`);
    console.log(`   收件人：${recipients.join(', ')}`);
  } catch (error) {
    console.error('❌ 邮件发送失败：', error.message);
    process.exit(1);
  }
}

sendEmail();
