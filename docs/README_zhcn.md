## 🌐 选择语言

<table align="center">
  <tr>
    <td align="center">
      <a href="../README.md">
        <img src="https://flagcdn.com/24x18/gb.png" alt="English" />  
        <br/><strong>English</strong>
      </a>
    </td>
    <td align="center">
      <a href="README_km.md">
        <img src="https://flagcdn.com/24x18/kh.png" alt="Khmer" />  
        <br/><strong>ខ្មែរ</strong>
      </a>
    </td>
    <td align="center">
      <a href="README_ja.md">
        <img src="https://flagcdn.com/24x18/jp.png" alt="Japanese" />  
        <br/><strong>Japanese</strong>
      </a>
    </td>
    <td align="center">
      <a href="README_zhcn.md">
        <img src="https://flagcdn.com/24x18/cn.png" alt="Chinese" />  
        <br/><strong>Chinese</strong>
      </a>
    </td>
  </tr>
</table>

<p align="center">
  感谢所有的贡献者、用户和支持者，是你们让这个项目蓬勃发展。
</p>

<p align="center">
  🚀 <strong>敬请关注更多更新、功能和改进。</strong>
</p>

![CheckCle Platform](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/server-detail-page.png)

# 🚀 CheckCle是什么？?

CheckCle 是一款开源解决方案，用于对全栈系统、应用程序和基础设施进行无缝实时监控。它为开发人员、系统管理员和 DevOps 团队提供其环境各层（无论是服务器、应用程序还是服务）的深入洞察和可操作数据。借助 CheckCle，你可以在整个技术堆栈中获得可见性、控制权以及确保最佳性能的能力。

