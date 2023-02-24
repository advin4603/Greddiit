FROM node:alpine
COPY package.json yarn.lock /backend/
WORKDIR /backend
RUN yarn install --pure-lockfile
COPY . /backend
ENTRYPOINT ["yarn"]