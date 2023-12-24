FROM node:latest
RUN mkdir -p /opt/app
WORKDIR /opt/app
ADD . .
RUN npm install

CMD [ "npm", "start"]
