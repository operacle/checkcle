## 🌐 Select Language

<table align="center">
  <tr>
    <td align="center">
      <a href="README.md">
        <img src="https://flagcdn.com/24x18/gb.png" alt="English" />  
        <br/><strong>English</strong>
      </a>
    </td>
    <td align="center">
      <a href="docs/README_km.md">
        <img src="https://flagcdn.com/24x18/kh.png" alt="Khmer" />  
        <br/><strong>ខ្មែរ</strong>
      </a>
    </td>
    <td align="center">
      <a href="docs/README_ja.md">
        <img src="https://flagcdn.com/24x18/jp.png" alt="Japanese" />  
        <br/><strong>Japanese</strong>
      </a>
    </td>
    <td align="center">
      <a href="docs/README_zhcn.md">
        <img src="https://flagcdn.com/24x18/cn.png" alt="Chinese" />  
        <br/><strong>Chinese</strong>
      </a>
    </td>
  </tr>
</table>

<p align="center">
  Thank you to all our contributors, users, and supporters for making this project thrive.
</p>

<p align="center">
  🚀 <strong>Stay tuned for more updates, features, and improvements.</strong>
</p>

![CheckCle Platform](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/server-detail-page.png)

# 🚀 What is CheckCle?

CheckCle is an Open Source solution for seamless, real-time monitoring of full-stack systems, applications, and infrastructure. It provides developers, sysadmins, and DevOps teams with deep insights and actionable data across every layer of their environment—whether it's servers, applications, or services. With CheckCle, you gain visibility, control, and the ability to ensure optimal performance throughout your entire technology stack.

## 🎯 Live Demo  
👉 **Try it now:** [CheckCle Live Demo](https://demo.checkcle.io)
    User: admin@example.com | Passwd: Admin123456

## 🌟 Core Features
### 📝 Roadmap : [DEVELOPMENT_ROADMAP](docs/DEVELOPMENT_ROADMAP.md) 

### Uptime Services & Infrastructure Server Monitoring 
- Monitor HTTP, DNS, and Ping protocols
- Monitor TCP-based, API services (e.g., FTP, SMTP, HTTP)
- Track detail uptime, response times, and performance issues
- Distributed Regional Monitoring
- Incident History (UP/DOWN/WARNING/PAUSE)
- SSL & Domain Monitoring (Domain, Issuer, Expiration Date, Days Left, Status, Last Notified)
- Infrastructure Server Monitoring, Supports Linux (🐧 Debian, Ubuntu, CentOS, Red Hat, etc.) and Windows (Beta). And Servers metrics like CPU, RAM, disk usage, and network activity) with an one-line installation angent script.
- Schedule Maintenance & Incident Management
- Operational Status / Public Status Pages
- Notifications via email, Telegram, Discord, and Slack
- Reports & Analytics
- Settings Panel (User Management, Data Retention, Multi-language, Themes (Dark & Light Mode), Notification and channels and alert templates).

## #️⃣ Getting Started

### Current Architecture Support
* ✅ x86_64 PCs, laptops, servers (amd64)
* ✅ Modern Raspberry Pi 3/4/5 with (64-bit OS), Apple Silicon Macs (arm64)

### Install CheckCle using one of the following methods:

1. Install with Docker Compose Configuration (Recommended)
```bash 

version: '3.9'

services:
  checkcle:
    image: operacle/checkcle:latest
    container_name: checkcle
    restart: unless-stopped
    ports:
      - "8090:8090"  # Web Application
    volumes:
      - /opt/pb_data:/mnt/pb_data  # Host directory mapped to container path
    ulimits:
      nofile:
        soft: 4096
        hard: 8192

```
2. Install with docker run. Just copy ready docker run command below
```bash 
docker run -d \
  --name checkcle \
  --restart unless-stopped \
  -p 8090:8090 \
  -v /opt/pb_data:/mnt/pb_data \
  --ulimit nofile=4096:8192 \
  operacle/checkcle:latest

```

3. Admin Web Management

    Default URL: http://0.0.0.0:8090
    User: admin@example.com
    Passwd: Admin123456
    
4. Follow the Quick Start Guide at https://docs.checkcle.io

###
![checkcle-collapse-black](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/uptime-1.4.png)
![Service Detail Page](https://cdn.checkcle.io/images/uptime/uptime-regional-detail.png)
![checkcle-server-instance](https://cdn.checkcle.io/images/server/server-list.png)
![SSL Monitoring](https://cdn.checkcle.io/images/ssl-domain/ssl-list.png)
![Notification System](https://cdn.checkcle.io/general/powerfull_notification.png)


## 🌟 CheckCle for Communities?
- **Built with Passion**: Created by an open-source enthusiast for the community
- **Free & Open Source**: Completely free to use with no hidden costs
- **Collaborate & Connect**: Meet like-minded people passionate about Open Source

---

## Sponsors
Sponsorships will no longer be accepted. From now on, support will only be accepted in the form of ecosystem and community partnerships that provide infrastructure such as cloud servers, domains, or hosting credits.

If you’re a tech company interested in supporting CheckCle, please contact the author directly at tolaleng@checkcle.io

### 🤝 Ecosystem & Community Partner
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


## 👥 Contributors
Thank you for contributing and continuously making CheckCle better, you're awesome 🫶

[![](https://contrib.rocks/image?repo=operacle/checkcle)](https://github.com/operacle/checkcle/graphs/contributors)

---

## 🤝 Ways to Contribute

Here are some ways you can help improve CheckCle:

- 🐞 **Report Bugs** – Found a glitch? Let us know by opening a [GitHub Issue](https://github.com/operacle/checkcle/issues).
- 🌟 **Suggest Features** – Have an idea? Start a [Discussion](https://github.com/operacle/checkcle/discussions) or open a Feature Request issue.
- 🛠 **Submit Pull Requests** – Improve the code, fix bugs, add features, or enhance the docs.
- 📝 **Improve Documentation** – Even a typo fix helps!
- 🌍 **Spread the Word** – Star ⭐ the [CheckCle](https://github.com/operacle/checkcle.git)  repo, share it on socials, and invite others to contribute!

---

## 🌍 Stay Connected
- Website: [checkcle.io](https://checkcle.io)
- Documentation: [docs.checkcle.io](https://docs.checkcle.io) | Big thanks to [GitBook](https://github.com/gitbookio) for sponsoring the OSS site plan for CheckCle!
- Chat on Discord: Join our community [@discord](https://discord.gg/xs9gbubGwX)
- Follow us on X: [@checkcle_oss](https://x.com/checkcle_oss)

## 📜 License

CheckCle is released under the MIT License.

---
