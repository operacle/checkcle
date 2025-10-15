# 📍 Development Roadmap

Welcome to the official development roadmap for this project. This document outlines our plans, priorities, and direction for upcoming releases. It is intended to keep contributors, users, and stakeholders informed about the project’s evolution.

> 🔄 **Note**: This roadmap is subject to change based on feedback, urgency, or shifts in priorities.

---

## ✅ Goals and Vision

Our mission is to deliver a robust, scalable, and user-friendly solution for "uptime monitoring and server infrastructure insights".

**Core objectives:**
- Provide high performance with low resource usage
- Ensure scalability and modularity
- Focus on excellent user experience (UX)
- Maintain open-source transparency and community-driven features

---

## 🧩 Key Main Features

#### Delivery Status:
- ✅ Setup authentication and user management
- ✅ Core monitoring dashboard
- ✅ Agent communication with backend
- ✅ Docker containerization
- ✅ CheckCle Website
- ✅ CheckCle Demo Server
- ✅ SSL & Domain Monitoring
- ✅ Schedule Maintenance
- ✅ Incident Management
- ✅ Infrastructure Server Monitoring
- ✅ Operational Status / Public Status Pages
- ✅ Uptime Monitoring (HTTP, TCP, PING, DNS)
- ✅ Distributed Regional Monitoring Agent
- ✅ System Setting Panel and Mail Settings
- ✅ Data Retention & Automate Shrink
- ✅ Open-source release with documentation

---
## 🚦 Roadmap Stages

The roadmap is divided into the following stages:

| Stage | Description |
|-------|-------------|
| 🎯 Planned | Approved features or improvements that are on the schedule |
| 🔧 In Progress | Actively being developed |
| ✅ Completed | Fully implemented and tested |
| ⏳ Backlog | On hold or pending prioritization |
| 🧪 Experimental | Testing new concepts or prototypes |

---

## 🗂 Milestone Overview

### 🚀 v1.0.0-1.3.0 – Initial Release _(Target: Q2 2025)_
**Status:** ✅ Completed 
**Goal:** MVP feature completion, API stability, and core use-case readiness.

#### Key Deliverables: https://github.com/operacle/checkcle/releases

---

### 🚀 v1.4 - 1.5 – Feature Enhancements _(Target: Q3 2025)_
**Status:** ✅ Completed 
#### Tentative Features:
- [ ] ✅ Server and Service Table row clickable to detail page.
- [ ] ✅ Implement pagination for the SSL dashboard table
- [ ] ✅ Server Agent (RPM, Docker container, and general binary package) 
- [ ] ✅ Notification System (Webhook, Telegram, Discord, Slack, Email, Google Chat)
- [ ] ✅ Improve Uptime Service and Server connection update based on status and notification.
- [ ] ✅ Improve SSL perform the initial check automatically after creation 
- [ ] ✅ Rate limiting and abuse protection
- [ ] ✅ Add ntfy push notifications

### 🚀 v1.6.0 – Feature Enhancements _(Target: Q3 2025)_
**Status:** ✅ Completed 
#### Tentative Features:
- [ ] ✅ Allow user to update the schema directly from the dashboard
- [ ] ✅ Add Korean translations and update types. By @taking [#143](https://github.com/operacle/checkcle/pull/143)
- [ ] ✅ Add Simplified Chinese translation. By @sqkkyzx [#128](https://github.com/operacle/checkcle/pull/128)
- [ ] ✅ improve i18n and add new translations. @sqkkyzx [#132](https://github.com/operacle/checkcle/pull/132)
- [ ] ✅ fix(incident): unify assigned user handling with fallback and UI update. By @ghotso [#142](https://github.com/operacle/checkcle/pull/142)
- [ ] ✅ sync German translations across incident, maintenance, services & settings. By @ghotso [#141](https://github.com/operacle/checkcle/pull/141)
- [ ] ✅ fix(services-form): max retry attempts. By @ghotso [#147](https://github.com/operacle/checkcle/pull/147)
- [ ] ✅ Add Pushover notifications
- [ ] ✅ fix(ssl):  Ensure edit form saves notification_id and template_id in DB.
- [ ] ✅ Add Notifiarr notifications
- [ ] ✅ Add Gotify notifications
- [ ] ✅ Enhance the Data retention feature


### 🚀 v1.7.0 – Feature Enhancements _(Target: Q3 2025)_
**Status:** 🔧 In Progress
#### Tentative Features:
- [ ] ✅ Fix Regenerate Server Agent ID & Token without page refresh
- [ ] 🔧 Improve the uptime history bar load performance in the uptime monitoring dashboard.
- [ ] 🔧 Bugfix: recovery time not displayed correctly in incident history on Uptime dashboard
- [ ] 🔧 feat: add configurable notification support customizable delay before sending downtime notifications
- [ ] 🔧 Convert the Docker Hub from personal account to an organization (the CheckCle Docker Compose image endpoint will need to be updated).
- [ ] 🔧 Fix for the response time dashboard filter (date/time) in the uptime detail page
- [ ] 🔧 Fix the server historical loading data
- [ ] 🔧 Improve docker agent for server monitoring
- [ ] 🔧 Improve the Server Agent on Unraid
- [ ] 🔧 Server Windows Agent
- [ ] 🔧 More Uptime Service Type (HTTP keyword, HTTP json)
- [ ] 🔧 Server support with cpu temperature 
- [ ] 🔧 Server upport with multiple disks/volume
- [ ] 🔧 Server support with Multiple Network Interfaces 
- [ ] 🔧 Improve the Operational status page
- [ ] 🔧 Server network bandwidth monitoring
- [ ] 🔧 Grouping uptime services
- [ ] 🎯 Improve the Schedule and Incident for automation
- [ ] 🎯 Uptime Monitoring option for choose: HTTP/HTTPS. Add Option to Bypass SSL Verification in Uptime
- [ ] 🎯 Add 2FA support

---

## 🧠 Ideas / Community Wishlist

These are community-suggested or experimental features under review:

- [ ] OIDC Connect | OAuth2 integration
- [ ] PWA support
- [ ] Server outbound and inbound traffic usage

You’re welcome to propose features via [GitHub Discussions](https://github.com/operacle/checkcle/discussions) or open an issue with the `feature-request` template.

---

## 📌 How to Contribute

We encourage contributions from the community!  
To get involved:

- Review [CONTRIBUTING.md](../CONTRIBUTING.md) | https://docs.checkcle.io
- Check out the [Open Issues](https://github.com/operacle/checkcle/issues)
- Join us in shaping the roadmap via [Discussions](https://github.com/operacle/checkcle/discussions)

---
With ❤️ from the CheckCle  
[Website](https://checkcle.io) | [GitHub](https://github.com/operacle/checkcle)

