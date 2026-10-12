def version = "v0.${BUILD_NUMBER}"

pipeline {
    agent any
    tools {
        nodejs 'node20'
    }

    environment {
        DOCKERHUB_USERNAME = "antony1552006"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/resume-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/resume-backend"
        VERSION = "${version}"
        GIT_REPO_URL = "https://github.com/ankerman2k6/Resume_Analyser.git"
        GIT_BRANCH = "frontend/candiate"
    }

    stages {
        stage("1. Check Code") {
            steps {
                echo "=== BƯỚC 1: KÉO CODE TỪ GITHUB ==="
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO_URL}"
                script {
                    // Lấy mã hash commit rút gọn (vd: a1b2c3d)
                    env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.VERSION_COMMIT = "${env.VERSION}-${env.GIT_COMMIT_SHORT}"
                    echo " Phiên bản build: ${env.VERSION_COMMIT}"
                }
            }
        }

        stage("2. Test Code") {
            parallel {
                stage("Test Frontend") {
                    steps {
                        echo "=== KIỂM THỬ FRONTEND ==="
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm test -- --passWithNoTests'
                        }
                    }
                }
                stage("Test Backend") {
                    steps {
                        echo "=== KIỂM THỬ BACKEND ==="
                        dir('backend') {
                            // Chạy unit test bằng Maven wrapper
                            sh 'chmod +x ./mvnw'
                            sh './mvnw test'
                        }
                    }
                }
            }
        }

        stage("3. Build & Push Docker Images") {
            steps {
                echo "=== BƯỚC 3: ĐÓNG GÓI VÀ ĐẨY IMAGES LÊN DOCKER HUB ==="
                script {
                    withDockerRegistry(credentialsId: 'dockerhub-credentials', toolName: 'docker') {
                        // 1. Build & Push Frontend Image
                        echo "Đang build & push Frontend Image..."
                        dir('frontend') {
                            sh """
                                docker build -t ${FRONTEND_IMAGE}:${VERSION} -t ${FRONTEND_IMAGE}:${VERSION_COMMIT} .
                                docker push ${FRONTEND_IMAGE}:${VERSION}
                                docker push ${FRONTEND_IMAGE}:${VERSION_COMMIT}
                            """
                        }

                        // 2. Build & Push Backend Image
                        echo "Đang build & push Backend Image..."
                        dir('backend') {
                            sh """
                                docker build -t ${BACKEND_IMAGE}:${VERSION} -t ${BACKEND_IMAGE}:${VERSION_COMMIT} .
                                docker push ${BACKEND_IMAGE}:${VERSION}
                                docker push ${BACKEND_IMAGE}:${VERSION_COMMIT}
                            """
                        }
                    }
                }
            }
        }

        stage("4. Deploy Containers") {
            steps {
                echo "=== BƯỚC 4: TRIỂN KHAI CONTAINERS VỚI PHIÊN BẢN MỚI ==="
                sh """
                    # Ghi tag phiên bản mới nhất vào file .env cho docker-compose
                    echo "FRONTEND_IMAGE=${FRONTEND_IMAGE}" > .env
                    echo "BACKEND_IMAGE=${BACKEND_IMAGE}" >> .env
                    echo "VERSION=${VERSION_COMMIT}" >> .env

                    echo "Dừng container cũ (nếu có)..."
                    docker compose down

                    echo "Khởi chạy container mới bằng images vừa build..."
                    docker compose up -d
                """
            }
        }
    }

    post {
        success {
            echo "🎉 Pipeline hoàn tất thành công! Đã deploy Backend & Frontend với tag ${env.VERSION_COMMIT}"
        }
        failure {
            echo "❌ Pipeline thất bại! Vui lòng kiểm tra lại log chi tiết."
        }
    }
}