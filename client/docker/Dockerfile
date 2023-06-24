FROM node:16-alpine as frontend_dependency_installer

WORKDIR /app

COPY client/package.json client/package-lock.json ./

RUN npm ci --ignore-scripts

FROM node:16-alpine AS build

WORKDIR /app

ARG VITE_BASE_PATH

ENV VITE_BASE_PATH=$VITE_BASE_PATH

WORKDIR /app

COPY client .

COPY --from=frontend_dependency_installer /app/node_modules ./node_modules

RUN VITE_BASE_PATH=$VITE_BASE_PATH npm run build

FROM caddy:2-alpine AS release

COPY --from=build /app/dist /usr/share/caddy

