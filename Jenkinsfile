pipeline {
  agent any

  stages {
    stage('Deploy') {
      when {
          branch 'deploys'
      }
      steps {
        sh 'ssh root@smallrobot.co;'
        sh 'su smallrobot.co;'
        sh 'cd ~/public_html;'
        sh 'git pull;'
        sh 'exit;'
        sh 'logout;'
      }
    }
  }
}