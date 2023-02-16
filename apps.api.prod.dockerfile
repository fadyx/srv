ARG API_VERSION

FROM node:18-alpine AS initializer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN yarn global add turbo
WORKDIR /usr/srv
COPY . .
RUN turbo prune --scope=api --docker

FROM node:18-alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
COPY .gitignore .gitignore
COPY --from=initializer /usr/srv/out/json /usr/srv
COPY --from=initializer /usr/srv/out/yarn.lock /usr/srv/yarn.lock
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..." --slient --prefix /usr/srv
WORKDIR /usr/srv
RUN yarn install
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..." --slient --prefix /usr/srv/apps/api
WORKDIR /usr/srv/apps/api
RUN yarn install

FROM node:18-alpine AS production
RUN apk add --no-cache libc6-compat
RUN apk update
COPY .gitignore .gitignore
COPY --from=initializer /usr/srv/out/json /usr/srv
COPY --from=initializer /usr/srv/out/yarn.lock /usr/srv/yarn.lock
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..." --slient --prefix /usr/srv
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..." --slient --prefix /usr/srv/apps/api
WORKDIR /usr/srv/apps/api
RUN yarn install --production --frozen-lockfile

FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
COPY --from=initializer /usr/srv/out/full /usr/srv
COPY --from=initializer /usr/srv/out/yarn.lock /usr/srv/yarn.lock
COPY --from=installer /usr/srv/node_modules /usr/srv/node_modules
COPY --from=installer /usr/srv/apps/api/node_modules /usr/srv/apps/api/node_modules
COPY turbo.json /usr/srv/turbo.json
RUN npm pkg set scripts.prepare="echo skipping prepare script because it is a ci..." --silent --prefix /usr/srv
WORKDIR /usr/srv
RUN yarn turbo run build --filter=api...

FROM node:18-alpine AS runner
LABEL version="${API_VERSION}"
RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api
USER api
COPY --from=builder /usr/srv/apps/api/dist /usr/srv/apps/api
COPY --from=production /usr/srv/node_modules /usr/srv/node_modules

CMD ["yarn", "start"]
