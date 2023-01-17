FROM node:17-alpine

WORKDIR /app
COPY . .

RUN apk update && apk add bash

RUN npm install

# CMD [ "node", "src/app.js" ]
RUN /bin/bash