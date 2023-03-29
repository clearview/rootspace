FROM node:14-bullseye as cache

ENV CACHE_DIR /usr/src/cache

ENV NODE_ENV development

WORKDIR $CACHE_DIR

COPY yarn.lock .
COPY package.json .

RUN yarn config set cache-folder $CACHE_DIR/.yarn

RUN yarn install --production=false --network-timeout 100000

RUN yarn cache dir && \
    yarn cache list | wc -l

FROM cache as dev

RUN echo $CACHE_DIR

# Keep CACHE_DIR directory preserved between builds
RUN --mount=type=cache,target=$CACHE_DIR

RUN yarn cache dir && \
    yarn cache list | wc -l && \
    yarn config set cache-folder $CACHE_DIR/.yarn && \
    yarn cache list | wc -l

WORKDIR /opt/project


RUN yarn install --network-timeout 100000

# Add source files to the container after the packages have been installed
ADD . .

RUN yarn install && yarn build

EXPOSE 3000

RUN cp entrypoint.sh /
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]

CMD ["yarn", "serve"]
