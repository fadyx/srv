ARG API_VERSION

FROM node:18 AS builder
WORKDIR /usr/srv
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=api --docker

FROM node:18 AS installer
COPY --from=builder /usr/srv/out/json /usr/srv
COPY --from=builder /usr/srv/out/yarn.lock /usr/srv/yarn.lock
WORKDIR /usr/srv
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..."
RUN yarn install
WORKDIR /usr/srv/apps/api
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..."
RUN yarn install

FROM node:18 AS runner
LABEL version="${API_VERSION}"
COPY . /usr/srv
COPY --from=installer /usr/srv/node_modules /usr/srv/node_modules
COPY --from=installer /usr/srv/apps/api/node_modules /usr/srv/apps/api/node_modules
WORKDIR /usr/srv/apps/api

EXPOSE 9229
EXPOSE "${API_PORT}"

CMD ["yarn", "dev"]
