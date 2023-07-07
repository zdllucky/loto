FROM node:16-alpine as backend_dependency_installer

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

FROM node:16-alpine

WORKDIR /app

ARG DATABASE_URL
ARG COOKIE_SECRET
ARG REDIS_HOST
ARG FRONTEND_URL
ARG ADMIN_URL
ARG REDIS_PASSWORD

ENV ADMIN_URL=$ADMIN_URL
ENV FRONTEND_URL=$FRONTEND_URL
ENV DATABASE_URL=$DATABASE_URL
ENV COOKIE_SECRET=$COOKIE_SECRET
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD

COPY server server

COPY migrations migrations

COPY admin admin

COPY schema.prisma schema.graphql keystone.ts ./

COPY --from=backend_dependency_installer /app/node_modules ./node_modules

COPY --from=backend_dependency_installer /app/package.json /app/package-lock.json ./

RUN ADMIN_URL=$ADMIN_URL \
    FRONTEND_URL=$FRONTEND_URL \
    DATABASE_URL=$DATABASE_URL \
    COOKIE_SECRET=$COOKIE_SECRET \
    REDIS_HOST=$REDIS_HOST \
    REDIS_PASSWORD=$REDIS_PASSWORD \
    npm run postinstall

RUN ADMIN_URL=$ADMIN_URL \
    FRONTEND_URL=$FRONTEND_URL \
    DATABASE_URL=$DATABASE_URL \
    COOKIE_SECRET=$COOKIE_SECRET \
    REDIS_HOST=$REDIS_HOST \
    REDIS_PASSWORD=$REDIS_PASSWORD \
    npm run build

EXPOSE 3000

CMD ["npm", "run", "migrate_start"]
