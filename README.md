![CheckCle Platform](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/checkcle-black.png)

# 🚀 What is CheckCle?

CheckCle is an Open Source solution for seamless, real-time monitoring of full-stack systems, applications, and infrastructure. It provides developers, sysadmins, and DevOps teams with deep insights and actionable data across every layer of their environment—whether it's servers, applications, or services. With CheckCle, you gain visibility, control, and the ability to ensure optimal performance throughout your entire technology stack.

## 🎯 Live Demo  
👉 **Try it now:** [CheckCle Live Demo](https://demo.checkcle.io)

## 🌟 Core Features

### Uptime Services & Infrastructure Server Monitoring
- Monitor HTTP, DNS, and Ping protocols
- Monitor TCP-based, API services (e.g., FTP, SMTP, HTTP)
- Track detail uptime, response times, and performance issues
- Incident History (UP/DOWN/WARNING/PAUSE)
- SSL & Domain Monitoring (Domain, Issuer, Expiration Date, Days Left, Status, Last Notified)
- Infrastructure Server Monitoring, Supports Linux (🐧 Debian, Ubuntu, CentOS, Red Hat, etc.) and Windows (Beta). And Servers metrics like CPU, RAM, disk usage, and network activity) with an one-line installation angent script.
- Schedule Maintenance & Incident Management
- Operational Status / Public Status Pages
- Notifications via email, Telegram, Discord, and Slack
- Reports & Analytics
- Settings Panel (User Management, Data Retention, Multi-language, Themes (Dark & Light Mode), Notification and channels and alert templates).

## #️⃣ Getting Started

### Installation with Docker Run and Compose
1. Copy ready docker run command
```bash 
docker run -d \
  --name checkcle \
  --restart unless-stopped \
  -p 8090:8090 \
  -v /opt/pb_data:/mnt/pb_data \
  --ulimit nofile=4096:8192 \
  operacle/checkcle:latest

```
2. Docker Compose - Recommended
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
3. Admin Web Management

    Default URL: http://0.0.0.0:8090
    User: admin@example.com
    Passwd: Admin123456
    
4. Follow the Quick Start Guide at https://docs.checkcle.io

###
![checkcle-collapse-black](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/checkcle-black.png)
![Service Detail Page](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/checkcle-detailpage.png)
![Schedule Maintenance](https://pub-4a4062303020445f8f289a2fee84f9e8.r2.dev/images/maintenance-dahboard.png)

## 📝 Development Roadmap

- [x] Health check & uptime monitoring (HTTP)
- [x] Dashboard UI with live stats  
- [x] Auth with Multi-users system (admin)
- [x] Notifications (Telegram)
- [x] Docker containerization 
- [x] CheckCle Website
- [x] CheckCle Demo Server
- [x] SSL & Domain Monitoring
- [x] Schedule Maintenance 
- [x] Incident Management
- [ ] Uptime monitoring (PING - Inprogress)
- [ ] Infrastructure Server Monitoring
- [ ] Operational Status / Public Status Pages
- [ ] Uptime monitoring (TCP, PING, DNS)
- [ ] User Permission Roles & Service Group
- [ ] Notifications (Email/Slack/Discord/Signal)  
- [x] Open-source release with full documentation 

## 🌟 CheckCle for Communities?
- **Built with Passion**: Created by an open-source enthusiast for the community
- **Free & Open Source**: Completely free to use with no hidden costs
- **Collaborate & Connect**: Meet like-minded people passionate about Open Source

---

## 🤝 Ways to Contribute

Here are some ways you can help improve CheckCle:

- 🐞 **Report Bugs** – Found a glitch? Let us know by opening a [GitHub Issue](https://github.com/operacle/checkcle/issues).
- 🌟 **Suggest Features** – Have an idea? Start a [Discussion](https://github.com/operacle/checkcle/discussions) or open a Feature Request issue.
- 🛠 **Submit Pull Requests** – Improve the code, fix bugs, add features, or enhance the docs.
- 📝 **Improve Documentation** – Even a typo fix helps!
- 🌍 **Spread the Word** – Star ⭐ the repo, share it on socials, and invite others to contribute!

---

## 🌍 Stay Connected
- Website: [checkcle.io](https://checkcle.io)
- Documentation: [docs.checkcle.io](https://docs.checkcle.io)
- GitHub Repository: ⭐ [CheckCle](https://github.com/operacle/checkcle.git)
- Community Channels: Engage via discussions and issues!
- Discord: Join our community [@discord](https://discord.gg/xs9gbubGwX)
- X: [@tlengoss](https://x.com/tlengoss)

## 📜 License

CheckCle is released under the MIT License.

---

Stay informed, stay online, with CheckCle! 🌐
