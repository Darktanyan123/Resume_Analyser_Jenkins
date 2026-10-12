pipeline {
    agent any
    tools {
        nodejs 'node20'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo '=== Bước 1: Cài đặt thư viện dependencies cho Frontend ==='
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                echo '=== Bước 2: Chạy kiểm thử tự động (Kiểm tra nút Đăng ký, Đăng nhập) ==='
                dir('frontend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '=== Bước 3: Biên dịch dự án React sang thư mục dist ==='
                dir('frontend') {
                    sh 'npm run build'
                    // đóng gói

                }
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline CI/CD thành công: Mã nguồn đã vượt qua kiểm thử và build thành công!'
        }
        failure {
            echo '❌ Pipeline thất bại: Vui lòng kiểm tra lại log chi tiết ở bước lỗi.'
        }
    }
}

def version = "v0.${BUILD_NUMBER}"

pipeline {
    agent 
    {
        node 
        {
            label "civams"
        }
    }

    environment 
    {
        GITLAB_USERNAME = "nhviet1"
        GITLAB_CREDENTIAL = credentials('CI/CD')
        IMAGE_NAME = "registry.gitlab.com/ati3551546/civams-be"
        REGISTRY_URL = "registry.gitlab.com"
        VERSION = "${version}"  // Add version to the environment
    }

    stages 
    {
        stage("Check Source") 
        {
            steps 
            {
                echo "First Stage"
                git url: 'https://gitlab-local.cmcati.vn/iot/civams/v1/backend.git', branch: 'nhviet1-update-node', credentialsId: 'CI/CD'
                sh "whoami && pwd"
                script
                {
                    // Tag phụ = VERSION + mã commit (vd v0.123-cee81aa8) để biết image build từ commit nào
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.VERSION_COMMIT = "${env.VERSION}-${env.GIT_COMMIT_SHORT}"
                    echo "Commit ${env.GIT_COMMIT_SHORT} -> tag ${env.VERSION_COMMIT}"
                }
            }
        }

        stage("Scan + Test Code ...")
        {
            steps 
            {
                echo "Test Backend"
                echo "Scan code with SonarQuebe"
                echo "..... vv and may may ......"
            }
        }

        stage("Build & Push Image") 
        {
            steps 
            {
                echo "Build stage"
                script 
                {
                    withDockerRegistry(credentialsId: 'gitlab-registry-token', toolName: 'docker', url: 'https://registry.gitlab.com') 
                    {
                        echo "Starting building image !!!"
                        // Build 1 lần, gắn 2 tag cùng 1 image rồi đẩy cả hai
                        sh '''
                            sudo docker build -t ${IMAGE_NAME}:${VERSION} -t ${IMAGE_NAME}:${VERSION_COMMIT} .
                            sudo docker push ${IMAGE_NAME}:${VERSION}
                            sudo docker push ${IMAGE_NAME}:${VERSION_COMMIT}
                        '''
                    }
                    
                }
            }
        }


        stage("Deploy on server asus") 
        {
            steps {
                echo "Deploy new image !!!"

                sh '''
                    whoami
                    pwd
                    cd /home/jenkins/civams-be
                    echo IMAGE_NAME=${IMAGE_NAME} > .env
                    # Chạy bằng tag có mã commit -> APP_VERSION/APP_IMAGE của BE hiện luôn commit đang chạy
                    echo VERSION=${VERSION_COMMIT} >> .env
                    echo "Starting docker compose down"
                    sudo docker compose down
                    echo "Running new image"
                    sudo docker compose up -d
                '''
}
        }
    }
}
// echo "Starting terminate old image"
// sudo docker ps -aq --filter "name=civams-be" | xargs -r sudo docker rm -f

