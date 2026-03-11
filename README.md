# velzon-typescript
velzon-typescript

##autodeploy
##create a file inside 
.github/workflows/deploy.yml
name: Deploy Kan-Dashboard Build

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm install
      - run: npm run build

      # Zip build folder
      - name: Zip Build Folder
        run: zip -r build.zip build

      # Copy zip file
      - name: Copy Zip to EC2
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "build.zip"
          target: "/home/ubuntu/kan-dashboard"

      # Unzip and reload
      - name: Deploy on EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/kan-dashboard
            rm -rf build
            unzip -o build.zip
            rm build.zip
            docker compose -f docker-compose.yml down
            docker compose -f docker-compose.yml up -d

##add secrets inside github project
Step-by-Step: Add Secrets in GitHub

Go to your repository

Click Settings

Click Secrets and variables

Click Actions

Click New repository secret
EC2_HOST
3.xx.xxx.xxx   (your EC2 public IP)
EC2_USER
ubuntu

EC2_SSH_KEY
Open your .pem file
👉 Copy entire content:

-----BEGIN RSA PRIVATE KEY-----
....
-----END RSA PRIVATE KEY-----

## permission to docker
sudo usermod -aG docker ubuntu
