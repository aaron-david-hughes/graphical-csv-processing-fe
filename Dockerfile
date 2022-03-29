FROM node:16.11.1-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]