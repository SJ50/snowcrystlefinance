# build environment
FROM node:14.17-alpine
ARG PORT
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# Install Python and Git
RUN apk --no-cache add --virtual .builds-deps build-base python3 && \
    apk update && apk upgrade && \
    apk add --no-cache bash git openssh
# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache --check-cache --silent --network-timeout 500000 && \
    yarn add react-scripts@3.4.1 -g --silent

# add app
COPY . ./
RUN rm -r node_modules/@madmeerkat && \
    mv @madmeerkat node_modules

# run build
RUN yarn run build

# # expose port
# expose 3000

# start app
CMD ["npm","start"]