## 🎯 在线演示  
👉 **马上试试看:** [CheckCle Live Demo](https://demo.checkcle.io)
    用户名: admin@example.com | 密码: Admin123456

## 🌟 核心功能
### 📝 开发路线图 : [DEVELOPMENT_ROADMAP](docs/DEVELOPMENT_ROADMAP.md) 

### 服务可用性与基础设施/服务器监控
- 监控 HTTP、DNS 和 Ping 协议
- 监控基于 TCP 的服务与 API（如 FTP、SMTP、HTTP）
- 跟踪详细的可用性（正常运行时间）、响应时间与性能问题
- 分布式区域监控
- 事件历史（UP / DOWN / WARNING / PAUSE：上线 / 下线 / 警告 / 暂停）
- SSL 与域名监控（域名、签发者、到期日期、剩余天数、状态、上次通知）
- 基础设施与服务器监控：支持 Linux（🐧Debian、Ubuntu、CentOS、Red Hat 等）与 Windows（Beta）；提供 CPU、内存、磁盘使用、网络活动等服务器指标；一行命令安装的 Agent 脚本
- 维护计划与事件管理
- 运行状态 / 公共状态页
- 通过电子邮件、Telegram、Discord 和 Slack 通知
- 报告与分析
- 设置面板（用户管理、数据保留、多语言、主题〔深色/浅色模式〕、通知渠道与告警模板）

## #️⃣ 入门指南

### 当前架构支持
* ✅ x86_64 PC、笔记本电脑、服务器 (amd64)
* ✅ 现代树莓派3/4/5（搭载64位操作系统）、Apple Silicon Macs (arm64)

### 使用以下方法之一安装 CheckCle ：

1. 使用Docker Compose配置进行安装（推荐）
```bash 

version: '3.9'

services:
  checkcle:
    image: operacle/checkcle:latest
    container_name: checkcle
    restart: unless-stopped
    ports:
      - "8090:8090"  # Web 应用端口
    volumes:
      - /opt/pb_data:/mnt/pb_data  # 将主机目录映射到容器路径
    ulimits:
      nofile:
        soft: 4096
        hard: 8192

```
2. 使用 docker run 进行安装。只需复制下面的 docker run 命令
```bash 
docker run -d \
  --name checkcle \
  --restart unless-stopped \
  -p 8090:8090 \
  -v /opt/pb_data:/mnt/pb_data \
  --ulimit nofile=4096:8192 \
  operacle/checkcle:latest

```

3. 网页管理

    默认网址: http://0.0.0.0:8090
    用户名: admin@example.com
    密码: Admin123456
    
4. 遵循以下快速入门指南 https://docs.checkcle.io

###
![checkcle-collapse-black](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/uptime-1.4.png)
![Service Detail Page](https://cdn.checkcle.io/images/uptime/uptime-regional-detail.png)
![checkcle-server-instance](https://cdn.checkcle.io/images/server/server-list.png)
![SSL Monitoring](https://cdn.checkcle.io/images/ssl-domain/ssl-list.png)
![Notification System](https://cdn.checkcle.io/general/powerfull_notification.png)


## 🌟 面向社区的 CheckCle

- 以热忱打造：由一位开源爱好者为社区创建
- 免费且开源：完全免费，无任何隐藏费用
- 协作与连接：结识同样热爱开源的志同道合者

---

## 赞助商
我们将不再接受赞助形式。从今以后，仅接受以生态系统和社区合作形式提供的支持，例如云服务器、域名或托管资源等基础设施支持。  

如果您是科技公司且有意支持 CheckCle ，请直接通过邮箱 tolaleng@checkcle.io 联系作者。

### 🧡 支持者
<div style="display: flex; align-items: center; gap: 10px;">
  <a href="https://github.com/gitbookio">
    <img src="https://avatars.githubusercontent.com/u/7111340?s=200&v=4" 
         width="75" height="75" 
         style="border-radius: 50%;" 
         alt="GitBook Logo" />
  </a>

  <a href="https://www.cloudflare.com">
    <img src="https://cdn.checkcle.io/images/sponsor/cloudflare-checkcle_logo.png" 
         height="60" 
         alt="Cloudflare Logo" />
  </a>
    <a href="https://m.do.co/c/0c27ef82475f">
    <img src="https://cdn.checkcle.io/images/sponsor/digitalocean_checkcle.png" 
         height="50" 
         alt="DigitalOcean Logo" />
  </a>
</div>

---


## 👥 贡献者
感谢你为让CheckCle变得更好所做出的贡献与持续努力，你太棒了 🫶

[![](https://contrib.rocks/image?repo=operacle/checkcle)](https://github.com/operacle/checkcle/graphs/contributors)

---

## 🤝 贡献方式

以下是你可以帮助改进 CheckCle 的一些方式：

- 🐞 **报告问题** – 发现故障/异常？请在提交 [GitHub Issue](https://github.com/operacle/checkcle/issues) 告诉我们。
- 🌟 **建议功能** – 有个点子？发起 [Discussion](https://github.com/operacle/checkcle/discussions) 讨论，或提交一个功能请求 [Feature Request Issue](https://github.com/operacle/checkcle/issues)。
- 🛠 **提交 Pull Request** – 改进代码、修复缺陷、添加功能，或完善文档。
- 📝 **改善文档** – 就算是修正一个错别字也很有帮助！
- 🌍 **传播项目** – 给 [CheckCle](https://github.com/operacle/checkcle.git) 仓库点个 Star ⭐，在社交平台分享，并邀请更多人参与贡献！

---

## 🌍 联系我们
- 网站: [checkcle.io](https://checkcle.io)
- 文档: [docs.checkcle.io](https://docs.checkcle.io) | 非常感谢 [GitBook](https://github.com/gitbookio) 赞助 CheckCle 的开源站点计划（OSS Site Plan）！
- 在 Discord 上聊天: 加入我们的 [@discord](https://discord.gg/xs9gbubGwX) 频道 
- 在 X 上关注我们: [@checkcle_oss](https://x.com/checkcle_oss)

## 📜 许可证

CheckCle 遵循 MIT 许可证发布。

---
