# 财税智眸 (CPA Radar) - 注册会计师法规雷达独立站

全自动化追踪财政部、IFRS、国家税务总局最新会计政策与监管通知，结合大模型提炼注册会计师（CPA）审计与实操指引。

## 部署流程

1. **上传到 GitHub**：解压本压缩包，并将所有文件上传至你的 GitHub 仓库。
2. **Cloudflare D1 数据库**：
   - 登录 Cloudflare 控制台，进入 `Storage & Databases` -> `D1` 创建数据库（如 `cpa-policies-db`）。
   - 在 D1 的 Console 执行 `schema.sql` 中的建表语句。
3. **Cloudflare Pages 部署**：
   - 进入 `Workers & Pages` -> `Create application` -> `Pages` -> `Connect to Git`。
   - 选择你的仓库，构建命令设为 `npm run build`，输出目录为 `.next`（或根据预设选择）。
   - 在 Settings -> Bindings 绑定 D1 数据库，变量名为 `DB`。
4. **GitHub Actions 定时配置**：
   - 在仓库 Settings -> Secrets 中填入 `AI_API_KEY`、`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_D1_DATABASE_ID`。
