# syntax=docker/dockerfile:1
FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle the app source
COPY . .
# Just for CPS490 Lab 5
RUN echo "Creating a Docker image by pphung1@udayton.edu"
# the command to execute the app
CMD [ "npm", "start" ]