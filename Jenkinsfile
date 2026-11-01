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

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Self-Healing Tests') {
            steps {
                // Allows the build to continue even if tests fail, so reports can still be generated and archived
                catchError(buildResult: 'FAILURE', message: 'Tests failed, proceeding to report generation') {
                    bat 'set CI=true && npx playwright test'
                }
            }
        }
    }
    
    post {
        always {
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']],
                commandline: 'allure' // Matches the name you configured in Jenkins Tools
            ])
        }
    } }
    }
}