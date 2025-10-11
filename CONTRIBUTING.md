## 🌐 Select Language

<table align="center">
  <tr>
    <td align="center">
      <a href="CONTRIBUTING.md">
        <img src="https://flagcdn.com/24x18/gb.png" alt="English" />  
        <br/><strong>English</strong>
      </a>
    </td>
    <td align="center">
      <a href="docs/CONTRIBUTING_km.md">
        <img src="https://flagcdn.com/24x18/kh.png" alt="Khmer" />  
        <br/><strong>ខ្មែរ</strong>
      </a>
    </td>
    <td align="center">
      <a href="docs/CONTRIBUTING_ja.md">
        <img src="https://flagcdn.com/24x18/jp.png" alt="Japanese" />  
        <br/><strong>Japanese</strong>
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

# 🛠️ Contributing to CheckCle

Thank you for your interest in contributing to **CheckCle** — the ultimate open-source platform for real-time full-stack monitoring. Whether you're here to report bugs, suggest features, improve documentation, or submit code, your contribution matters!

We welcome all kinds of contributions, big or small. This guide will help you get started.

---

## 📌 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Development Setup](#-development-setup)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs & Issues](#-reporting-bugs--issues)
- [Feature Requests](#-feature-requests)
- [Community & Support](#-community--support)
- [License](#-license)

---

## 📜 Code of Conduct

We follow a [Code of Conduct](https://opensource.guide/code-of-conduct/) to foster an open and welcoming community. By participating, you agree to uphold these standards.

---

## 🤝 Ways to Contribute

Here are some ways you can help improve CheckCle:

- 🐞 **Report Bugs** – Found a glitch? Let us know by opening a [GitHub Issue](https://github.com/operacle/checkcle/issues).
- 🌟 **Suggest Features** – Have an idea? Start a [Discussion](https://github.com/operacle/checkcle/discussions) or open a Feature Request issue.
- 🛠 **Submit Pull Requests** – Improve the code, fix bugs, add features, or enhance the docs.
- 📝 **Improve Documentation** – Even a typo fix helps!
- 🌍 **Spread the Word** – Star ⭐ the repo, share it on socials, and invite others to contribute!

---

## 🧰 Development Setup

Before contributing code, set up the project locally:

### 1. Fork the Repository
Click "Fork" on [GitHub](https://github.com/operacle/checkcle) to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/yourusername/checkcle.git
cd checkcle
```

### 3. Install Dependencies
Follow the instructions in the README or project docs to install required packages and run the local development server.

### 4. Start Local Development
```bash
#Web Application
cd application/ 
npm install && npm run dev

#Server Backend
cd server
./pocketbase serve --dir pb_data 

If you're not using localhost, please run with this (./pocketbase serve --http=0.0.0.0:8090 --dir pb_data)
```

### 4. Start Service Check Operation

```bash
#Server Backend 
Start Service Operation (Check Service for PING, HTTP, TCP, DNS)

cd server/service-operation

go run main.go (you do not need to change the .env while it's the localhost connection)
```

### 5. Start Distributed Regional Agent
```bash
#### 1. Fork the Repository
Click "Fork" on [GitHub](https://github.com/operacle/Distributed-Regional-Monitoring) to create your own copy.

#### 2. Clone Your Fork
git clone https://github.com/yourusername/Distributed-Regional-Monitoring.git
cd Distributed-Regional-Monitoring

#### 3. Install Go Service (make sure you have installed the Go Service)

Copy .env.example -> .env
Change regional agent configuration in .env file
and Run: go run main.go

```
---

## ✅ Pull Request Process

1. Ensure your code follows the existing style and naming conventions.
2. Write clear, concise commit messages.
3. Push your branch and open a Pull Request (PR) on the `develop` branch.
4. Provide a meaningful PR description (what/why/how).
5. Link related issues if applicable (e.g. `Closes #12`).
6. Make sure all checks pass (e.g., linting, tests).

We’ll review your PR, request changes if needed, and merge it once ready!

---

## 🐛 Reporting Bugs & Issues

Please include as much information as possible:
- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment info (OS, browser, device, etc.)
- Screenshots or logs if applicable

Use the [Issue Tracker](https://github.com/operacle/checkcle/issues) to report.

---

## 💡 Feature Requests

We’d love to hear your ideas! Open a [Discussion](https://github.com/operacle/checkcle/discussions) or Feature Request issue. Make sure it’s not already listed in the [Roadmap](https://github.com/operacle/checkcle#development-roadmap).

---

## 🌍 Community & Support

Need help? Want to connect?

- 💬 [Join our Discord](https://discord.gg/xs9gbubGwX)
- 🗣 Start or join a [GitHub Discussion](https://github.com/operacle/checkcle/discussions)
- 🐦 Follow us on [X (Twitter)](https://x.com/tl)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## 🙏 Thank You

We’re excited to build CheckCle together — a powerful monitoring platform **for the community, by the community**. Your support means the world! 💙
