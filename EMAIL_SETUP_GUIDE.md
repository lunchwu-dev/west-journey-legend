# 西游记每日更新 - 邮件通知配置指南

## ✅ 已完成的工作

### 1. GitHub Actions 定时任务
- ✅ 创建了 `.github/workflows/daily-update.yml`
- ✅ 配置为每日 22:00（北京时间）自动执行
- ✅ 执行流程：
  1. 检出代码
  2. 生成新章节内容（2章/天）
  3. 提交并推送更改
  4. 发送邮件通知

### 2. 邮件发送脚本
- ✅ 创建了 `scripts/send-notification-email.js`
- ✅ 使用 `nodemailer` 库通过 QQ 邮箱 SMTP 发送邮件
- ✅ 自动读取 `chapters.json` 和 `progress.json` 获取最新更新章节
- ✅ 生成包含章节链接的邮件内容

### 3. 文档更新
- ✅ 更新了 `ROADMAP.md`，添加了邮件通知配置说明
- ✅ 更新了 `package.json`，修正了仓库 URL

---

## ⚠️ 必需的配置步骤

### 步骤 1：获取 QQ 邮箱 SMTP 授权码

1. 登录 QQ 邮箱（lunchwu@qq.com）
2. 点击顶部 **【设置】** → **【账户】**
3. 找到 **【POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务】** 部分
4. 开启 **【IMAP/SMTP服务】**（如果还没开启）
5. 点击 **【生成授权码】**
6. 按提示用手机发送短信验证
7. **复制生成的授权码**（类似：`abcd efgh ijkl mnop`）

⚠️ **重要**：授权码只显示一次，请妥善保存！

---

### 步骤 2：在 GitHub 仓库中配置 Secrets

1. 访问：https://github.com/lunchwu-dev/west-journey-legend/settings/secrets/actions
2. 点击 **【New repository secret】** 按钮
3. 依次添加以下 3 个 secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `QQ_MAIL_FROM` | `lunchwu@qq.com` | 发送方邮箱地址 |
| `QQ_MAIL_AUTH_CODE` | `[你的授权码]` | 步骤 1 中获取的 SMTP 授权码 |
| `NOTIFICATION_EMAILS` | `lunchwu@qq.com,leanna.li@decathlon.com,tia.song@decathlon.com` | 收件人邮箱列表（逗号分隔，无空格） |

4. 每个 secret 添加完成后，点击 **【Add secret】** 保存

---

### 步骤 3：启用 GitHub Actions

1. 访问：https://github.com/lunchwu-dev/west-journey-legend/settings/actions
2. 确保 **【Actions permissions】** 选择为 **【Allow all actions and reusable workflows】**
3. 点击 **【Save】** 保存

---

### 步骤 4：测试定时任务

#### 方法 1：手动触发（推荐）
1. 访问：https://github.com/lunchwu-dev/west-journey-legend/actions
2. 在左侧选择 **【西游记每日连载更新】** workflow
3. 点击 **【Run workflow】** 按钮
4. 在弹出的窗口中，点击绿色的 **【Run workflow】** 按钮
5. 等待任务执行完成（约 1-2 分钟）
6. 检查是否收到邮件通知

#### 方法 2：等待自动执行
- 每日 22:00（北京时间）会自动触发
- 首次执行建议在当天 22:00 前手动触发一次测试

---

## 📧 邮件内容示例

**主题**：🐒 西游记新故事解锁！第11、12回已更新

**正文**：
```
🐒 西游记 · 小朋友的睡前故事 - 每日更新通知

您好！

今天的西游记连载故事已经更新啦！🎉

【新解锁章节】
第11章：大闹天宫（开始）
👉 点击阅读：https://lunchwu-dev.github.io/west-journey-legend/?chapter=11

第12章：天兵天将齐围攻
👉 点击阅读：https://lunchwu-dev.github.io/west-journey-legend/?chapter=12

【故事简介】
师徒四人一路向西，经历九九八十一难，最终取得真经。

【访问网站】
🌟 首页：https://lunchwu-dev.github.io/west-journey-legend/
📖 目录：https://lunchwu-dev.github.io/west-journey-legend/#toc

------
西游记儿童版连载 | 每晚 22:00 准时更新
```

---

## 🐛 故障排查

### 问题 1：没收到邮件
**可能原因**：
- GitHub secret 配置错误
- QQ 邮箱授权码过期
- 邮件被归类为垃圾邮件

**解决方法**：
1. 检查 GitHub Actions 执行日志（Actions 标签页 → 选择最近的 workflow run）
2. 确认 `QQ_MAIL_AUTH_CODE` secret 是否正确
3. 检查垃圾邮件文件夹

### 问题 2：GitHub Actions 执行失败
**可能原因**：
- `nodemailer` 依赖没安装
- 节点版本不兼容

**解决方法**：
1. 检查 Actions 日志中的错误信息
2. 确认 `package.json` 和 `package-lock.json` 已提交到仓库
3. 手动触发 workflow，观察执行过程

---

## 📝 下一步工作

### 实际章节生成逻辑
当前的 workflow 只是**框架**，实际的章节生成逻辑还需要实现：
- 方案 A：集成 AI API（例如 OpenAI、Claude、或者国产大模型）
- 方案 B：手动生成章节，然后推送更新
- 方案 C：使用本地脚本生成章节，然后推送到 GitHub

**建议**：先使用方案 B（手动生成），验证邮件通知功能正常后，再逐步实现自动化。

---

## 📞 联系支持

如果遇到问题，可以：
1. 查看 GitHub Actions 执行日志
2. 检查 `ROADMAP.md` 中的配置说明
3. 向我（吴八哥）寻求帮助

---

*配置指南版本：v1.0 | 创建日期：2026-06-19 | 作者：吴八哥*
