pipeline {
    agent any

    tools {
        jdk 'jdk'
        nodejs 'node18'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=prime \
                        -Dsonar.projectName=prime \
                        -Dsonar.sources=Frontend,Backend \
                        -Dsonar.exclusions=**/node_modules/**,**/*.log,**/*.md,**/Dockerfile \
                        -Dsonar.sourceEncoding=UTF-8 \
                        -Dsonar.ws.timeout=600
                    '''
                }
            }
        }

        stage('Code Quality Gate') {
            steps {
                script {
                    // Wait for SonarQube quality gate result
                    def qg = waitForQualityGate abortPipeline: false, credentialsId: 'Sonar-token'
                    if (qg.status != 'OK') {
                        echo "⚠️  Quality gate failed: ${qg.status}"
                    } else {
                        echo "✅ Quality gate passed!"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                retry(2) {
                    sh "npm install"
                }
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

        stage('App Deploy to Docker Container') {
            steps {
                sh '''
                    docker rm -f amazon-prime-video || true
                    docker run -d --name amazon-prime-video -p 3000:3000 arulmurugan786/amazon-prime-video:latest
                '''
            }
        }
    }

    post {
        always {
            script {
                def buildStatus = currentBuild.currentResult
                def buildUser = currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')[0]?.userId ?: 'GitHub Trigger'

                emailext(
                    subject: "Pipeline ${buildStatus}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <p><b>Jenkins CI/CD Pipeline Report</b></p>
                        <p>Project: ${env.JOB_NAME}</p>
                        <p>Build Number: ${env.BUILD_NUMBER}</p>
                        <p>Status: <b>${buildStatus}</b></p>
                        <p>Triggered By: ${buildUser}</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                    """,
                    to: 'arulmuruganchinnaraj6@gmail.com',
                    from: 'arulmuruganchinnaraj6@gmail.com',
                    replyTo: 'arulmuruganchinnaraj6@gmail.com',
                    mimeType: 'text/html',
                    attachmentsPattern: 'trivy*.txt'
                )
            }
        }
    }
}
