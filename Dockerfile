FROM node:16.13.1-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY . ./

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]