FROM node:8.16.2-jessie

WORKDIR /opt/app

COPY . .

RUN npm install --silent
RUN npm run build:prod

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]