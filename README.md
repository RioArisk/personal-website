# 个人介绍求职网页

这是一个基于GitHub Pages的个人介绍求职网页模板，帮助您展示个人履历、技能和项目经验，为求职增添竞争力。

## 功能特点

- 响应式设计，在各种设备上都能良好显示
- 现代简洁的UI设计
- 包含个人介绍、专业技能、工作经历、教育背景、项目经验和联系方式等模块
- 平滑滚动和动画效果增强用户体验
- 易于定制和部署

## 使用说明

### 1. 克隆或下载此仓库

```bash
git clone https://github.com/你的用户名/个人介绍求职网页.git
```

### 2. 修改内容

- 编辑 `index.html` 文件，替换个人信息、工作经历、教育背景、项目经验等内容
- 将 `images/profile.jpg` 替换为您的个人照片
- 根据需要调整 `css/style.css` 中的样式
- 如需更多功能，可以修改 `js/main.js`

### 3. 部署到GitHub Pages

1. 创建一个新的GitHub仓库，命名为 `你的用户名.github.io`（这样可以使用 https://你的用户名.github.io 访问）
2. 将修改后的文件推送到该仓库：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git

# 推送到GitHub
git push -u origin main
```

3. 等待几分钟后，您的网站将在 `https://你的用户名.github.io` 上线

## 自定义建议

### 修改颜色主题

在 `css/style.css` 中，您可以通过修改以下变量来更改网站的颜色主题：

```css
:root {
    --primary-color: #2c3e50;   /* 主要颜色 */
    --secondary-color: #3498db; /* 次要颜色/强调色 */
    --text-color: #333;         /* 正文文字颜色 */
    --light-text: #777;         /* 浅色文字 */
    --background-color: #fff;   /* 背景色 */
    --section-bg: #f9f9f9;      /* 部分章节背景色 */
    --border-color: #ddd;       /* 边框颜色 */
    --success-color: #2ecc71;   /* 成功/完成颜色 */
}
```

### 添加更多内容部分

如果您想添加更多内容部分，请按以下步骤操作：

1. 在 `index.html` 中添加新的部分：

```html
<section id="新部分ID" class="section">
    <div class="container">
        <h2>新部分标题</h2>
        <!-- 内容 -->
    </div>
</section>
```

2. 在导航栏中添加链接：

```html
<li><a href="#新部分ID">新部分标题</a></li>
```

3. 在 `css/style.css` 中添加样式：

```css
/* 新部分样式 */
#新部分ID {
    /* 样式代码 */
}
```

## 注意事项

- 确保替换所有的示例内容和图片
- 保持网页内容简洁明了，突出重点
- 确保您的所有联系方式都是最新的
- 定期更新您的项目和工作经历

## 许可

MIT License 