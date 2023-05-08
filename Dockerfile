# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.1.0
FROM node:${NODE_VERSION}-slim as base
LABEL fly_launch_runtime="NodeJS"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# Throw-away build stage to reduce size of final image
FROM base as build

# install dependencies
COPY --link package.json yarn.lock .yarnrc.yml .
COPY .yarn/ ./.yarn/

RUN yarn install

# Copy application code
COPY --link . .

ENV NODE_ENV "production"
RUN yarn build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

ENV PORT 8080
EXPOSE 8080
CMD [ "node", "dist/server.js" ]
