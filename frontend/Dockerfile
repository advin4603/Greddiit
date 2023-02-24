FROM node:alpine
COPY package.json yarn.lock /frontend/
WORKDIR /frontend
RUN yarn install --pure-lockfile
COPY . /frontend
RUN yarn build
ENTRYPOINT ["yarn"]