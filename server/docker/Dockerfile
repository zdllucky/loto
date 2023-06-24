FROM node:16-alpine as backend_dependency_installer

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

FROM node:16-alpine

WORKDIR /app

ARG DATABASE_URL
ARG COOKIE_SECRET
ARG REDIS_HOST

ENV DATABASE_URL=$DATABASE_URL
ENV COOKIE_SECRET=$COOKIE_SECRET
ENV REDIS_HOST=$REDIS_HOST

COPY server server

COPY migrations migrations

COPY admin admin

COPY schema.prisma schema.graphql keystone.ts ./

COPY --from=backend_dependency_installer /app/node_modules ./node_modules

COPY --from=backend_dependency_installer /app/package.json /app/package-lock.json ./

RUN DATABASE_URL=$DATABASE_URL COOKIE_SECRET=$COOKIE_SECRET REDIS_HOST=$REDIS_HOST npm run postinstall

RUN DATABASE_URL=$DATABASE_URL COOKIE_SECRET=$COOKIE_SECRET REDIS_HOST=$REDIS_HOST npm run build

EXPOSE 3000

CMD ["npm", "run", "migrate_start"]
