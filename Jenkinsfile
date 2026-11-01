pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Run Self-Healing Tests') {
            steps {
                bat 'set CI=true && npx playwright test'
            }
        }
    }
}