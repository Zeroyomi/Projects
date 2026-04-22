# 项目进度甘特图看板

生物检测仪器研发团队的项目管理看板，按周显示甘特图，支持里程碑状态追踪和人员负载一览。

## 🚀 部署到 GitHub Pages（5步）

### 第1步：下载并解压
把 `gantt-dashboard.tar.gz` 解压，你会得到一个 `gantt-dashboard` 文件夹。

### 第2步：在 GitHub 创建仓库
1. 打开 https://github.com/new
2. Repository name 填 `gantt-dashboard`
3. 选 **Public**（GitHub Pages 免费版需要公开仓库）
4. 点 **Create repository**

### 第3步：推送代码
在终端进入解压后的文件夹，执行：
```bash
cd gantt-dashboard
git init
git add .
git commit -m "init gantt dashboard"
git branch -M main
git remote add origin https://github.com/你的用户名/gantt-dashboard.git
git push -u origin main
```

### 第4步：开启 GitHub Pages
1. 进入仓库页面 → Settings → 左侧 Pages
2. Source 选 GitHub Actions
3. 等1-2分钟，GitHub Actions 会自动构建和部署

### 第5步：访问
部署完成后，你的看板地址是：
```
https://你的用户名.github.io/gantt-dashboard/
```

---

## ✏️ 如何修改数据

打开 `src/App.jsx`，文件顶部有三块数据，改完 push 到 GitHub 会自动更新：

### 改团队成员
找到 `const TEAM = [...]`，修改 name（全名）和 short（简称）：
```js
{ id: "me1", name: "张三", short: "张三", color: "#3b82f6" },
```

### 改项目和里程碑
找到 `const INITIAL_PROJECTS = [...]`，每个项目里有 milestones 数组：
```js
{
  id: "p1m4",
  name: "电子模块开发",          // 里程碑名称
  owners: ["ee1"],              // 负责人ID，对应TEAM里的id
  status: "on-track",           // 状态：done/on-track/at-risk/blocked/not-started
  start: makeDate(2026, 3, 2),  // 开始日期：年, 月, 日
  end: makeDate(2026, 4, 12),   // 结束日期
  note: ""                      // 备注（阻塞原因等）
}
```

### 状态说明
| 值 | 含义 | 颜色 |
|---|---|---|
| `done` | 已完成 | 绿色 |
| `on-track` | 正常推进 | 蓝色 |
| `at-risk` | 有风险 | 黄色 |
| `blocked` | 受阻/延期 | 红色斜纹 |
| `not-started` | 未开始 | 灰色 |

---

## 🔒 如果不想公开仓库

可以用 Netlify 或 Vercel 替代，支持私有仓库免费部署：
1. 本地执行 `npm install && npm run build`
2. 把 `dist` 文件夹拖到 netlify.com 的 deploy 页面即可
