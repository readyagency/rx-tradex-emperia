FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]