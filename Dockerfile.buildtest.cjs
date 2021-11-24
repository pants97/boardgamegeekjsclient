FROM node:16-alpine@sha256:60ef0bed1dc2ec835cfe3c4226d074fdfaba571fd619c280474cc04e93f0ec5b AS packer
WORKDIR /usr/src/boardgamegeekclient-packfase
COPY . .
RUN yarn pack 

FROM node:16-alpine@sha256:60ef0bed1dc2ec835cfe3c4226d074fdfaba571fd619c280474cc04e93f0ec5b AS commmonjstester
ARG VERSION
RUN echo "received: ${VERSION}"
WORKDIR /usr/src/boardgamegeekclient-test
COPY --from=packer /usr/src/boardgamegeekclient-packfase/boardgamegeekclient-v${VERSION}.tgz .
COPY --from=packer /usr/src/boardgamegeekclient-packfase/buildtest/cjs/ .
ENV NODE_ENV production
RUN yarn add file:/usr/src/boardgamegeekclient-test/boardgamegeekclient-v${VERSION}.tgz
RUN adduser -D apprunneruser 
USER apprunneruser
CMD [ "yarn", "start" ]