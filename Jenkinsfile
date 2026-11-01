pipeline {
    agent any

    tools {
        nodejs "NodeJS 20" // Match your Node.js version tool name configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci' // Use 'sh "npm ci"' if your Jenkins agent runs on Linux/Mac
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install --with-deps' // Use 'sh ...' on Linux/Mac
            }
        }

        stage('Run Self-Healing Tests') {
            steps {
                // CI=true enables your strict governance gate (fails on fallback triggers)
                bat 'set CI=true && npx playwright test' // Use 'CI=true npx playwright test' on Linux/Mac
            }
        }
    }
}