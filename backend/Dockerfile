FROM node:latest
RUN mkdir -p /opt/app
WORKDIR /opt/app
ADD . .
RUN npm install


EXPOSE 3000

CMD [ "npm", "start"]
