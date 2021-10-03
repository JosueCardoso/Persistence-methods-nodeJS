FROM node:latest
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT node app.js
EXPOSE 3000