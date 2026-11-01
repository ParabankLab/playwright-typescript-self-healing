# Author: Tamás András Péter

# Playwright TypeScript Self-Healing Automation Framework

An enterprise-grade test automation framework built with **Playwright, TypeScript, and Allure**, featuring **True Dynamic DOM Discovery** and **Strict CI/CD Governance**.

---

## 🚀 Key Features

* **True Dynamic DOM Discovery:** Unlike static fallback wrappers that require pre-defined backup selectors, this framework extracts semantic intent keywords from broken selectors at runtime, crawls the live browser DOM via `page.evaluate()`, and synthesizes the correct selector on the fly.
* **Professional POM Architecture:** Clean separation of concerns with a reusable base structure (`src/pages/`, `src/utils/`).
* **CI/CD Governance Enforcement:** Enforces strict pipeline standards. Local debugging runs remain **green** when healing occurs (with clear warning logs), while CI environments automatically turn **red** when healing is triggered, forcing developers to fix broken code before merging.
* **Allure Framework Integration:** Automatically attaches self-healing metadata and audit reports directly to Allure test results.

---

## 🏗️ Framework Architecture

```text
playwright-typescript-self-healing/
├── src/
│   ├── pages/          # Page Object Model classes (LoginPage.ts, etc.)
│   └── utils/          # Core engine (SelfHealingWrapper.ts)
├── tests/              # Test specs (login.spec.ts)
├── allure-results/     # Generated Allure run data
├── playwright.config.ts# Playwright configuration
└── README.md

```

---

## 🔍 How Self-Healing & Governance Work

1. **Failure Interception:** When a Page Object attempts to interact with a broken locator (e.g., `#invalid-username-input`), Playwright's standard timeout throws an error.
2. **Intent Parsing:** The `SelfHealingWrapper` catches the exception, cleans the string, and extracts the core semantic keyword (e.g., `username`).
3. **Runtime DOM Crawl:** The wrapper executes a live browser script to inspect visible elements (`input`, `button`, etc.), matching attributes (`name`, `id`, `placeholder`, `value`) against the keyword.
4. **Selector Synthesis:** It generates the valid selector string programmatically (e.g., `input[name="username"]`) and executes the user action.
5. **Governance Check:**
* **Local Environment:** Logs a warning and records an Allure attachment (Test stays **Green**).
* **CI Environment (`process.env.CI=true`):** Throws a governance violation error detailing the broken vs. healed selectors (Test turns **Red**).



---

## 🛠️ Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install

```

### 2. Running Tests Locally (Debugging Mode)

Local runs will successfully heal broken selectors, log warnings, and pass (**Green**):

```bash
npx playwright test

```

### 3. Simulating CI Governance (Strict Mode)

To test that your framework correctly blocks builds and turns **red** when healing occurs in CI, set the `CI` environment variable:

* **Windows (PowerShell):**
```powershell
$env:CI="true"; npx playwright test

```


* **Windows (Command Prompt):**
```cmd
set CI=true
npx playwright test

```


* **macOS / Linux:**
```bash
CI=true npx playwright test

```



---

## 📊 Generating Allure Reports

To view detailed test runs and self-healing audit attachments:

1. Generate and open the Allure report:
```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

```


2. Inspect the **Self-Healing Metadata** attachments inside the test step details to review all broken vs. healed selectors.
