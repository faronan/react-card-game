FROM node:12.16.1-stretch

WORKDIR /app
COPY ./package*.json /app/

RUN npm i

COPY . /app