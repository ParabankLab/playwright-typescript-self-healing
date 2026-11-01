# Author: Tamás András Péter
# Playwright Self-Healing Test Automation Framework

An enterprise-grade test automation framework built with **TypeScript** and **Playwright**, featuring an intelligent **self-healing selector mechanism**, **Allure Reporting**, and strict **Jenkins CI/CD governance**.

---

## 🚀 Key Features

* **Self-Healing Selectors:** Automatically detects broken or stale locators, falls back to robust alternatives during execution, and logs warning events.
* **CI/CD Governance:** Enforces strict mode via `process.env.CI`—failing builds on self-healing events in CI environments to ensure flaky locators are fixed promptly.
* **Rich Reporting:** Integrated with **Allure Framework** for detailed execution logs, screenshots, traces, and self-healing metadata attachments.
* **Pipeline Automation:** Fully automated execution and report publishing via **Jenkins**.

---

## 📂 Project Structure

```text
├── .github/workflows/       # (Optional) CI workflow configurations
├── allure-results/          # Raw Allure JSON result outputs
├── src/                     # Page objects, core logic, and self-healing engine
├── tests/                   # Test specifications (e.g., login.spec.ts)
├── playwright.config.ts     # Playwright configuration & Allure reporter setup
├── Jenkinsfile              # Jenkins pipeline definition
├── package.json             # Project dependencies & scripts
└── tsconfig.json            # TypeScript configuration

```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your local machine or CI agent:

* **Node.js** (v20 or higher)
* **npm** (comes bundled with Node.js)

---

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd <repository-directory>

```


2. **Install dependencies:**
```bash
npm ci

```


3. **Install Playwright browsers:**
```bash
npx playwright install --with-deps

```



---

## 🧪 Running Tests Locally

* **Run tests in headed mode:**
```bash
npx playwright test --headed

```


* **Run tests in CI mode (Strict Self-Healing Governance):**
```bash
set CI=true
npx playwright test

```



---

## 📊 Generating & Viewing Allure Reports

1. Run your test suite to generate raw result files in the `allure-results` directory:
```bash
npx playwright test

```


2. Generate and open the interactive HTML report locally:
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

```



---

## ⚙️ CI/CD Integration (Jenkins)

The project includes a `Jenkinsfile` configured to run on Windows/Linux agents. The pipeline handles:

1. Checking out source code.
2. Installing dependencies (`npm ci`).
3. Installing required browser binaries (`npx playwright install`).
4. Executing tests with strict CI governance (`CI=true`).
5. Compiling and publishing the interactive dashboard via the **Allure Jenkins Plugin**.