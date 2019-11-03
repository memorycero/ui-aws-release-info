FROM node:8.16.2-jessie

WORKDIR /opt/app

COPY . .

RUN npm install --silent

EXPOSE 8080

ENTRYPOINT ["npm", "start"]