# 🔐 Security Policy

## 📦 Project: [checkcle](https://github.com/operacle/checkcle)

**checkcle** is a lightweight, TypeScript-based built for uptime and server monitoring tools.

We care about the security and privacy of users running this project in production environments.

---

## 📣 Reporting a Vulnerability

If you believe you have found a security vulnerability in this project:

- **DO NOT** open a public issue to report it.
- Please report it responsibly via one of the following methods:

### 🔐 Preferred: [Report a Vulnerability via GitHub](https://github.com/operacle/checkcle/security/advisories/new)

- Use the GitHub security advisory form (private and secure).
- Attach as much detail as possible:
  - Description of the issue
  - Affected version or commit hash
  - Reproduction steps
  - Impact and any potential mitigations
  - Logs or screenshots (if available)

### 📧 Alternatively: Contact the Maintainer
- Email: `security@checkcle.io` 
- Optionally include a PGP public key for encrypted messages

We aim to respond within **3–5 business days**.

---

## ✅ Supported Versions

We support the latest stable release of `checkcle`. Security patches may also be applied to recent versions at our discretion.

| Version | Supported |
|---------|-----------|
| `main` (latest) | ✅ Yes |
| Older versions | ⚠️ Best-effort |
| Pre-release or forks | ❌ No |

---

## 🔍 Security Practices

This project adheres to the following practices to enhance security:

- 🔎 Regular vulnerability checks using `npm audit`
- ⛓️ Dependency pinning via `package-lock.json`
- ✅ Type-safe code using `TypeScript`
- 🧪 Continuous testing and CI
- 🔐 No data is stored or transmitted unless explicitly configured by the user
- 🧑‍💻 All contributions are reviewed before being merged

---

## ⚠️ Known Security Limitations

- `checkcle` makes outbound HTTPS requests to check certificate details — avoid running in untrusted or high-risk environments without proper network policies.
- Output may contain certificate metadata (e.g., CN, SANs, expiry dates) — avoid exposing this to public logs unless sanitized.
- The data may be lost upon system restarts or crashes. Always ensure that backup and recovery mechanisms are in place in production environments.

---

## 📄 License

This project is released under the [MIT License](./LICENSE). Use at your own risk. The Creator and contributors are not liable for misuse, data loss, or operational impact resulting from use of the software.

---

## 🙌 Acknowledgements

We appreciate responsible disclosures from the community. Your efforts help us make the open-source ecosystem safer for everyone.

Thanks & Regards,

— [Tola Leng](https://github.com/tolaleng)
