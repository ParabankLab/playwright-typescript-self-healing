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
            // Archive Allure results or HTML test result folders so you can download them from the Jenkins UI
            archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
            
            // If using the Jenkins Allure Plugin, uncomment the line below:
            // allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}