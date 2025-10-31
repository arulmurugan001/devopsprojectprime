pipeline {
    agent any
    tools {
        jdk 'jdk'
        nodejs 'node18'
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/arulmurugan001/devopsprojectprime.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                    sh "npm install"
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh '''
                            docker build -t amazon-prime-video .
                            docker tag amazon-prime-video arulmurugan786/amazon-prime-video:latest
                            docker push arulmurugan786/amazon-prime-video:latest
                        '''
                    }
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image arulmurugan786/amazon-prime-video:latest > trivyimage.txt"
            }
        }
        stage('App Deploy to Docker container'){
            steps{
                sh 'docker rm -f amazon-prime-video || true'
                sh 'docker run -d --name amazon-prime-video -p 3001:3000 arulmurugan786/amazon-prime-video:latest'
            }
        }
    }
    post {
    always {
        script {
            def buildStatus = currentBuild.currentResult
            def buildUser = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')[0]?.userId ?: 'Github User'
            
            emailext (
                subject: "Pipeline ${buildStatus}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>This is a Jenkins starbucks CICD pipeline status.</p>
                    <p>Project: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Build Status: ${buildStatus}</p>
                    <p>Started by: ${buildUser}</p>
                    <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                """,
                to: 'muruganarul1993@gmail.com',
                from: 'muruganarul1993@gmail.com',
                replyTo: 'muruganarul1993@gmail.com',
                mimeType: 'text/html',
            )
           }
       }

    }

}

